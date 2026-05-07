#!/usr/bin/env python3
"""
MWS Viewer Server
- Serves the static viewer HTML
- Proxies Quantimet API requests (login, device list, CSV export)
- Caches auth token (1h) and device list (5min)
"""

import collections
import datetime
import json
import os
import threading
import time

import numpy as np
import pandas as pd
import ppigrf
import requests
from flask import Flask, Response, jsonify, request, send_from_directory

try:
    import serial
    import serial.tools.list_ports
    HAS_SERIAL = True
except ImportError:
    HAS_SERIAL = False

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE  = os.path.join(BASE_DIR, 'mws_config.json')
QUANTIMET    = 'https://portal.quantimet.com:3001'
EXPORT_HOURS = 72   # default look-back window for CSV export
SERIAL_LOG   = os.path.join(BASE_DIR, 'serial_log.txt')
SERIAL_BAUD  = 9600

app = Flask(__name__)

# ── In-memory cache ────────────────────────────────────────────────────────────
_lock    = threading.Lock()
_token   = {'value': None, 'expires': 0.0}
_devs    = {'list': None,  'fetched': 0.0}
_session = requests.Session()   # persists cookies across requests


def _load_cfg():
    with open(CONFIG_FILE, encoding='utf-8') as fh:
        return json.load(fh)


def _do_login(cfg):
    """POST /user/login → raw token string (session cookies are retained)."""
    r = _session.post(
        f'{QUANTIMET}/user/login',
        json={'username': cfg['username'], 'password': cfg['password']},
        timeout=15,
    )
    r.raise_for_status()
    print(f'[LOGIN] cookies after login: {dict(_session.cookies)}')
    return r.json()['token']


def get_token() -> str:
    """Return a valid Bearer token, logging in if necessary."""
    with _lock:
        if _token['value'] and time.time() < _token['expires']:
            return _token['value']
        cfg = _load_cfg()
        tok = _do_login(cfg)
        _token['value']   = tok
        _token['expires'] = time.time() + 3500   # refresh ~1 min before 1h mark
        return tok


def _auth_headers(token: str) -> dict:
    return {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}


def _portal_headers(token: str) -> dict:
    return {
        **_auth_headers(token),
        'Origin':  'https://portal.quantimet.com',
        'Referer': 'https://portal.quantimet.com/',
    }


def _retry_on_401(fn):
    """Call fn(token). On 401, force re-login and retry once."""
    token = get_token()
    r = fn(token)
    if r.status_code == 401:
        with _lock:
            _token['expires'] = 0   # invalidate cache
        token = get_token()
        r = fn(token)
    r.raise_for_status()
    return r


def get_devices() -> list:
    """Return device list, using a 5-minute cache."""
    with _lock:
        if _devs['list'] is not None and time.time() < _devs['fetched'] + 300:
            return _devs['list']

    cfg = _load_cfg()

    def fetch(token):
        return _session.get(
            f'{QUANTIMET}/user/units',
            params={'email': cfg['username']},
            headers=_auth_headers(token),
            timeout=15,
        )

    r = _retry_on_401(fetch)
    body = r.json()
    devices = body['devicesWithBasicInfo']

    with _lock:
        _devs['list']    = devices
        _devs['fetched'] = time.time()

    return devices


# ── Serial port state ─────────────────────────────────────────────────────────
_ser_lock = threading.Lock()
_ser = {
    'port':    None,
    'thread':  None,
    'stop':    None,
    'buf':     collections.deque(maxlen=2000),
    'log':     None,
    'status':  'disconnected',
    'error':   '',
    'count':   0,
}


def _load_serial_log():
    """Pre-fill buffer from existing log file on server start."""
    if not os.path.exists(SERIAL_LOG):
        return
    try:
        with open(SERIAL_LOG, encoding='utf-8', errors='replace') as fh:
            for line in fh:
                line = line.strip()
                if line:
                    _ser['buf'].append(line)
        _ser['count'] = len(_ser['buf'])
    except Exception:
        pass


_load_serial_log()


def _open_serial_port(port: str, baud: int, timeout: float = 1):
    """
    Open a serial port and return a readline()-capable object.
    Uses raw POSIX calls (os/termios) on macOS/Linux to work around
    pyserial 3.5 + Python 3.13 tcsetattr incompatibility (errno 22).
    Falls back to pyserial on Windows.
    """
    if os.name == 'nt':
        return serial.Serial(port, baud, timeout=timeout)

    import fcntl
    import select as _select
    import termios as _termios

    _BAUDS = {
        1200:   _termios.B1200,   2400:  _termios.B2400,
        4800:   _termios.B4800,   9600:  _termios.B9600,
        19200:  _termios.B19200,  38400: _termios.B38400,
        57600:  _termios.B57600,  115200: _termios.B115200,
    }

    fd = os.open(port, os.O_RDWR | os.O_NOCTTY | os.O_NONBLOCK)
    try:
        fcntl.fcntl(fd, fcntl.F_SETFL, 0)          # switch to blocking I/O
        attrs      = list(_termios.tcgetattr(fd))    # get current settings
        baud_const = _BAUDS.get(baud, _termios.B9600)
        attrs[0] = _termios.IGNBRK | _termios.IGNPAR  # iflag
        attrs[1] = 0                                    # oflag
        attrs[2] = _termios.CS8 | _termios.CREAD | _termios.CLOCAL  # cflag
        attrs[3] = 0                                    # lflag
        attrs[4] = baud_const                           # ispeed
        attrs[5] = baud_const                           # ospeed
        # attrs[6] = cc — keep whatever tcgetattr returned (avoids EINVAL)
        _termios.tcsetattr(fd, _termios.TCSAFLUSH, attrs)
    except Exception:
        os.close(fd)
        raise

    class _Port:
        """Minimal serial-like object backed by a raw fd."""
        def readline(self_inner):
            buf = b''
            while True:
                r, _, _ = _select.select([fd], [], [], timeout)
                if not r:
                    return buf          # timeout → return what we have
                ch = os.read(fd, 1)
                if not ch:
                    return buf
                buf += ch
                if ch == b'\n':
                    return buf

        def close(self_inner):
            try:
                os.close(fd)
            except OSError:
                pass

    return _Port()


def _finalize_serial_packet(lines):
    packet = '  '.join(lines).strip()
    if not packet.endswith(';'):
        packet += '  ;'
    with _ser_lock:
        _ser['buf'].append(packet)
        _ser['count'] += 1
        log = _ser['log']
    if log:
        try:
            log.write(packet + '\n')
            log.flush()
        except Exception:
            pass


def _serial_reader():
    port_obj = _ser['port']
    stop_evt = _ser['stop']
    current  = []

    with _ser_lock:
        _ser['status'] = 'connected'

    try:
        while not stop_evt.is_set():
            try:
                raw = port_obj.readline()
            except Exception as exc:
                with _ser_lock:
                    _ser['status'] = 'error'
                    _ser['error']  = str(exc)
                break
            line = raw.decode('ascii', errors='replace').strip()
            if not line:
                continue
            if line.startswith('@I:'):
                if current:
                    _finalize_serial_packet(current)
                current = []
            elif line.startswith('@0'):
                if current:
                    _finalize_serial_packet(current)
                current = [line]
            elif current:
                current.append(line)
    finally:
        if current:
            _finalize_serial_packet(current)
        with _ser_lock:
            if _ser['status'] == 'connected':
                _ser['status'] = 'disconnected'


# ── API routes ─────────────────────────────────────────────────────────────────

@app.route('/api/declination')
def api_declination():
    """Compute IGRF magnetic declination locally via ppigrf (no external API needed)."""
    try:
        lat = float(request.args['lat'])
        lon = float(request.args['lon'])
    except (KeyError, ValueError):
        return jsonify({'error': 'lat and lon required'}), 400
    try:
        today = pd.Timestamp(datetime.date.today())
        Be, Bn, _ = ppigrf.igrf(lon, lat, 0, today)
        decl = float(np.degrees(np.arctan2(Be[0], Bn[0])))
        return jsonify({'declination': round(decl)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/devices')
def api_devices():
    """Return simplified device list for the viewer's device picker."""
    try:
        raw = get_devices()
        result = []
        for d in raw:
            result.append({
                'id':    d['id'],
                'imei':  d['imei'],
                'name':  d.get('name') or d['imei'],
                'modem': d.get('modem', ''),
            })
        return jsonify(result)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(exc), 'type': type(exc).__name__}), 500


@app.route('/api/images')
def api_images():
    """Return image timestamps for a device (last N hours)."""
    imei  = request.args.get('imei', '').strip()
    hours = int(request.args.get('hours', 48))
    if not imei:
        return jsonify({'error': 'imei parameter required'}), 400
    try:
        devices = get_devices()
        device  = next((d for d in devices if d['imei'] == imei), None)
        if device is None:
            return jsonify({'error': f'Device {imei} not found'}), 404
        now_ms   = int(time.time() * 1000)
        start_ms = now_ms - hours * 3_600_000

        def fetch(token):
            return _session.get(
                f'{QUANTIMET}/unit/entries/timestamps',
                params={'deviceId': device['id'], 'startTs': start_ms},
                headers=_auth_headers(token),
                timeout=15,
            )

        r = _retry_on_401(fetch)
        timestamps = r.json().get('timestamp', [])
        return jsonify({'timestamps': timestamps, 'imei': imei})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/command', methods=['POST'])
def api_command():
    """Send an MWS command via Quantimet API."""
    body    = request.get_json(force=True) or {}
    imei    = body.get('imei', '').strip()
    command = body.get('command', '').strip()

    if not imei or not command:
        return jsonify({'error': 'imei and command required'}), 400

    try:
        devices = get_devices()
        device  = next((d for d in devices if d['imei'] == imei), None)
        if device is None:
            return jsonify({'error': f'Device {imei} not found'}), 404

        cfg    = _load_cfg()
        now_ms = int(time.time() * 1000)

        modem  = device.get('modem', '') or ''
        method = 'MWSCellCommands' if modem == 'Cellular' else 'MWSCommands'

        payload = {
            'deviceId': device['id'],
            'options': {
                'method': method,
                'params': {
                    'CmdSendDate':     now_ms,
                    'Command':         [command],
                    'DestinationIMEI': [imei],
                    'DeviceType':      ['MWS'],
                    'Issuer':          [cfg['username']],
                    'Modem':           [modem],
                },
                'timeout': 5000,
            },
        }

        def fetch(token):
            return _session.post(
                f'{QUANTIMET}/unit/commands/send',
                json=payload,
                headers=_portal_headers(token),
                timeout=15,
            )

        r = _retry_on_401(fetch)
        print(f'[CMD] payload={payload}')
        print(f'[CMD] status={r.status_code} body={r.text!r}')
        return jsonify({'result': r.text.strip() or 'Command Sent Ok', 'status': r.status_code})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/serial/ports')
def api_serial_ports():
    if not HAS_SERIAL:
        return jsonify({'error': 'pyserial not installed'}), 503
    ports = [{'device': p.device, 'description': p.description}
             for p in serial.tools.list_ports.comports()]
    return jsonify({'ports': ports})


@app.route('/api/serial/connect', methods=['POST'])
def api_serial_connect():
    if not HAS_SERIAL:
        return jsonify({'error': 'pyserial not installed'}), 503
    body = request.get_json(force=True) or {}
    port = body.get('port', '').strip()
    baud = int(body.get('baud', SERIAL_BAUD))
    if not port:
        return jsonify({'error': 'port required'}), 400

    with _ser_lock:
        if _ser['status'] == 'connected':
            return jsonify({'error': 'already connected'}), 409

    try:
        port_obj = _open_serial_port(port, baud, timeout=1)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500

    stop_evt = threading.Event()
    log_fh   = open(SERIAL_LOG, 'a', encoding='utf-8')

    with _ser_lock:
        _ser['port']   = port_obj
        _ser['stop']   = stop_evt
        _ser['log']    = log_fh
        _ser['error']  = ''
        _ser['status'] = 'connecting'

    t = threading.Thread(target=_serial_reader, daemon=True)
    with _ser_lock:
        _ser['thread'] = t
    t.start()

    return jsonify({'ok': True, 'port': port, 'baud': baud})


@app.route('/api/serial/disconnect', methods=['POST'])
def api_serial_disconnect():
    with _ser_lock:
        stop = _ser['stop']
        port_obj = _ser['port']
        log_fh   = _ser['log']

    if stop:
        stop.set()
    if port_obj:
        try:
            port_obj.close()
        except Exception:
            pass
    if log_fh:
        try:
            log_fh.close()
        except Exception:
            pass

    with _ser_lock:
        _ser['port']   = None
        _ser['stop']   = None
        _ser['log']    = None
        _ser['thread'] = None
        _ser['status'] = 'disconnected'

    return jsonify({'ok': True})


@app.route('/api/serial/status')
def api_serial_status():
    with _ser_lock:
        return jsonify({
            'status': _ser['status'],
            'error':  _ser['error'],
            'count':  _ser['count'],
            'available': HAS_SERIAL,
        })


@app.route('/api/serial/data')
def api_serial_data():
    since = int(request.args.get('since', 0))
    with _ser_lock:
        buf   = list(_ser['buf'])
        total = _ser['count']

    buf_start = total - len(buf)   # global index of buf[0]
    if since <= buf_start:
        packets = buf
    elif since >= total:
        packets = []
    else:
        packets = buf[since - buf_start:]

    return Response(
        '\n'.join(packets),
        mimetype='text/plain; charset=utf-8',
        headers={'X-Total-Count': str(total)},
    )


@app.route('/api/data')
def api_data():
    """
    Fetch a CSV export for one device.
    Query params:
        imei  – required
        hours – optional, default 24
    """
    imei  = request.args.get('imei', '').strip()
    hours = int(request.args.get('hours', EXPORT_HOURS))

    if not imei:
        return jsonify({'error': 'imei parameter required'}), 400

    try:
        devices = get_devices()
        device  = next((d for d in devices if d['imei'] == imei), None)
        if device is None:
            return jsonify({'error': f'Device {imei} not found'}), 404

        now_ms   = int(time.time() * 1000)
        start_ms = now_ms - hours * 3_600_000

        def fetch(token):
            return _session.post(
                f'{QUANTIMET}/unit/entries/export',
                json={'device': device, 'startTime': start_ms, 'endTime': now_ms},
                headers=_auth_headers(token),
                timeout=60,
            )

        r = _retry_on_401(fetch)

        # API returns a JSON array; each entry has fullPacket.value with the @0deN string
        entries = r.json()
        lines = []
        for entry in entries:
            fp = entry.get('fullPacket', {})
            packet = fp.get('value', '') if isinstance(fp, dict) else ''
            if not packet:
                continue
            # Collapse \r\n to spaces → single-line @0deN format the viewer expects
            packet = packet.replace('\r\n', '  ').strip()
            if not packet.endswith(';'):
                packet += '  ;'
            lines.append(packet)

        return Response(
            '\n'.join(lines),
            mimetype='text/plain; charset=utf-8',
        )
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


# ── Static file serving ────────────────────────────────────────────────────────

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'mws-viewer_16.html')


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='MWS Viewer Server')
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()

    print(f'MWS Viewer läuft auf http://{args.host}:{args.port}')
    app.run(host=args.host, port=args.port, debug=False, threaded=True)

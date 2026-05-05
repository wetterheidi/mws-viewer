#!/usr/bin/env python3
"""
MWS Viewer Server
- Serves the static viewer HTML
- Proxies Quantimet API requests (login, device list, CSV export)
- Caches auth token (1h) and device list (5min)
"""

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

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE  = os.path.join(BASE_DIR, 'mws_config.json')
QUANTIMET    = 'https://portal.quantimet.com:3001'
EXPORT_HOURS = 72   # default look-back window for CSV export

app = Flask(__name__)

# ── In-memory cache ────────────────────────────────────────────────────────────
_lock   = threading.Lock()
_token  = {'value': None, 'expires': 0.0}
_devs   = {'list': None,  'fetched': 0.0}


def _load_cfg():
    with open(CONFIG_FILE, encoding='utf-8') as fh:
        return json.load(fh)


def _do_login(cfg):
    """POST /user/login → raw token string."""
    r = requests.post(
        f'{QUANTIMET}/user/login',
        json={'username': cfg['username'], 'password': cfg['password']},
        timeout=15,
    )
    r.raise_for_status()
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
        return requests.get(
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
        return jsonify({'declination': round(decl, 4)})
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
                'id':   d['id'],
                'imei': d['imei'],
                'name': d.get('name') or d['imei'],
            })
        return jsonify(result)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(exc), 'type': type(exc).__name__}), 500


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
            return requests.post(
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

# MWS Viewer

Browser-basierter Viewer für Daten der **MWS** (Modular Weather Station) — unterstützt lokale CSV-Dateien und Live-Daten via Quantimet-Portal.

## Betriebsmodi

| Modus | Zugang | Wann verwenden |
|---|---|---|
| **Hosted** | https://mwsviewer.wetterheidi.de | Normalfall, immer erreichbar |
| **Lokal (macOS)** | Doppelklick auf `start_mws_viewer.command` | Offline / ohne Netz |

---

## Datenquellen im Viewer

### CSV-Datei (lokal)
- Schaltfläche **"CSV öffnen"** → monatliche Exportdatei auswählen (`300534067081240_2026-04.csv`)
- Auto-Polling alle 5 Minuten solange die Datei geöffnet ist

### Quantimet Live-Daten
- **"↻ Geräteliste"** → lädt verfügbare MWS-Geräte vom Portal
- Gerät auswählen → **"🌐 Laden"** → zeigt die letzten 72 Stunden
- Auto-Polling alle 5 Minuten (holt jeweils die letzten 72h neu)

---

## Lokale Einrichtung (macOS, Erstinstallation)

```bash
# 1. Verzeichnis klonen
git clone https://github.com/wetterheidi/mws-viewer.git
cd mws-viewer

# 2. Quantimet-Zugangsdaten eintragen
cp mws_config.json.template mws_config.json
nano mws_config.json   # username + password eintragen

# 3. Starten
chmod +x start_mws_viewer.command
./start_mws_viewer.command
```

Beim ersten Start wird automatisch ein Python-venv angelegt und alle Abhängigkeiten installiert.

---

## Server-Deployment (Ubuntu/Debian)

Voraussetzungen: nginx, certbot, Python 3, systemd. DNS-Eintrag (`A mwsviewer → Server-IP`) muss gesetzt sein.

```bash
# Einmalig als root auf dem Server:
bash <(curl -fsSL https://raw.githubusercontent.com/wetterheidi/mws-viewer/main/deploy/setup-server.sh)

# Danach Zugangsdaten eintragen:
nano /apps/mws-viewer/mws_config.json
systemctl restart mws-viewer
```

### Updates einspielen

```bash
ssh root@<server-ip>
git -C /apps/mws-viewer pull
systemctl restart mws-viewer
```

### Dienst-Verwaltung

```bash
systemctl status mws-viewer     # Status prüfen
systemctl restart mws-viewer    # Neustart
journalctl -u mws-viewer -f     # Live-Log
```

---

## Dateien

| Datei | Zweck |
|---|---|
| `mws-viewer_16.html` | Viewer (HTML/JS, alle Logik im Browser) |
| `mws_server.py` | Flask-Proxy: Quantimet-Auth, Geräteliste, Datenexport |
| `mws_config.json` | Quantimet-Zugangsdaten (**nicht im Repo**, gitignored) |
| `mws_config.json.template` | Vorlage für mws_config.json |
| `requirements.txt` | Python-Abhängigkeiten (flask, requests) |
| `start_mws_viewer.command` | macOS-Starter (Doppelklick im Finder) |
| `deploy/nginx-mws-viewer.conf` | nginx-Config (Port 80, SSL via certbot) |
| `deploy/mws-viewer.service` | systemd-Unit |
| `deploy/setup-server.sh` | Ersteinrichtungs-Script |

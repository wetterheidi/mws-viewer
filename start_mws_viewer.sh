#!/bin/bash
# MWS Viewer starten — Linux
cd "$(dirname "$0")"

# Python venv beim ersten Start anlegen
if [ ! -d venv ]; then
    echo "Ersteinrichtung: Python-Umgebung wird erstellt (einmalig)..."
    python3 -m venv venv
    venv/bin/pip install --quiet --upgrade pip
    venv/bin/pip install --quiet -r requirements.txt
    echo "Fertig."
fi

# Freien Port ermitteln
PORT=8080
ss -ln | grep -q ":$PORT " && PORT=8081

# Browser nach kurzer Pause öffnen
(sleep 1.0 && xdg-open "http://localhost:$PORT/" 2>/dev/null) &

echo "MWS Viewer läuft auf http://localhost:$PORT"
echo "Strg+C beendet den Server."
venv/bin/python mws_server.py --host 127.0.0.1 --port $PORT

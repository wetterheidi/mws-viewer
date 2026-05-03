#!/bin/bash
# MWS Viewer starten — Doppelklick im Finder genügt
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
lsof -i :$PORT > /dev/null 2>&1 && PORT=8081

# Browser nach kurzer Pause öffnen
(sleep 1.0 && open "http://localhost:$PORT/") &

echo "MWS Viewer läuft auf http://localhost:$PORT"
echo "Fenster schließen beendet den Server."
venv/bin/python mws_server.py --host 127.0.0.1 --port $PORT

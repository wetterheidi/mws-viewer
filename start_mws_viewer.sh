#!/bin/bash
# MWS Viewer starten — Linux
cd "$(dirname "$0")"

# Python venv beim ersten Start anlegen
if [ ! -d venv ]; then
    echo "Ersteinrichtung: Python-Umgebung wird erstellt (einmalig)..."
    python3 -m venv venv
    if [ -d wheels ]; then
        # Offline: Pakete aus dem mitgebrachten Ordner wheels/ (README, „Offline-Betrieb")
        venv/bin/pip install --quiet --no-index --find-links wheels -r requirements.txt
    else
        venv/bin/pip install --quiet --upgrade pip
        venv/bin/pip install --quiet -r requirements.txt
    fi
    if [ $? -ne 0 ]; then
        # Halbfertiges venv entfernen, sonst gilt die Einrichtung beim nächsten Start als erledigt
        rm -rf venv
        echo "FEHLER: Python-Pakete konnten nicht installiert werden."
        echo "Die Ersteinrichtung braucht Internet oder einen Ordner 'wheels' (siehe README, Offline-Betrieb)."
        exit 1
    fi
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

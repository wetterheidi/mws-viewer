#!/bin/bash
# MWS Viewer – Server-Ersteinrichtung
# Aufruf: sudo bash deploy/setup-server.sh
set -e

APP_DIR=/apps/mws-viewer
DOMAIN=mwsviewer.wetterheidi.de
NGINX_CONF=/etc/nginx/sites-available/$DOMAIN

echo "=== MWS Viewer Setup ==="

# 1. App-Verzeichnis anlegen und Dateien kopieren
mkdir -p "$APP_DIR"
rsync -av --exclude='venv' --exclude='__pycache__' --exclude='*.pyc' \
      --exclude='mws_config.json' . "$APP_DIR/"
chown -R www-data:www-data "$APP_DIR"

# 2. Python venv einrichten
cd "$APP_DIR"
python3 -m venv venv
venv/bin/pip install --quiet --upgrade pip
venv/bin/pip install --quiet -r requirements.txt

# 3. Config anlegen wenn nicht vorhanden
if [ ! -f "$APP_DIR/mws_config.json" ]; then
    cp mws_config.json.template "$APP_DIR/mws_config.json"
    chown www-data:www-data "$APP_DIR/mws_config.json"
    echo ""
    echo "WICHTIG: Quantimet-Zugangsdaten eintragen:"
    echo "  nano $APP_DIR/mws_config.json"
    echo ""
fi

# 4. nginx konfigurieren
cp deploy/nginx-mws-viewer.conf "$NGINX_CONF"
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/$DOMAIN
nginx -t && systemctl reload nginx

# 5. SSL via certbot
certbot --nginx -d "$DOMAIN"

# 6. systemd-Dienst einrichten
cp deploy/mws-viewer.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable mws-viewer
systemctl restart mws-viewer

echo ""
echo "=== Setup abgeschlossen ==="
echo "Viewer: https://$DOMAIN"
echo "Status: systemctl status mws-viewer"

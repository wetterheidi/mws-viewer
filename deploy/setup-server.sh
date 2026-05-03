#!/bin/bash
# MWS Viewer – Server-Ersteinrichtung
# Aufruf: sudo bash deploy/setup-server.sh
set -e

APP_DIR=/apps/mws-viewer
REPO=https://github.com/wetterheidi/mws-viewer.git
DOMAIN=mwsviewer.wetterheidi.de
NGINX_CONF=/etc/nginx/sites-available/$DOMAIN

echo "=== MWS Viewer Setup ==="

# 1. Repo klonen oder aktualisieren
if [ -d "$APP_DIR/.git" ]; then
    echo "Repo vorhanden – aktualisiere..."
    git -C "$APP_DIR" pull
else
    git clone "$REPO" "$APP_DIR"
fi
chown -R www-data:www-data "$APP_DIR"

# 2. Python venv einrichten
cd "$APP_DIR"
python3 -m venv venv
venv/bin/pip install --quiet --upgrade pip
venv/bin/pip install --quiet -r requirements.txt

# 3. Config anlegen wenn nicht vorhanden
if [ ! -f "$APP_DIR/mws_config.json" ]; then
    cp "$APP_DIR/mws_config.json.template" "$APP_DIR/mws_config.json"
    chown www-data:www-data "$APP_DIR/mws_config.json"
    echo ""
    echo "WICHTIG: Quantimet-Zugangsdaten eintragen:"
    echo "  nano $APP_DIR/mws_config.json"
    echo ""
fi

# 4. nginx konfigurieren
cp "$APP_DIR/deploy/nginx-mws-viewer.conf" "$NGINX_CONF"
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/$DOMAIN
nginx -t && systemctl reload nginx

# 5. SSL via certbot
certbot --nginx -d "$DOMAIN"

# 6. systemd-Dienst einrichten
cp "$APP_DIR/deploy/mws-viewer.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable mws-viewer
systemctl restart mws-viewer

echo ""
echo "=== Setup abgeschlossen ==="
echo "Viewer: https://$DOMAIN"
echo "Status: systemctl status mws-viewer"

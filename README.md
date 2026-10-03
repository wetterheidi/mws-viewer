# MWS Viewer

Browser-basierter Viewer für Daten der **MWS** (Modular Weather Station) — unterstützt lokale CSV-Dateien und Live-Daten via Quantimet-Portal.

## Betriebsmodi

| Modus | Zugang | Wann verwenden |
|---|---|---|
| **Hosted** | https://mwsviewer.wetterheidi.de | Normalfall, immer erreichbar |
| **Lokal (macOS)** | Doppelklick auf `start_mws_viewer.command` | Offline / ohne Netz |

---

## Offline-Betrieb

Der Viewer läuft lokal komplett ohne Internet. Alles Nötige liegt im Repo:
Chart.js ist in die HTML eingebettet, Schriften liegen unter `vendor/fonts/`,
das GRAMET-Modul unter `vendor/mws-gramet.js`, und die Missweisung rechnet
der Server lokal (ppigrf/IGRF). Was sonst Internet braucht, hat einen Fallback
oder meldet sich verständlich ab:

| Funktion | Offline |
|---|---|
| Seriell (Kabel), CSV-Datei, Rohdaten einfügen | ✅ voll nutzbar |
| Missweisung (Wind magnetisch/rechtweisend) | ✅ lokal berechnet |
| GRAMET | ⚠️ zeigt den zuletzt gespeicherten Stand für **heute** (siehe unten) |
| Quantimet-Live-Daten, Geräteliste, Kamerabilder, Kommandos | ❌ „Quantimet nicht erreichbar — keine Internetverbindung?" (Geräteliste: letzter bekannter Stand, solange der Server läuft) |
| Produkte (TAF, Bilder, PDFs) | ❌ nur auf dem gehosteten Server — hängen am Quantimet-Gerät und an den Admin-Rechten vom Pförtner |

### GRAMET ohne Internet

Die Modelldaten kommen von Open-Meteo, das lässt sich lokal nicht ersetzen.
Darum speichert der Browser jedes geladene GRAMET (IndexedDB, max. 8 Stände)
und lädt **zusätzlich den Folgetag** im Hintergrund vor. Ohne Netz zeigt der
Tab den jüngsten Stand für denselben Tag, dasselbe Modell und dieselbe Position
(±0,05°), gekennzeichnet mit „OFFLINE: gespeicherter Stand …". Kommt das Netz
zurück, wird automatisch neu geladen.

**Vor einem Einsatz ohne Netz** also den Viewer am Vortag oder am selben Tag
einmal mit Internet und MWS-Daten (GPS-Position) starten und den Tab
„📎 Produkte" öffnen. Der Cache gilt pro Browser: Er muss derselbe sein, der
später offline benutzt wird.

### Ersteinrichtung ohne Internet

Nur der **erste** Start braucht Internet (Python-Pakete per `pip`). Für einen
Rechner, der nie online ist, die Pakete vorher auf einem Rechner mit Internet
in den Ordner `wheels/` laden und mitkopieren. Die Startskripte installieren
dann automatisch von dort:

```bash
# Gleiches Betriebssystem + gleiche Python-Version wie der Zielrechner:
python3 -m pip download -r requirements.txt -d wheels

# Anderes Ziel, z. B. Windows 64 bit mit Python 3.13:
python3 -m pip download -r requirements.txt -d wheels \
    --platform win_amd64 --python-version 3.13 --only-binary=:all:
```

Schlägt die Installation fehl, löscht das Startskript das halbfertige `venv`
und erklärt, was fehlt. Der nächste Start versucht es dann einfach erneut.

`mws_config.json` (Quantimet-Zugangsdaten) braucht es offline nicht — sie wird
erst beim Quantimet-Abruf gelesen.

---

## Datenquellen im Viewer

### CSV-Datei (lokal)
- Schaltfläche **"CSV öffnen"** → monatliche Exportdatei auswählen (`300534067081240_2026-04.csv`)
- Auto-Polling alle 5 Minuten solange die Datei geöffnet ist

### Quantimet Live-Daten
- **"↻ Geräteliste"** → lädt verfügbare MWS-Geräte vom Portal
- Gerät auswählen → **"🌐 Laden"** → zeigt die letzten 72 Stunden
- Auto-Polling alle 5 Minuten (holt jeweils die letzten 72h neu)

### Seriell (RS-232/USB-Direktanschluss)
- MWS per Datenkabel (USB–RS-232, FTDI-Chip) am Rechner anschließen
- **"↻ Ports"** → erkennt verfügbare COM-/Seriellports automatisch
- Port auswählen → **"▶ Verbinden"** → Echtzeitempfang mit 30-Sekunden-Poll
- Alle empfangenen Pakete werden in `serial_log.txt` persistent gespeichert und beim nächsten Serverstart automatisch vorgeladen
- Erfordert laufenden MWS-Server (nicht verfügbar im `file://`-Modus)
- **Windows:** FTDI-Treiber (CDM-Treiber von ftdichip.com) muss vorab installiert sein

### Rohdaten manuell einfügen
- `@0deN`-Pakete direkt ins Textfeld einfügen und **"▶ Laden & Analysieren"** klicken

---

## Tab „📎 Produkte"

Zusatzinformationen **pro Gerät** (nur mit laufendem Server):

- **GRAMET heute (00–24 Z)** für die letzte GPS-Position der MWS, gerechnet mit
  [meteokit](../meteokit). Modellwahl „Auto": feinstes Modell, das die Position
  und den ganzen Tag abdeckt (ICON-D2 → ICON-EU → ICON Global, `meteokit/modelpick`);
  manuell überschreibbar. Die Daten kommen direkt vom Browser von den Open-Meteo-Instanzen;
  ohne Internet greift der gespeicherte Stand (siehe [Offline-Betrieb](#offline-betrieb)).
- **TAF, Hinweise, Bilder, PDFs**: Tool-Admins veröffentlichen sie im Tab mit
  Gültigkeitszeitraum (UTC); abgelaufene Produkte sehen nur Admins.
  Ablage auf dem Server unter `products/<imei>/` (nicht im Repo), max. 20 MB pro Datei.

### GRAMET-Modul neu bauen

`vendor/mws-gramet.js` ist ein eingechecktes Build-Ergebnis — der Server braucht
kein Node. Nach Änderungen an meteokit (muss neben `mws-viewer` liegen):

```bash
cd gramet
npm install      # einmalig
npm run build    # schreibt ../vendor/mws-gramet.js
```

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

## Lokale Einrichtung (Linux, Erstinstallation)

```bash
# 1. Verzeichnis klonen
git clone https://github.com/wetterheidi/mws-viewer.git
cd mws-viewer

# 2. Quantimet-Zugangsdaten eintragen
cp mws_config.json.template mws_config.json
nano mws_config.json   # username + password eintragen

# 3. Starten
chmod +x start_mws_viewer.sh
./start_mws_viewer.sh
```

Beim ersten Start wird automatisch ein Python-venv angelegt und alle Abhängigkeiten installiert.

### Seriellen Port unter Linux freischalten

Damit der Viewer die MWS direkt per USB/RS-232 ansprechen kann, muss der Benutzer der Gruppe `dialout` angehören (gibt Zugriff auf `/dev/ttyUSB*`, `/dev/ttyACM*`):

```bash
sudo usermod -aG dialout $USER
# danach einmal ab- und neu anmelden (oder: newgrp dialout)
```

Danach erscheint der Port nach Klick auf **"↻ Ports"** automatisch in der Auswahlliste.

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

### Geräte-Berechtigungen pro Nutzer (optional)

Welche MWS-Geräte ein Nutzer im Viewer sieht, steuert `/apps/mws-viewer/mws_permissions.json`:

```json
{
  "default": "all",
  "users": {
    "olli": {
      "imeis": ["300434061234567"],
      "names": ["Runway"]
    }
  }
}
```

- Ein Gerät ist sichtbar, wenn seine IMEI in `imeis` **oder** sein Quantimet-Name in `names` steht
- `default` gilt für Nutzer ohne Eintrag: `"all"` = alle Geräte, `"none"` = keine
- Fehlt die Datei komplett, sehen alle Nutzer alle Geräte
- Die Prüfung greift serverseitig für Geräteliste, Datenabruf, Bilder **und** Kommandos
- Änderungen wirken sofort — kein Neustart nötig
- Wer Tool-Admin für `mwsviewer` ist, wird zentral beim Pförtner verwaltet
  (https://verwaltung.wetterheidi.de) — nicht hier. nginx prüft das per
  `auth_request` und reicht es als `X-Tool-Admin`-Header durch, dem
  `mws_server.py` einfach vertraut (kein eigener Rollen-Check mehr).

### Admin-Tool (Web-UI)

Unter **https://mwsviewer.wetterheidi.de/admin** können Berechtigungen per Oberfläche
verwaltet werden — Nutzer anlegen/entfernen, Geräte per Checkbox zuweisen, Standard
umstellen. Zugriff haben nur Tool-Admins (siehe oben) — das prüft schon nginx,
bevor die Anfrage `mws_server.py` überhaupt erreicht.
Die Seite schreibt direkt in `mws_permissions.json`; Änderungen wirken sofort.

Neue Nutzer, Logins und Tool-Admin-Rechte werden zentral über
**https://verwaltung.wetterheidi.de** verwaltet — das komplette Betriebshandbuch
dazu steht im Repo [wetterheidi/Nutzerverwaltung](https://github.com/wetterheidi/Nutzerverwaltung)
(der alte Rollen-Mechanismus aus `wetterheidi/user-admin` ist abgelöst).

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
| `admin.html` | Admin-Tool für Geräte-Berechtigungen (nur via `/admin`, nur für Admins) |
| `mws_server.py` | Flask-Proxy: Quantimet-Auth, Geräteliste, Datenexport, Seriell-Bridge |
| `mws_config.json` | Quantimet-Zugangsdaten (**nicht im Repo**, gitignored) |
| `mws_config.json.template` | Vorlage für mws_config.json |
| `mws_permissions.json` | Geräte-Berechtigungen pro htpasswd-Nutzer (**nicht im Repo**, gitignored) |
| `mws_permissions.json.template` | Vorlage für mws_permissions.json |
| `requirements.txt` | Python-Abhängigkeiten (flask, requests, numpy, pandas, ppigrf, pyserial) |
| `vendor/mws-gramet.js` | GRAMET-Modul (Build-Ergebnis aus `gramet/`, siehe oben) |
| `vendor/fonts/` | Lokale Schriften (Barlow, Barlow Condensed, Share Tech Mono; OFL) — kein Google-Fonts-Abruf |
| `wheels/` | Optional: Python-Pakete für die Offline-Ersteinrichtung (**nicht im Repo**) |
| `serial_log.txt` | Persistentes Seriell-Log (**nicht im Repo**, gitignored) |
| `start_mws_viewer.command` | macOS-Starter (Doppelklick im Finder) |
| `start_mws_viewer.sh` | Linux-Starter (`./start_mws_viewer.sh` im Terminal) |
| `deploy/nginx-mws-viewer.conf` | nginx-Config (Port 80, SSL via certbot) |
| `deploy/mws-viewer.service` | systemd-Unit |
| `deploy/setup-server.sh` | Ersteinrichtungs-Script |

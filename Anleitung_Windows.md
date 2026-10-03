# MWS Viewer — Einrichtung Windows

Diese Anleitung beschreibt die einmalige Einrichtung und den täglichen Betrieb des MWS Viewers auf einem Windows-Laptop.

---

## Was wird benötigt?

| Was | Woher |
|---|---|
| MWS Viewer (Programmdateien) | USB-Stick oder Download (s.u.) |
| Python 3 | https://www.python.org/downloads/ |
| FTDI-Treiber | https://ftdichip.com/drivers/d2xx-drivers/ |
| Datenkabel MWS → Laptop | USB-A auf USB-Mini-B (FTDI-Chip) |

---

## Schritt 1 — Python installieren

1. https://www.python.org/downloads/ aufrufen und **„Download Python 3.x.x"** klicken
2. Installer starten
3. **Wichtig:** Ganz unten im ersten Fenster den Haken bei **„Add Python to PATH"** setzen  
   *(ohne diesen Haken funktioniert nichts)*
4. **„Install Now"** klicken und Installation abwarten

---

## Schritt 2 — FTDI-Treiber installieren

*(Nur nötig wenn die MWS per Kabel angeschlossen werden soll)*

1. https://ftdichip.com/drivers/d2xx-drivers/ aufrufen
2. Unter „Windows" den aktuellen Treiber herunterladen und installieren
3. Nach der Installation den Laptop **neu starten**

---

## Schritt 3 — MWS Viewer einrichten

1. Den Ordner `mws-viewer` (vom USB-Stick oder aus dem ZIP) nach `C:\MWS-Viewer\` kopieren  
   *(der Ordner kann auch woanders liegen — Hauptsache ein fester Ort)*
2. In den Ordner wechseln und die Datei **`mws_config.json.template`** kopieren und in **`mws_config.json`** umbenennen
3. `mws_config.json` mit dem Editor öffnen (Rechtsklick → „Öffnen mit" → Editor) und die Quantimet-Zugangsdaten eintragen:

```json
{
  "username": "ihre.email@beispiel.de",
  "password": "IhrPasswort"
}
```

4. Datei speichern und schließen

---

## Schritt 4 — Ersten Start durchführen

1. Doppelklick auf **`start_mws_viewer.bat`**
2. Ein schwarzes Konsolenfenster öffnet sich — beim **ersten Start** werden automatisch alle benötigten Komponenten installiert (dauert ca. 1–2 Minuten)
3. Danach öffnet sich der Browser automatisch mit dem MWS Viewer

> **Hinweis:** Das Konsolenfenster muss geöffnet bleiben solange der Viewer läuft.  
> Schließen des Fensters beendet den Server.

Ab dem zweiten Start ist der Viewer sofort in wenigen Sekunden bereit.

---

## Täglicher Betrieb

### Daten über Quantimet laden

1. `start_mws_viewer.bat` starten
2. Im Viewer: **„↻ Geräteliste"** klicken → Gerät auswählen → **„🌐 Laden"**
3. Der Viewer aktualisiert die Daten automatisch alle 5 Minuten

### MWS direkt per Kabel anschließen

1. Datenkabel zwischen MWS und Laptop anschließen
2. `start_mws_viewer.bat` starten
3. Im Viewer: **„↻ Ports"** klicken → den angezeigten COM-Port auswählen → **„▶ Verbinden"**
4. Die Daten laufen in Echtzeit ein; der Viewer fragt alle 30 Sekunden nach neuen Paketen

### Ohne Internet (offline)

Der Viewer funktioniert auch ganz ohne Internet:

- **MWS per Kabel**, CSV-Dateien und eingefügte Rohdaten: voll nutzbar
- **Missweisung**: wird auf dem Laptop berechnet
- **GRAMET** (Tab „📎 Produkte"): zeigt den zuletzt gespeicherten Stand für heute,
  markiert mit „OFFLINE: gespeicherter Stand". Dafür den Viewer **am Vortag oder
  am selben Tag einmal mit Internet** starten und den Tab „📎 Produkte" öffnen —
  der Folgetag wird dabei automatisch mitgespeichert. Immer denselben Browser benutzen.
- **Quantimet, Kamerabilder, Produkte**: nicht verfügbar
  (Meldung „Quantimet nicht erreichbar — keine Internetverbindung?")

Nur der **allererste Start** (Schritt 4) braucht Internet. Soll der Laptop nie online
gehen, vorher auf einem Rechner mit Internet die Python-Pakete in einen Ordner
`wheels` laden und mit auf den USB-Stick kopieren — Befehl siehe README, Abschnitt
„Offline-Betrieb". `start_mws_viewer.bat` installiert dann von dort.

---

## Häufige Probleme

| Problem | Lösung |
|---|---|
| Schwarzes Fenster schließt sich sofort | Python nicht installiert oder „Add to PATH" vergessen → Schritt 1 wiederholen |
| „FEHLER: Python-Pakete konnten nicht installiert werden" | Beim ersten Start kein Internet → mit Internet erneut starten oder Ordner `wheels` mitbringen (s. oben) |
| Kein COM-Port in der Liste | FTDI-Treiber fehlt (Schritt 2) oder Kabel nicht eingesteckt |
| Browser öffnet sich nicht automatisch | Manuell http://localhost:8080 im Browser aufrufen |
| „Fehler: Quantimet …" | `mws_config.json` prüfen — Benutzername/Passwort korrekt? |
| Antivirus blockiert den Start | Ordner `C:\MWS-Viewer\` als Ausnahme im Antivirus eintragen |

@echo off
:: MWS Viewer starten — Doppelklick im Explorer genügt
:: Voraussetzung: Python 3.x installiert und im PATH (python.org-Installer,
::                Option "Add Python to PATH" aktiviert)

cd /d "%~dp0"

:: Venv beim ersten Start anlegen
if not exist "venv\Scripts\activate.bat" (
    echo Ersteinrichtung: Python-Umgebung wird erstellt (einmalig^)...
    python -m venv venv
    if exist "wheels\" (
        REM Offline: Pakete aus dem mitgebrachten Ordner wheels - siehe README, Offline-Betrieb
        venv\Scripts\pip install --quiet --no-index --find-links wheels -r requirements.txt
    ) else (
        venv\Scripts\python -m pip install --quiet --upgrade pip
        venv\Scripts\pip install --quiet -r requirements.txt
    )
    if errorlevel 1 (
        rmdir /s /q venv
        echo FEHLER: Python-Pakete konnten nicht installiert werden.
        echo Die Ersteinrichtung braucht Internet oder einen Ordner "wheels" - siehe README, Offline-Betrieb.
        pause
        exit /b 1
    )
    echo Fertig.
)

:: Browser nach kurzer Pause oeffnen (start /b = ohne eigenes Fenster)
start /b "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080/"

echo MWS Viewer laeuft auf http://localhost:8080
echo Dieses Fenster schliessen beendet den Server.
echo.
venv\Scripts\python mws_server.py --host 127.0.0.1 --port 8080

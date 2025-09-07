@echo off
cd /d "PATH OF FOLDER GOES HERE"

:: Run Python script
python fetch.py

:: Start server in a separate window
start "" cmd /c "http-server -p 8000 -c-1"

:: Wait a second for server to start
timeout /t 2 /nobreak > nul

:: Open browser to index.html
start "" http://localhost:8000/index.html

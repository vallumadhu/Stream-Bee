@echo off
cd /d "C:\Users\vallu\Documents\Code\Web Development\Stream Bee"

:: Run Python script
python ./code_files/fetch.py

:: Start server in a separate window (serving from code_files)
start "" cmd /c "http-server -p 8000 -c-1"

:: Wait a second for server to start
timeout /t 2 /nobreak > nul

:: Open browser to index.html
start "" http://localhost:8000/code_files/index.html
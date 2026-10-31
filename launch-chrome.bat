@echo off
title Launch Chrome for DADB Automator - Kshitij Shingare
color 0B
echo =====================================================================
echo    Launching Google Chrome with Remote Debugging (Port 9222)
echo    Author: Kshitij Shingare
echo =====================================================================
echo.

set CHROME_PATH=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME_PATH="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if %CHROME_PATH%=="" (
    echo [ERROR] Google Chrome was not found in standard directories.
    echo Please start Chrome manually using:
    echo chrome.exe --remote-debugging-port=9222
    pause
    exit /b 1
)

echo Starting Chrome on port 9222...
start "" %CHROME_PATH% --remote-debugging-port=9222 "https://academy.dadb.com"
echo.
echo [SUCCESS] Chrome launched!
echo Please log in to your DADB Academy account and open your course.
echo Once the course is on your screen, run "start.bat" or type "npm start".
echo.
timeout /t 5

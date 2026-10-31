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

tasklist /fi "imagename eq chrome.exe" 2>nul | findstr /i "chrome.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo [NOTE] Chrome is currently running.
    echo In order for port 9222 to activate, all existing Chrome windows must be closed first.
    echo.
    set /p RESTART="Would you like to close Chrome and reopen it with port 9222? (Y/N): "
    if /i "%RESTART%"=="Y" (
        echo Closing Chrome...
        taskkill /f /im chrome.exe >nul 2>nul
        timeout /t 2 >nul
    )
)

echo Starting Chrome on port 9222 with session restore...
start "" %CHROME_PATH% --remote-debugging-port=9222 --user-data-dir="%~dp0.chrome_profile" --restore-last-session "https://academy.dadb.com"
echo.
echo [SUCCESS] Chrome launched with port 9222 enabled!
echo Make sure your course player is open, then run "start.bat" or "node index.js".
echo.
timeout /t 4

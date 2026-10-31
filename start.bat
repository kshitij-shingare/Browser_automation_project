@echo off
setlocal
cd /d "%~dp0"
title DADB Course Automator - Kshitij Shingare
color 0A

echo =====================================================================
echo    DADB Academy Course Automator
echo    Author: Kshitij Shingare
echo =====================================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js 18 or newer from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Checking Chrome connection on port 9222...
powershell -NoProfile -Command "try { $res = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json/version' -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo.
    echo [WARNING] Chrome does not appear to be running with port 9222 enabled!
    echo.
    echo Please run "launch-chrome.bat" first, log into your DADB Academy
    echo account, and navigate to your course.
    echo.
    echo Once Chrome is ready, press any key to continue, or close this window.
    pause
    echo.
)

echo Starting Course Automator Engine...
echo.
node index.js
echo.
echo =====================================================================
echo Execution finished.
echo =====================================================================
pause

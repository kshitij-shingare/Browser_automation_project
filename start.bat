@echo off
title DADB Course Automator - Kshitij Shingare
color 0A
echo =====================================================================
echo    DADB Academy Course Automator
echo    Author: Kshitij Shingare
echo =====================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your PATH!
    echo Please install Node.js (version 18 or newer) from https://nodejs.org
    pause
    exit /b 1
)

echo Starting Course Automator Engine...
echo.
node index.js
echo.
echo Process finished. Press any key to exit.
pause >nul

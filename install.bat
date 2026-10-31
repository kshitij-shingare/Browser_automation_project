@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title DADB Course Automator - Environment Setup - Kshitij Shingare
color 0E

echo =====================================================================
echo    DADB Academy Course Automator - Dependencies and Setup
echo    Author: Kshitij Shingare
echo =====================================================================
echo.

:: 1. Check Node.js Runtime
echo [1/4] Checking Node.js runtime...
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
    echo   - Node.js is installed: !NODE_VER!
) else (
    echo   - [WARNING] Node.js is NOT found in system PATH.
    where winget >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo   - Attempting to install Node.js LTS via winget...
        winget install OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
        echo   - Please restart your terminal/window after installation to update PATH.
    ) else (
        echo   - Please download and install Node.js 18+ manually from:
        echo     https://nodejs.org/
    )
)
echo.

:: 2. Check Google Chrome
echo [2/4] Checking Google Chrome browser...
set CHROME_FOUND=0
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1

if %CHROME_FOUND% equ 1 (
    echo   - Google Chrome is installed and ready.
) else (
    echo   - [WARNING] Google Chrome was not found in standard directories.
    where winget >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo   - Attempting to install Google Chrome via winget...
        winget install Google.Chrome -e --accept-source-agreements --accept-package-agreements
    ) else (
        echo   - Please install Google Chrome from:
        echo     https://www.google.com/chrome/
    )
)
echo.

:: 3. Check and Install Node Modules
echo [3/4] Checking Node.js packages...
where npm >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   - Running npm install to verify project configuration...
    call npm install --no-audit --no-fund
    echo   - Project configuration verified.
) else (
    echo   - npm not found; skipping npm install. Engine uses native Node.js APIs.
)
echo.

:: 4. Verify Local Automation Profile Directory
echo [4/4] Verifying automation workspace directories...
if not exist "%~dp0.chrome_profile" (
    mkdir "%~dp0.chrome_profile" >nul 2>&1
    echo   - Created local .chrome_profile directory.
) else (
    echo   - Local .chrome_profile directory exists.
)
echo.

echo =====================================================================
echo    [SUCCESS] Environment and dependency checks complete!
echo =====================================================================
echo.
echo Quick Next Steps:
echo   1. Double-click "launch-chrome.bat" to start Chrome on port 9222.
echo   2. Log in and open your DADB Academy course player.
echo   3. Double-click "start.bat" (or run "npm start") to begin automation!
echo.
pause

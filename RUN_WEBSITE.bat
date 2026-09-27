@echo off
setlocal
title InkMonk Research - Server Launcher
color 0B

echo ========================================================
echo        InkMonk Research - Starting Website
echo        "Research with care. Writing with clarity."
echo ========================================================
echo.

cd /d "%~dp0"

echo Step 1: Checking environment...
if not exist "node_modules" goto install_deps
goto start_server

:install_deps
echo First time setup: Installing dependencies. Please wait a moment...
call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies.
    goto error_exit
)

:start_server
echo.
echo Step 2: Starting server...
echo.
echo ========================================================
echo   Website will open in your browser automatically!
echo   URL: http://localhost:3000
echo.
echo   Demo Logins:
echo     Admin:  admin@inkmonk.com  / admin123
echo     Client: client@inkmonk.com / client123
echo.
echo   To STOP the website: Press Ctrl+C or close this window.
echo ========================================================
echo.

:: Open browser after 2 seconds
start "" http://localhost:3000

:: Start Next.js development server
call npm.cmd run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Server stopped with an error code: %ERRORLEVEL%
)

:error_exit
echo.
echo ========================================================
echo   Window will stay open. Press any key to exit.
echo ========================================================
pause

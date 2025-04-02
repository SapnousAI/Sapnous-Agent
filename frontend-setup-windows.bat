
@echo off
echo Setting up Browser-Use WebUI (Frontend)...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is required but not installed.
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating frontend .env file from example...
    copy .env.example .env
)

echo Frontend setup completed successfully!
cd ..
echo.
echo Next steps:
echo 1. Run start-app-windows.bat to start the application
echo.

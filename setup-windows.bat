
@echo off
echo Setting up Browser-Use WebUI (Backend)...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is required but not installed.
    exit /b 1
)

REM Create Python virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo Please edit the .env file to add your API keys
)

echo Backend setup completed successfully!
echo.
echo Next steps:
echo 1. Edit the .env file to add your API keys
echo 2. Run frontend-setup-windows.bat to set up the frontend
echo 3. Run start-app-windows.bat to start the application
echo.

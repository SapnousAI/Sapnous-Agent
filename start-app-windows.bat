
@echo off
echo Starting Browser-Use WebUI...

REM Start backend server in a new window
start cmd /k "call venv\Scripts\activate && python main.py --api-host 0.0.0.0 --api-port 7788"

REM Wait a moment for backend to initialize
timeout /t 5

REM Start frontend in a new window
start cmd /k "cd frontend && npm run dev"

echo Application started!
echo.
echo - Backend API is running at http://localhost:7788
echo - Frontend is running at http://localhost:8080
echo.
echo You can now access the application by visiting http://localhost:8080 in your browser.
echo To stop the application, close both command prompt windows.
echo.

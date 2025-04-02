
#!/bin/bash
# Start script for Browser-Use WebUI

# Activate virtual environment
source ./venv/bin/activate

# Start backend server in the background
python main.py --api-host 0.0.0.0 --api-port 7788 &
BACKEND_PID=$!

# Wait a moment for backend to initialize
echo "Starting backend server..."
sleep 5

# Start frontend
echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

echo ""
echo "Application started!"
echo "- Backend API is running at http://localhost:7788"
echo "- Frontend is running at http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the application"

# Wait for user to press Ctrl+C
wait

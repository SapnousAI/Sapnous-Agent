
#!/bin/bash
# Setup script for Browser-Use WebUI

echo "Setting up Browser-Use WebUI..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    exit 1
fi

# Create Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source ./venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit the .env file to add your API keys"
fi

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install

# Create frontend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file from example..."
    cp .env.example .env
fi

cd ..

echo "Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit the .env file to add your API keys"
echo "2. Start the application with:"
echo "   - Backend: source venv/bin/activate && python main.py --api-host 0.0.0.0 --api-port 7788"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "You can then access the application at http://localhost:8080"

#!/bin/bash

# AI-based Dropout Prediction System - Startup Script
# Team Aetheron - Smart India Hackathon 2025

echo "🚀 Starting AI-based Dropout Prediction System..."
echo "================================================"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to start backend
start_backend() {
    echo "🔧 Setting up backend..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment
    echo "🔌 Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    echo "📚 Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start backend server
    echo "🖥️  Starting FastAPI backend server..."
    python main.py &
    BACKEND_PID=$!
    
    cd ..
    echo "✅ Backend started on http://localhost:8000"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Setting up frontend..."
    cd frontend
    
    # Install dependencies
    echo "📚 Installing Node.js dependencies..."
    npm install
    
    # Start frontend server
    echo "🌐 Starting React frontend server..."
    npm start &
    FRONTEND_PID=$!
    
    cd ..
    echo "✅ Frontend started on http://localhost:3000"
}

# Start both services
start_backend
sleep 5  # Wait for backend to initialize
start_frontend

echo "
🎉 System is now running!

🔗 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:8000
📚 API Docs: http://localhost:8000/docs

Press Ctrl+C to stop all services
"

# Function to cleanup on exit
cleanup() {
    echo "
🛑 Shutting down system..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
@echo off
REM AI-based Dropout Prediction System - Windows Startup Script
REM Team Aetheron - Smart India Hackathon 2025

echo 🚀 Starting AI-based Dropout Prediction System...
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Start backend
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server in background
echo 🖥️  Starting FastAPI backend server...
start /b python main.py

cd ..
echo ✅ Backend starting on http://localhost:8000

REM Wait a moment for backend to initialize
timeout /t 5 /nobreak > nul

REM Start frontend
echo 🎨 Setting up frontend...
cd frontend

REM Install dependencies
echo 📚 Installing Node.js dependencies...
call npm install

REM Start frontend server
echo 🌐 Starting React frontend server...
start /b npm start

cd ..

echo.
echo 🎉 System is now starting!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause > nul

REM Cleanup - kill processes
taskkill /f /im python.exe /t >nul 2>&1
taskkill /f /im node.exe /t >nul 2>&1

echo ✅ All services stopped
pause
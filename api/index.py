from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,https://your-vercel-app.vercel.app").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "AI-based Dropout Prediction System - Team Aetheron",
        "version": "1.0.0",
        "description": "Smart India Hackathon 2025",
        "status": "Deployed on Vercel"
    }

# Export for Vercel
handler = app
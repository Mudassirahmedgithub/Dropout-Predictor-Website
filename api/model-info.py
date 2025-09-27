from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.prediction_model import DropoutPredictor

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_model_info():
    """Get model information and metadata"""
    try:
        predictor = DropoutPredictor()
        
        model_info = {
            "model_type": "Random Forest Classifier",
            "version": "1.0.0",
            "features": [
                "Age",
                "Gender",
                "Attendance_Percentage",
                "Test_Scores_Average",
                "Fee_Status",
                "Previous_GPA",
                "Family_Income",
                "Distance_from_School",
                "Parent_Education"
            ],
            "training_metrics": {
                "accuracy": 0.89,
                "precision": 0.87,
                "recall": 0.85,
                "f1_score": 0.86
            },
            "risk_thresholds": {
                "green": "< 0.3",
                "yellow": "0.3 - 0.7",
                "red": "> 0.7"
            },
            "last_trained": "2025-09-27",
            "data_sources": [
                "student_data.csv",
                "fee_payment_structure.csv",
                "attendance_records.csv"
            ],
            "prediction_categories": [
                {
                    "level": "Green",
                    "description": "Low risk of dropout",
                    "action": "Regular monitoring"
                },
                {
                    "level": "Yellow", 
                    "description": "Medium risk of dropout",
                    "action": "Enhanced support and counseling"
                },
                {
                    "level": "Red",
                    "description": "High risk of dropout",
                    "action": "Immediate intervention required"
                }
            ]
        }
        
        return model_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model info failed: {str(e)}")

# Export for Vercel
handler = app
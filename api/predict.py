from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Tuple
import pandas as pd
import numpy as np
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from models.prediction_model import DropoutPredictor
    from utils.data_processor import DataProcessor
    from utils.risk_analyzer import RiskAnalyzer
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback imports for serverless environment
    DropoutPredictor = None
    DataProcessor = None
    RiskAnalyzer = None

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components (will be cached after first call)
predictor = None
data_processor = None
risk_analyzer = None

def get_components():
    global predictor, data_processor, risk_analyzer
    if predictor is None:
        try:
            if DropoutPredictor is None or DataProcessor is None or RiskAnalyzer is None:
                raise ImportError("Model classes not available")
            
            predictor = DropoutPredictor()
            data_processor = DataProcessor()
            risk_analyzer = RiskAnalyzer()
        except Exception as e:
            print(f"Error initializing components: {e}")
            raise HTTPException(status_code=500, detail=f"Model initialization failed: {e}")
    return predictor, data_processor, risk_analyzer

# Pydantic models
class StudentData(BaseModel):
    student_id: str
    name: str
    age: int
    gender: str
    attendance_percentage: float
    test_scores: List[float]
    fee_status: str  # "paid", "pending", "overdue"
    previous_gpa: Optional[float] = None
    family_income: Optional[str] = None
    distance_from_school: Optional[float] = None
    parent_education: Optional[str] = None

class PredictionResponse(BaseModel):
    student_id: str
    name: str
    risk_level: str  # "Green", "Yellow", "Red"
    risk_score: float
    dropout_probability: float
    risk_factors: List[str]
    recommendations: List[str]
    alert_needed: bool

@app.post("/", response_model=PredictionResponse)
async def predict_single_student(student: StudentData):
    """Predict dropout risk for a single student"""
    try:
        pred, data_proc, risk_anal = get_components()
        
        # Type assertions to help with linting
        assert pred is not None, "Predictor not initialized"
        assert data_proc is not None, "Data processor not initialized"
        assert risk_anal is not None, "Risk analyzer not initialized"
        
        # Process student data
        processed_data = data_proc.process_single_student(student.dict())
        
        # Make prediction
        prediction = pred.predict_single(processed_data)
        
        # Analyze risk factors
        risk_analysis = risk_anal.analyze_risk_factors(student.dict(), prediction)
        
        # Determine risk level and recommendations
        risk_level = risk_anal.get_risk_level(prediction['dropout_probability'])
        recommendations = risk_anal.get_recommendations(risk_analysis['risk_factors'])
        
        response = PredictionResponse(
            student_id=student.student_id,
            name=student.name,
            risk_level=risk_level,
            risk_score=prediction['risk_score'],
            dropout_probability=prediction['dropout_probability'],
            risk_factors=risk_analysis['risk_factors'],
            recommendations=recommendations,
            alert_needed=risk_level in ["Yellow", "Red"]
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Export for Vercel
handler = app
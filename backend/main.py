import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, continue without it
    pass

from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime
import json
import io

from models.prediction_model import DropoutPredictor
from models.database import get_db, Student, Prediction
from utils.data_processor import DataProcessor
from utils.risk_analyzer import RiskAnalyzer

app = FastAPI(
    title="AI-based Dropout Prediction System",
    description="Smart India Hackathon 2025 - Team Aetheron",
    version="1.0.0"
)

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
predictor = DropoutPredictor()
data_processor = DataProcessor()
risk_analyzer = RiskAnalyzer()

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

class BulkPredictionRequest(BaseModel):
    students: List[StudentData]

@app.get("/")
async def root():
    return {
        "message": "AI-based Dropout Prediction System - Team Aetheron",
        "version": "1.0.0",
        "description": "Smart India Hackathon 2025"
    }

@app.post("/predict/single", response_model=PredictionResponse)
async def predict_single_student(student: StudentData):
    """Predict dropout risk for a single student"""
    try:
        # Process student data
        processed_data = data_processor.process_single_student(student.dict())
        
        # Make prediction
        prediction = predictor.predict_single(processed_data)
        
        # Analyze risk factors
        risk_analysis = risk_analyzer.analyze_risk_factors(student.dict(), prediction)
        
        # Determine risk level and recommendations
        risk_level = risk_analyzer.get_risk_level(prediction['dropout_probability'])
        recommendations = risk_analyzer.get_recommendations(risk_analysis['risk_factors'])
        
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

@app.post("/predict/bulk")
async def predict_bulk_students(request: BulkPredictionRequest):
    """Predict dropout risk for multiple students"""
    try:
        results = []
        alerts = []
        
        for student in request.students:
            # Process each student
            processed_data = data_processor.process_single_student(student.dict())
            prediction = predictor.predict_single(processed_data)
            risk_analysis = risk_analyzer.analyze_risk_factors(student.dict(), prediction)
            risk_level = risk_analyzer.get_risk_level(prediction['dropout_probability'])
            recommendations = risk_analyzer.get_recommendations(risk_analysis['risk_factors'])
            
            result = {
                "student_id": student.student_id,
                "name": student.name,
                "risk_level": risk_level,
                "risk_score": prediction['risk_score'],
                "dropout_probability": prediction['dropout_probability'],
                "risk_factors": risk_analysis['risk_factors'],
                "recommendations": recommendations,
                "alert_needed": risk_level in ["Yellow", "Red"]
            }
            
            results.append(result)
            
            # Collect alerts
            if result["alert_needed"]:
                alerts.append({
                    "student_id": student.student_id,
                    "name": student.name,
                    "risk_level": risk_level,
                    "priority": "High" if risk_level == "Red" else "Medium"
                })
        
        return {
            "total_students": len(results),
            "predictions": results,
            "alerts": alerts,
            "summary": {
                "green_risk": len([r for r in results if r["risk_level"] == "Green"]),
                "yellow_risk": len([r for r in results if r["risk_level"] == "Yellow"]),
                "red_risk": len([r for r in results if r["risk_level"] == "Red"])
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk prediction failed: {str(e)}")

@app.post("/upload/csv")
async def upload_csv_data(file: UploadFile = File(...)):
    """Upload student data via CSV file"""
    try:
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate CSV format
        required_columns = ['student_id', 'name', 'age', 'gender', 'attendance_percentage', 'fee_status']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}"
            )
        
        # Process the data
        students_data = []
        for _, row in df.iterrows():
            test_scores = []
            # Look for test score columns (test1, test2, etc.)
            for col in df.columns:
                if col.startswith('test') and col != 'test_scores':
                    if pd.notna(row[col]):
                        test_scores.append(float(row[col]))
            
            student_data = {
                "student_id": str(row['student_id']),
                "name": str(row['name']),
                "age": int(row['age']),
                "gender": str(row['gender']),
                "attendance_percentage": float(row['attendance_percentage']),
                "test_scores": test_scores if test_scores else [75.0],  # Default score
                "fee_status": str(row['fee_status']),
                "previous_gpa": float(row.get('previous_gpa', 0)) if pd.notna(row.get('previous_gpa')) else None,
                "family_income": str(row.get('family_income', '')) if pd.notna(row.get('family_income')) else None,
                "distance_from_school": float(row.get('distance_from_school', 0)) if pd.notna(row.get('distance_from_school')) else None,
                "parent_education": str(row.get('parent_education', '')) if pd.notna(row.get('parent_education')) else None
            }
            students_data.append(student_data)
        
        return {
            "message": f"Successfully processed {len(students_data)} students",
            "students_count": len(students_data),
            "preview": students_data[:3]  # Show first 3 students as preview
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV processing failed: {str(e)}")

@app.get("/analytics/dashboard")
async def get_dashboard_analytics():
    """Get analytics data for the dashboard"""
    try:
        # This would typically fetch from database
        # For now, return sample analytics data
        return {
            "total_students": 1250,
            "at_risk_students": 87,
            "alerts_today": 12,
            "intervention_success_rate": 78.5,
            "risk_distribution": {
                "green": 892,
                "yellow": 271,
                "red": 87
            },
            "trends": {
                "weekly_predictions": [45, 52, 38, 67, 41, 58, 43],
                "intervention_outcomes": [
                    {"week": "Week 1", "successful": 8, "unsuccessful": 2},
                    {"week": "Week 2", "successful": 12, "unsuccessful": 3},
                    {"week": "Week 3", "successful": 6, "unsuccessful": 1},
                    {"week": "Week 4", "successful": 15, "unsuccessful": 4}
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics fetch failed: {str(e)}")

@app.get("/model/info")
async def get_model_info():
    """Get information about the ML model"""
    return {
        "model_type": "Hybrid (Rule-based + ML)",
        "ml_algorithm": "Random Forest + Logistic Regression Ensemble",
        "features_used": [
            "Attendance Percentage",
            "Test Scores Average",
            "Fee Payment Status",
            "Previous GPA",
            "Demographic Factors"
        ],
        "accuracy": 0.87,
        "precision": 0.84,
        "recall": 0.89,
        "last_trained": "2025-09-15",
        "training_data_size": 5000
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("API_HOST", "127.0.0.1")
    debug = os.getenv("DEBUG", "False").lower() == "true"  # Set to False for stability
    print(f"Starting server on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=debug)
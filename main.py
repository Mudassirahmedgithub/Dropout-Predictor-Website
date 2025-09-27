from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import os
import sys
from pathlib import Path
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from models.prediction_model import DropoutPredictor
    from utils.data_processor import DataProcessor
    from utils.risk_analyzer import RiskAnalyzer
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback for development
    DropoutPredictor = None
    DataProcessor = None
    RiskAnalyzer = None

app = FastAPI(title="Dropout Prediction API", version="1.0.0")

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
            raise HTTPException(status_code=500, detail=f"Failed to initialize prediction models: {str(e)}")
    
    return predictor, data_processor, risk_analyzer

# Pydantic models
class StudentData(BaseModel):
    # Demographics
    age: Optional[int] = None
    gender: Optional[str] = None
    
    # Academic
    previous_gpa: Optional[float] = None
    current_semester: Optional[int] = None
    major: Optional[str] = None
    
    # Financial
    financial_aid: Optional[bool] = None
    tuition_paid: Optional[bool] = None
    
    # Engagement
    attendance_rate: Optional[float] = None
    assignments_completed: Optional[float] = None
    participation_score: Optional[float] = None
    
    # Support
    counseling_sessions: Optional[int] = None
    study_groups: Optional[bool] = None
    
    # Background
    first_generation: Optional[bool] = None
    work_hours: Optional[int] = None
    family_income: Optional[str] = None

class BulkPredictionRequest(BaseModel):
    students: List[StudentData]

class PredictionResponse(BaseModel):
    student_id: str
    dropout_probability: float
    risk_level: str
    risk_factors: List[str]
    recommendations: List[str]
    confidence_score: float

class BulkPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]
    summary: Dict[str, Any]

# Routes
@app.get("/")
async def root():
    return {"message": "Dropout Prediction API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    try:
        predictor_instance, data_processor_instance, risk_analyzer_instance = get_components()
        return {
            "status": "healthy",
            "components": {
                "predictor": predictor_instance is not None,
                "data_processor": data_processor_instance is not None,
                "risk_analyzer": risk_analyzer_instance is not None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_single_student(student: StudentData):
    try:
        predictor_instance, data_processor_instance, risk_analyzer_instance = get_components()
        
        # Convert to dictionary and process
        student_dict = student.dict()
        
        # Process the student data
        processed_data = data_processor_instance.process_single_student(student_dict)
        
        # Make prediction
        probability = predictor_instance.predict_probability(processed_data)
        
        # Analyze risk factors
        risk_analysis = risk_analyzer_instance.analyze_student(student_dict, probability)
        
        return PredictionResponse(
            student_id=f"student_{hash(str(student_dict)) % 10000}",
            dropout_probability=float(probability),
            risk_level=risk_analysis["risk_level"],
            risk_factors=risk_analysis["risk_factors"],
            recommendations=risk_analysis["recommendations"],
            confidence_score=float(risk_analysis.get("confidence", 0.85))
        )
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/bulk-predict", response_model=BulkPredictionResponse)
async def predict_bulk_students(request: BulkPredictionRequest):
    try:
        predictor_instance, data_processor_instance, risk_analyzer_instance = get_components()
        
        predictions = []
        risk_counts = {"low": 0, "medium": 0, "high": 0}
        
        for i, student in enumerate(request.students):
            try:
                # Convert to dictionary and process
                student_dict = student.dict()
                
                # Process the student data
                processed_data = data_processor_instance.process_single_student(student_dict)
                
                # Make prediction
                probability = predictor_instance.predict_probability(processed_data)
                
                # Analyze risk factors
                risk_analysis = risk_analyzer_instance.analyze_student(student_dict, probability)
                
                prediction = PredictionResponse(
                    student_id=f"student_{i+1}",
                    dropout_probability=float(probability),
                    risk_level=risk_analysis["risk_level"],
                    risk_factors=risk_analysis["risk_factors"],
                    recommendations=risk_analysis["recommendations"],
                    confidence_score=float(risk_analysis.get("confidence", 0.85))
                )
                
                predictions.append(prediction)
                risk_counts[prediction.risk_level] += 1
                
            except Exception as student_error:
                print(f"Error processing student {i+1}: {student_error}")
                # Create error response for this student
                predictions.append(PredictionResponse(
                    student_id=f"student_{i+1}",
                    dropout_probability=0.0,
                    risk_level="unknown",
                    risk_factors=["Error in processing"],
                    recommendations=["Please check input data"],
                    confidence_score=0.0
                ))
        
        total_students = len(predictions)
        avg_risk = sum(p.dropout_probability for p in predictions) / total_students if total_students > 0 else 0
        
        summary = {
            "total_students": total_students,
            "average_dropout_risk": float(avg_risk),
            "risk_distribution": risk_counts,
            "high_risk_students": risk_counts["high"],
            "processing_success_rate": len([p for p in predictions if p.risk_level != "unknown"]) / total_students if total_students > 0 else 0
        }
        
        return BulkPredictionResponse(predictions=predictions, summary=summary)
        
    except Exception as e:
        print(f"Bulk prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Bulk prediction failed: {str(e)}")

@app.post("/api/upload")
async def upload_and_predict(file: UploadFile = File(...)):
    try:
        predictor_instance, data_processor_instance, risk_analyzer_instance = get_components()
        
        # Validate file type
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
        
        # Read file content
        content = await file.read()
        
        # Process file based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(pd.io.common.BytesIO(content))
        
        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
        # Process each row
        predictions = []
        risk_counts = {"low": 0, "medium": 0, "high": 0}
        
        for index, row in df.iterrows():
            try:
                # Convert row to student data format
                student_dict = {}
                
                # Map common column names to our expected fields
                column_mapping = {
                    'age': 'age',
                    'gender': 'gender',
                    'gpa': 'previous_gpa',
                    'previous_gpa': 'previous_gpa',
                    'semester': 'current_semester',
                    'major': 'major',
                    'financial_aid': 'financial_aid',
                    'attendance': 'attendance_rate',
                    'attendance_rate': 'attendance_rate'
                }
                
                for col in df.columns:
                    col_lower = col.lower().replace(' ', '_')
                    if col_lower in column_mapping:
                        student_dict[column_mapping[col_lower]] = row[col]
                    elif col_lower in ['age', 'gender', 'previous_gpa', 'current_semester', 'major', 
                                      'financial_aid', 'tuition_paid', 'attendance_rate', 
                                      'assignments_completed', 'participation_score']:
                        student_dict[col_lower] = row[col]
                
                # Process the student data
                processed_data = data_processor_instance.process_single_student(student_dict)
                
                # Make prediction
                probability = predictor_instance.predict_probability(processed_data)
                
                # Analyze risk factors
                risk_analysis = risk_analyzer_instance.analyze_student(student_dict, probability)
                
                prediction = PredictionResponse(
                    student_id=f"row_{index+1}",
                    dropout_probability=float(probability),
                    risk_level=risk_analysis["risk_level"],
                    risk_factors=risk_analysis["risk_factors"],
                    recommendations=risk_analysis["recommendations"],
                    confidence_score=float(risk_analysis.get("confidence", 0.85))
                )
                
                predictions.append(prediction)
                risk_counts[prediction.risk_level] += 1
                
            except Exception as row_error:
                print(f"Error processing row {index+1}: {row_error}")
                predictions.append(PredictionResponse(
                    student_id=f"row_{index+1}",
                    dropout_probability=0.0,
                    risk_level="unknown",
                    risk_factors=["Error in processing row data"],
                    recommendations=["Please check data format"],
                    confidence_score=0.0
                ))
        
        total_students = len(predictions)
        avg_risk = sum(p.dropout_probability for p in predictions) / total_students if total_students > 0 else 0
        
        summary = {
            "total_students": total_students,
            "average_dropout_risk": float(avg_risk),
            "risk_distribution": risk_counts,
            "high_risk_students": risk_counts["high"],
            "file_name": file.filename,
            "processing_success_rate": len([p for p in predictions if p.risk_level != "unknown"]) / total_students if total_students > 0 else 0
        }
        
        return BulkPredictionResponse(predictions=predictions, summary=summary)
        
    except Exception as e:
        print(f"Upload and predict error: {e}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

# Serve static files (React frontend)
frontend_path = Path(__file__).parent / "frontend" / "build"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

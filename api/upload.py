from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
import sys
import io

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from models.prediction_model import DropoutPredictor
    from utils.data_processor import DataProcessor
    from utils.risk_analyzer import RiskAnalyzer
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback for serverless environment
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

@app.post("/")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and process CSV file with student data"""
    try:
        # Check file type
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Get components
        pred, data_proc, risk_anal = get_components()
        
        # Type assertions to help with linting
        assert pred is not None, "Predictor not initialized"
        assert data_proc is not None, "Data processor not initialized"
        assert risk_anal is not None, "Risk analyzer not initialized"
        
        # Read CSV content
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        results = []
        
        # Process each student in the CSV
        for _, row in df.iterrows():
            try:
                # Convert row to student data format
                student_data = {
                    "student_id": str(row.get('Student_ID', f"student_{len(results)+1}")),
                    "name": str(row.get('Name', f"Student {len(results)+1}")),
                    "age": int(row.get('Age', 18)),
                    "gender": str(row.get('Gender', 'Unknown')),
                    "attendance_percentage": float(row.get('Attendance_Percentage', 75)),
                    "test_scores": [float(row.get('Test_Score', 75))],
                    "fee_status": str(row.get('Fee_Status', 'Paid')),
                    "previous_gpa": float(row.get('Previous_GPA', 3.0)) if pd.notna(row.get('Previous_GPA')) else None,
                    "family_income": str(row.get('Family_Income', 'Middle')) if pd.notna(row.get('Family_Income')) else None,
                    "distance_from_school": float(row.get('Distance_from_School', 5)) if pd.notna(row.get('Distance_from_School')) else None,
                    "parent_education": str(row.get('Parent_Education', 'High School')) if pd.notna(row.get('Parent_Education')) else None
                }
                
                # Process student data
                processed_data = data_proc.process_single_student(student_data)
                prediction = pred.predict_single(processed_data)
                risk_analysis = risk_anal.analyze_risk_factors(student_data, prediction)
                risk_level = risk_anal.get_risk_level(prediction['dropout_probability'])
                recommendations = risk_anal.get_recommendations(risk_analysis['risk_factors'])
                
                result = {
                    "student_id": student_data["student_id"],
                    "name": student_data["name"],
                    "risk_level": risk_level,
                    "risk_score": prediction['risk_score'],
                    "dropout_probability": prediction['dropout_probability'],
                    "risk_factors": risk_analysis['risk_factors'],
                    "recommendations": recommendations,
                    "alert_needed": risk_level in ["Yellow", "Red"]
                }
                
                results.append(result)
                
            except Exception as e:
                print(f"Error processing row {len(results)+1}: {e}")
                continue
        
        # Calculate summary statistics
        total_students = len(results)
        high_risk = len([r for r in results if r["risk_level"] == "Red"])
        medium_risk = len([r for r in results if r["risk_level"] == "Yellow"])
        low_risk = len([r for r in results if r["risk_level"] == "Green"])
        
        return {
            "message": f"Successfully processed {total_students} students from CSV",
            "predictions": results,
            "summary": {
                "total_students": total_students,
                "high_risk": high_risk,
                "medium_risk": medium_risk,
                "low_risk": low_risk,
                "processed_file": file.filename
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV upload failed: {str(e)}")

# Export for Vercel
handler = app
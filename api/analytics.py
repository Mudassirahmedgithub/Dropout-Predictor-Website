from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
import sys
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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
async def get_analytics_dashboard():
    """Get comprehensive analytics for the dashboard"""
    try:
        # Load student data from public directory or local datasets
        base_path = os.path.dirname(os.path.dirname(__file__))  # Go up to project root
        
        # Try public directory first (for Vercel), then fallback to datasets
        student_data_path = None
        for possible_path in [
            os.path.join(base_path, 'public', 'datasets', 'student_data.csv'),
            os.path.join(base_path, 'datasets', 'student_data.csv'),
            os.path.join(os.path.dirname(__file__), 'datasets', 'student_data.csv')
        ]:
            if os.path.exists(possible_path):
                student_data_path = possible_path
                break
        
        if not student_data_path:
            raise HTTPException(status_code=404, detail="Student data not found")
        
        df = pd.read_csv(student_data_path)
        
        # Calculate basic statistics
        total_students = len(df)
        
        # Risk distribution (mock data based on patterns)
        np.random.seed(42)  # For consistent results
        risk_levels = np.random.choice(['Green', 'Yellow', 'Red'], 
                                     size=total_students, 
                                     p=[0.6, 0.25, 0.15])
        
        high_risk = np.sum(risk_levels == 'Red')
        medium_risk = np.sum(risk_levels == 'Yellow')
        low_risk = np.sum(risk_levels == 'Green')
        
        # Attendance analysis
        attendance_stats = {
            "average": float(df['Attendance_Percentage'].mean()),
            "below_75": int(np.sum(df['Attendance_Percentage'] < 75)),
            "below_50": int(np.sum(df['Attendance_Percentage'] < 50))
        }
        
        # Fee payment analysis
        fee_paid = int(np.sum(df['Fee_Status'] == 'Paid'))
        fee_pending = int(np.sum(df['Fee_Status'] == 'Pending'))
        fee_overdue = int(np.sum(df['Fee_Status'] == 'Overdue'))
        
        # Grade distribution
        grade_distribution = df['Previous_GPA'].value_counts().to_dict()
        
        # Trends (mock data for time series)
        monthly_dropouts = [12, 8, 15, 20, 18, 25, 22, 28, 24, 30, 26, 32]
        monthly_predictions = [45, 42, 52, 58, 55, 68, 62, 72, 68, 78, 74, 85]
        
        return {
            "overview": {
                "total_students": total_students,
                "high_risk": int(high_risk),
                "medium_risk": int(medium_risk),
                "low_risk": int(low_risk),
                "alert_count": int(high_risk + medium_risk)
            },
            "attendance": attendance_stats,
            "fee_payment": {
                "paid": fee_paid,
                "pending": fee_pending,
                "overdue": fee_overdue
            },
            "grade_distribution": grade_distribution,
            "trends": {
                "monthly_dropouts": monthly_dropouts,
                "monthly_predictions": monthly_predictions,
                "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            "top_risk_factors": [
                {"factor": "Low Attendance", "percentage": 35},
                {"factor": "Fee Payment Issues", "percentage": 28},
                {"factor": "Poor Academic Performance", "percentage": 22},
                {"factor": "Family Income", "percentage": 15}
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics failed: {str(e)}")

# Export for Vercel
handler = app
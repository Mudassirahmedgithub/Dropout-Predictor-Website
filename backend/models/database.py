from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import Generator

DATABASE_URL = "sqlite:///./dropout_prediction.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    attendance_percentage = Column(Float)
    fee_status = Column(String)
    previous_gpa = Column(Float, nullable=True)
    family_income = Column(String, nullable=True)
    distance_from_school = Column(Float, nullable=True)
    parent_education = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    risk_level = Column(String)  # Green, Yellow, Red
    risk_score = Column(Float)
    dropout_probability = Column(Float)
    risk_factors = Column(JSON)
    recommendations = Column(JSON)
    alert_needed = Column(Boolean)
    prediction_date = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    alert_type = Column(String)  # dropout_risk, low_attendance, fee_overdue
    priority = Column(String)  # High, Medium, Low
    message = Column(String)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
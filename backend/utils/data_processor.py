import pandas as pd
import numpy as np
from typing import Dict, List, Any
import re

class DataProcessor:
    def __init__(self):
        self.required_fields = [
            'student_id', 'name', 'age', 'gender', 
            'attendance_percentage', 'test_scores', 'fee_status'
        ]
    
    def validate_student_data(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and clean student data"""
        errors = []
        cleaned_data = student_data.copy()
        
        # Check required fields
        for field in self.required_fields:
            if field not in student_data or student_data[field] is None:
                if field == 'test_scores':
                    cleaned_data[field] = [75.0]  # Default test score
                else:
                    errors.append(f"Missing required field: {field}")
        
        # Validate data types and ranges
        try:
            # Age validation
            if 'age' in cleaned_data:
                age = int(cleaned_data['age'])
                if age < 10 or age > 25:
                    errors.append("Age must be between 10 and 25")
                cleaned_data['age'] = age
            
            # Attendance validation
            if 'attendance_percentage' in cleaned_data:
                attendance = float(cleaned_data['attendance_percentage'])
                if attendance < 0 or attendance > 100:
                    errors.append("Attendance percentage must be between 0 and 100")
                cleaned_data['attendance_percentage'] = attendance
            
            # Test scores validation
            if 'test_scores' in cleaned_data:
                test_scores = cleaned_data['test_scores']
                if isinstance(test_scores, (int, float)):
                    test_scores = [float(test_scores)]
                elif isinstance(test_scores, list):
                    test_scores = [float(score) for score in test_scores if score is not None]
                else:
                    test_scores = [75.0]  # Default
                
                # Validate each score
                validated_scores = []
                for score in test_scores:
                    if 0 <= score <= 100:
                        validated_scores.append(score)
                
                if not validated_scores:
                    validated_scores = [75.0]  # Default if no valid scores
                
                cleaned_data['test_scores'] = validated_scores
            
            # Fee status validation
            if 'fee_status' in cleaned_data:
                fee_status = str(cleaned_data['fee_status']).lower().strip()
                if fee_status not in ['paid', 'pending', 'overdue']:
                    cleaned_data['fee_status'] = 'paid'  # Default to paid
                else:
                    cleaned_data['fee_status'] = fee_status
            
            # Gender validation
            if 'gender' in cleaned_data:
                gender = str(cleaned_data['gender']).lower().strip()
                if gender not in ['male', 'female', 'other']:
                    gender = 'other'  # Default
                cleaned_data['gender'] = gender
            
            # Previous GPA validation
            if 'previous_gpa' in cleaned_data and cleaned_data['previous_gpa'] is not None:
                gpa = float(cleaned_data['previous_gpa'])
                if gpa < 0 or gpa > 4.0:
                    cleaned_data['previous_gpa'] = None
                else:
                    cleaned_data['previous_gpa'] = gpa
            
            # Distance validation
            if 'distance_from_school' in cleaned_data and cleaned_data['distance_from_school'] is not None:
                distance = float(cleaned_data['distance_from_school'])
                if distance < 0 or distance > 100:
                    cleaned_data['distance_from_school'] = None
                else:
                    cleaned_data['distance_from_school'] = distance
        
        except (ValueError, TypeError) as e:
            errors.append(f"Data type validation error: {str(e)}")
        
        return {
            'data': cleaned_data,
            'errors': errors,
            'is_valid': len(errors) == 0
        }
    
    def process_single_student(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single student's data"""
        validation_result = self.validate_student_data(student_data)
        
        if not validation_result['is_valid']:
            raise ValueError(f"Data validation failed: {validation_result['errors']}")
        
        return validation_result['data']
    
    def process_bulk_students(self, students_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process multiple students' data"""
        processed_students = []
        errors = []
        
        for i, student_data in enumerate(students_data):
            try:
                processed_student = self.process_single_student(student_data)
                processed_students.append(processed_student)
            except ValueError as e:
                errors.append(f"Student {i+1}: {str(e)}")
        
        return {
            'processed_students': processed_students,
            'errors': errors,
            'success_count': len(processed_students),
            'error_count': len(errors)
        }
    
    def calculate_derived_features(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate additional features from raw data"""
        enhanced_data = student_data.copy()
        
        # Calculate average test score
        test_scores = student_data.get('test_scores', [])
        if test_scores:
            enhanced_data['avg_test_score'] = np.mean(test_scores)
            enhanced_data['min_test_score'] = np.min(test_scores)
            enhanced_data['max_test_score'] = np.max(test_scores)
            enhanced_data['test_score_std'] = np.std(test_scores) if len(test_scores) > 1 else 0
        else:
            enhanced_data['avg_test_score'] = 75.0
            enhanced_data['min_test_score'] = 75.0
            enhanced_data['max_test_score'] = 75.0
            enhanced_data['test_score_std'] = 0
        
        # Risk indicators
        enhanced_data['low_attendance_risk'] = student_data.get('attendance_percentage', 75) < 70
        enhanced_data['poor_performance_risk'] = enhanced_data['avg_test_score'] < 60
        enhanced_data['fee_risk'] = student_data.get('fee_status', 'paid').lower() in ['pending', 'overdue']
        
        # Calculate composite risk indicators
        risk_count = sum([
            enhanced_data['low_attendance_risk'],
            enhanced_data['poor_performance_risk'],
            enhanced_data['fee_risk']
        ])
        enhanced_data['multiple_risk_factors'] = risk_count >= 2
        
        return enhanced_data
    
    def create_feature_vector(self, student_data: Dict[str, Any]) -> np.ndarray:
        """Create a numerical feature vector for ML model"""
        enhanced_data = self.calculate_derived_features(student_data)
        
        # Encode categorical variables
        gender_encoding = {'male': 0, 'female': 1, 'other': 2}
        fee_status_encoding = {'paid': 0, 'pending': 1, 'overdue': 2}
        
        feature_vector = [
            enhanced_data.get('age', 16),
            gender_encoding.get(enhanced_data.get('gender', 'other').lower(), 2),
            enhanced_data.get('attendance_percentage', 75),
            enhanced_data.get('avg_test_score', 75),
            enhanced_data.get('test_score_std', 0),
            fee_status_encoding.get(enhanced_data.get('fee_status', 'paid').lower(), 0),
            enhanced_data.get('previous_gpa', 3.0) or 3.0,
            enhanced_data.get('distance_from_school', 5.0) or 5.0,
            int(enhanced_data.get('low_attendance_risk', False)),
            int(enhanced_data.get('poor_performance_risk', False)),
            int(enhanced_data.get('fee_risk', False)),
            int(enhanced_data.get('multiple_risk_factors', False))
        ]
        
        return np.array(feature_vector).reshape(1, -1)
    
    def export_to_csv(self, students_data: List[Dict[str, Any]], filename: str):
        """Export processed student data to CSV"""
        df = pd.DataFrame(students_data)
        df.to_csv(filename, index=False)
        return filename
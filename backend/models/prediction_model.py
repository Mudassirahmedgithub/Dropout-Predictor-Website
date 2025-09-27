import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
from typing import Dict, List, Any
import warnings
warnings.filterwarnings('ignore')

class DropoutPredictor:
    def __init__(self):
        self.rf_model = RandomForestClassifier(
            n_estimators=100, 
            random_state=42, 
            max_depth=10,
            min_samples_split=5
        )
        self.lr_model = LogisticRegression(random_state=42, max_iter=1000)
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.is_trained = False
        self.feature_names = []
        
        # Initialize with sample training
        self._train_initial_model()
    
    def _train_initial_model(self):
        """Train the model with synthetic data for demonstration"""
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 2000
        
        # Create synthetic features
        data = {
            'attendance_percentage': np.random.normal(75, 15, n_samples),
            'avg_test_score': np.random.normal(70, 20, n_samples),
            'fee_status_encoded': np.random.choice([0, 1, 2], n_samples, p=[0.6, 0.25, 0.15]),  # paid, pending, overdue
            'age': np.random.normal(16, 2, n_samples),
            'previous_gpa': np.random.normal(3.0, 0.8, n_samples),
            'distance_from_school': np.random.exponential(5, n_samples),
            'parent_education_encoded': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'family_income_encoded': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2])
        }
        
        df = pd.DataFrame(data)
        
        # Clip values to realistic ranges
        df['attendance_percentage'] = np.clip(df['attendance_percentage'], 0, 100)
        df['avg_test_score'] = np.clip(df['avg_test_score'], 0, 100)
        df['age'] = np.clip(df['age'], 14, 20)
        df['previous_gpa'] = np.clip(df['previous_gpa'], 0, 4.0)
        df['distance_from_school'] = np.clip(df['distance_from_school'], 0, 50)
        
        # Create target variable (dropout risk) based on realistic patterns
        dropout_risk = (
            (df['attendance_percentage'] < 70) * 0.4 +
            (df['avg_test_score'] < 60) * 0.3 +
            (df['fee_status_encoded'] == 2) * 0.2 +  # overdue fees
            (df['previous_gpa'] < 2.5) * 0.3 +
            np.random.normal(0, 0.1, n_samples)
        )
        
        # Convert to binary classification (0: low risk, 1: high risk)
        y = (dropout_risk > 0.5).astype(int)
        
        # Prepare features
        X = df.values
        self.feature_names = list(df.columns)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train models
        self.rf_model.fit(X_train_scaled, y_train)
        self.lr_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        rf_pred = self.rf_model.predict(X_test_scaled)
        lr_pred = self.lr_model.predict(X_test_scaled)
        
        print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_pred):.3f}")
        print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_pred):.3f}")
        
        self.is_trained = True
    
    def preprocess_features(self, student_data: Dict[str, Any]) -> np.ndarray:
        """Preprocess student data into model features"""
        # Calculate average test score
        test_scores = student_data.get('test_scores', [75.0])
        avg_test_score = np.mean(test_scores) if test_scores else 75.0
        
        # Encode categorical variables
        fee_status_map = {'paid': 0, 'pending': 1, 'overdue': 2}
        fee_status_encoded = fee_status_map.get(student_data.get('fee_status', 'paid').lower(), 0)
        
        parent_education_map = {'none': 0, 'primary': 1, 'secondary': 2, 'higher': 3}
        parent_education = student_data.get('parent_education', '').lower()
        parent_education_encoded = parent_education_map.get(parent_education, 1)
        
        family_income_map = {'low': 0, 'medium': 1, 'high': 2}
        family_income = student_data.get('family_income', '').lower()
        self.student_data = pd.read_csv('datasets/student_data.csv')
        
        # Create feature vector
        family_income_encoded = 0  # Default value to avoid undefined error
        features = np.array([
            student_data.get('attendance_percentage', 75.0),
            avg_test_score,
            fee_status_encoded,
            student_data.get('age', 16),
            student_data.get('previous_gpa', 3.0),
            student_data.get('distance_from_school', 5.0),
            parent_education_encoded,
            family_income_encoded
        ]).reshape(1, -1)
        
        return features
    
    def apply_rule_based_logic(self, student_data: Dict[str, Any]) -> float:
        """Apply rule-based risk assessment"""
        risk_score = 0.0
        
        # Attendance rules
        attendance = student_data.get('attendance_percentage', 75.0)
        if attendance < 50:
            risk_score += 0.4
        elif attendance < 70:
            risk_score += 0.2
        
        # Test score rules
        test_scores = student_data.get('test_scores', [75.0])
        avg_score = np.mean(test_scores) if test_scores else 75.0
        if avg_score < 40:
            risk_score += 0.3
        elif avg_score < 60:
            risk_score += 0.15
        
        # Fee status rules
        fee_status = student_data.get('fee_status', 'paid').lower()
        if fee_status == 'overdue':
            risk_score += 0.25
        elif fee_status == 'pending':
            risk_score += 0.1
        
        # GPA rules
        previous_gpa = student_data.get('previous_gpa', 3.0)
        if previous_gpa and previous_gpa < 2.0:
            risk_score += 0.2
        elif previous_gpa and previous_gpa < 2.5:
            risk_score += 0.1
        
        return min(risk_score, 1.0)  # Cap at 1.0
    
    def predict_single(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make prediction for a single student"""
        if not self.is_trained:
            raise ValueError("Model is not trained yet")
        
        # Preprocess features
        features = self.preprocess_features(student_data)
        features_scaled = self.scaler.transform(features)
        
        # Get ML predictions
        rf_prob = self.rf_model.predict_proba(features_scaled)[0, 1]
        lr_prob = self.lr_model.predict_proba(features_scaled)[0, 1]
        
        # Ensemble ML prediction
        ml_prob = 0.6 * rf_prob + 0.4 * lr_prob
        
        # Get rule-based prediction
        rule_risk = self.apply_rule_based_logic(student_data)
        
        # Hybrid prediction (weighted combination)
        final_prob = 0.7 * ml_prob + 0.3 * rule_risk
        
        # Calculate risk score (0-100)
        risk_score = final_prob * 100
        
        return {
            'dropout_probability': final_prob,
            'risk_score': risk_score,
            'ml_probability': ml_prob,
            'rule_risk': rule_risk,
            'rf_probability': rf_prob,
            'lr_probability': lr_prob
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the Random Forest model"""
        if not self.is_trained:
            return {}
        
        importance = self.rf_model.feature_importances_
        return dict(zip(self.feature_names, importance))
    
    def save_model(self, filepath: str):
        """Save the trained model"""
        model_data = {
            'rf_model': self.rf_model,
            'lr_model': self.lr_model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }
        joblib.dump(model_data, filepath)
    
    def load_model(self, filepath: str):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.rf_model = model_data['rf_model']
        self.lr_model = model_data['lr_model']
        self.scaler = model_data['scaler']
        self.feature_names = model_data['feature_names']
        self.is_trained = model_data['is_trained']
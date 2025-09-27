import numpy as np
from typing import Dict, List, Any, Tuple

class RiskAnalyzer:
    def __init__(self):
        self.risk_thresholds = {
            'green': 0.3,   # Low risk: 0-30%
            'yellow': 0.7,  # Medium risk: 30-70%
            'red': 1.0      # High risk: 70-100%
        }
        
        self.risk_factors_weights = {
            'low_attendance': 0.3,
            'poor_performance': 0.25,
            'fee_issues': 0.2,
            'low_gpa': 0.15,
            'demographic_risk': 0.1
        }
    
    def get_risk_level(self, dropout_probability: float) -> str:
        """Determine risk level based on dropout probability"""
        if dropout_probability <= self.risk_thresholds['green']:
            return "Green"
        elif dropout_probability <= self.risk_thresholds['yellow']:
            return "Yellow"
        else:
            return "Red"
    
    def analyze_risk_factors(self, student_data: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze specific risk factors for a student"""
        risk_factors = []
        risk_scores = {}
        
        # Attendance analysis
        attendance = student_data.get('attendance_percentage', 75)
        if attendance < 50:
            risk_factors.append("Critical attendance issues (below 50%)")
            risk_scores['attendance'] = 0.8
        elif attendance < 70:
            risk_factors.append("Low attendance (below 70%)")
            risk_scores['attendance'] = 0.5
        elif attendance < 85:
            risk_factors.append("Moderate attendance concerns")
            risk_scores['attendance'] = 0.2
        else:
            risk_scores['attendance'] = 0.0
        
        # Academic performance analysis
        test_scores = student_data.get('test_scores', [75])
        avg_score = np.mean(test_scores) if test_scores else 75
        
        if avg_score < 40:
            risk_factors.append("Severe academic performance issues (below 40%)")
            risk_scores['performance'] = 0.8
        elif avg_score < 60:
            risk_factors.append("Poor academic performance (below 60%)")
            risk_scores['performance'] = 0.5
        elif avg_score < 75:
            risk_factors.append("Below average academic performance")
            risk_scores['performance'] = 0.3
        else:
            risk_scores['performance'] = 0.0
        
        # Fee status analysis
        fee_status = student_data.get('fee_status', 'paid').lower()
        if fee_status == 'overdue':
            risk_factors.append("Overdue fee payments")
            risk_scores['financial'] = 0.6
        elif fee_status == 'pending':
            risk_factors.append("Pending fee payments")
            risk_scores['financial'] = 0.3
        else:
            risk_scores['financial'] = 0.0
        
        # Previous GPA analysis
        previous_gpa = student_data.get('previous_gpa')
        if previous_gpa is not None:
            if previous_gpa < 2.0:
                risk_factors.append("Very low previous GPA (below 2.0)")
                risk_scores['gpa'] = 0.7
            elif previous_gpa < 2.5:
                risk_factors.append("Low previous GPA (below 2.5)")
                risk_scores['gpa'] = 0.4
            elif previous_gpa < 3.0:
                risk_factors.append("Below average previous GPA")
                risk_scores['gpa'] = 0.2
            else:
                risk_scores['gpa'] = 0.0
        else:
            risk_scores['gpa'] = 0.1  # Missing data is a mild risk factor
        
        # Demographic risk factors
        age = student_data.get('age', 16)
        distance = student_data.get('distance_from_school', 5)
        
        if age > 18:
            risk_factors.append("Above typical school age")
            risk_scores['demographic'] = 0.3
        else:
            risk_scores['demographic'] = 0.0
        
        if distance and distance > 20:
            risk_factors.append("Lives far from school (>20km)")
            risk_scores['demographic'] += 0.2
        
        # Analyze consistency and trends
        if len(test_scores) > 1:
            score_trend = np.polyfit(range(len(test_scores)), test_scores, 1)[0]
            if score_trend < -5:  # Declining by more than 5 points per test
                risk_factors.append("Declining academic performance trend")
                risk_scores['performance'] += 0.2
        
        # Multiple risk factors
        active_risks = len([score for score in risk_scores.values() if score > 0.3])
        if active_risks >= 3:
            risk_factors.append("Multiple concurrent risk factors")
        
        return {
            'risk_factors': risk_factors,
            'risk_scores': risk_scores,
            'total_risk_score': sum(risk_scores.values()) / len(risk_scores),
            'active_risk_count': active_risks
        }
    
    def get_recommendations(self, risk_factors: List[str]) -> List[str]:
        """Generate recommendations based on identified risk factors"""
        recommendations = []
        
        # Attendance-based recommendations
        attendance_risks = [rf for rf in risk_factors if 'attendance' in rf.lower()]
        if attendance_risks:
            recommendations.extend([
                "Schedule immediate meeting with student and parents",
                "Implement attendance monitoring system",
                "Identify and address barriers to attendance",
                "Consider flexible scheduling options if appropriate"
            ])
        
        # Performance-based recommendations
        performance_risks = [rf for rf in risk_factors if 'performance' in rf.lower() or 'academic' in rf.lower()]
        if performance_risks:
            recommendations.extend([
                "Arrange academic support and tutoring",
                "Review learning methods and study habits",
                "Consider additional assessment to identify learning gaps",
                "Implement personalized learning plan"
            ])
        
        # Financial recommendations
        financial_risks = [rf for rf in risk_factors if 'fee' in rf.lower() or 'payment' in rf.lower()]
        if financial_risks:
            recommendations.extend([
                "Connect family with financial aid resources",
                "Discuss payment plan options",
                "Explore scholarship opportunities",
                "Provide information on government assistance programs"
            ])
        
        # GPA-based recommendations
        gpa_risks = [rf for rf in risk_factors if 'gpa' in rf.lower()]
        if gpa_risks:
            recommendations.extend([
                "Review previous academic records for patterns",
                "Implement intensive academic support program",
                "Consider grade recovery options",
                "Schedule regular progress check-ins"
            ])
        
        # General recommendations for high-risk students
        if len(risk_factors) >= 3:
            recommendations.extend([
                "Urgent intervention required - escalate to counseling team",
                "Develop comprehensive support plan with multiple stakeholders",
                "Consider assigning dedicated mentor or counselor",
                "Regular monitoring and follow-up essential"
            ])
        
        # Demographic-based recommendations
        demographic_risks = [rf for rf in risk_factors if 'age' in rf.lower() or 'distance' in rf.lower()]
        if demographic_risks:
            recommendations.extend([
                "Assess transportation and logistics challenges",
                "Consider remote learning options if available",
                "Connect with community support resources"
            ])
        
        # Remove duplicates and limit to most relevant
        unique_recommendations = list(set(recommendations))
        return unique_recommendations[:8]  # Limit to top 8 recommendations
    
    def generate_alert_message(self, student_data: Dict[str, Any], risk_level: str, risk_factors: List[str]) -> str:
        """Generate alert message for mentors/counselors"""
        student_name = student_data.get('name', 'Unknown Student')
        student_id = student_data.get('student_id', 'Unknown ID')
        
        if risk_level == "Red":
            urgency = "URGENT"
            action = "immediate intervention required"
        elif risk_level == "Yellow":
            urgency = "MODERATE"
            action = "close monitoring recommended"
        else:
            urgency = "LOW"
            action = "regular check-in suggested"
        
        primary_risks = risk_factors[:3] if len(risk_factors) >= 3 else risk_factors
        
        message = f"{urgency} ALERT: {student_name} (ID: {student_id}) - {risk_level} risk level, {action}. "
        message += f"Key concerns: {', '.join(primary_risks[:2])}"
        
        if len(risk_factors) > 2:
            message += f" and {len(risk_factors) - 2} other factors."
        
        return message
    
    def calculate_intervention_priority(self, students_predictions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Calculate intervention priority for multiple students"""
        prioritized_students = []
        
        for student_pred in students_predictions:
            risk_level = student_pred.get('risk_level', 'Green')
            risk_factors_count = len(student_pred.get('risk_factors', []))
            dropout_prob = student_pred.get('dropout_probability', 0)
            
            # Calculate priority score
            priority_score = 0
            if risk_level == "Red":
                priority_score += 100
            elif risk_level == "Yellow":
                priority_score += 50
            
            priority_score += risk_factors_count * 10
            priority_score += dropout_prob * 30
            
            # Add urgency factors
            risk_factors = student_pred.get('risk_factors', [])
            if any('critical' in rf.lower() or 'severe' in rf.lower() for rf in risk_factors):
                priority_score += 20
            
            if any('attendance' in rf.lower() and 'below 50' in rf.lower() for rf in risk_factors):
                priority_score += 25
            
            student_pred['priority_score'] = priority_score
            student_pred['priority_rank'] = self._get_priority_rank(priority_score)
            
            prioritized_students.append(student_pred)
        
        # Sort by priority score (descending)
        prioritized_students.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return prioritized_students
    
    def _get_priority_rank(self, priority_score: float) -> str:
        """Convert priority score to rank"""
        if priority_score >= 120:
            return "Critical"
        elif priority_score >= 80:
            return "High"
        elif priority_score >= 40:
            return "Medium"
        else:
            return "Low"
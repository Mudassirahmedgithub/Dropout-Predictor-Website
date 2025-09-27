import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Brain, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const SinglePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Process form data
      const studentData = {
        ...data,
        test_scores: data.test_scores.split(',').map(score => parseFloat(score.trim())).filter(score => !isNaN(score)),
        attendance_percentage: parseFloat(data.attendance_percentage),
        age: parseInt(data.age),
        previous_gpa: data.previous_gpa ? parseFloat(data.previous_gpa) : null,
        distance_from_school: data.distance_from_school ? parseFloat(data.distance_from_school) : null
      };

      // Simulate API call
      setTimeout(() => {
        const mockPrediction = {
          student_id: studentData.student_id,
          name: studentData.name,
          risk_level: Math.random() > 0.7 ? 'Red' : Math.random() > 0.4 ? 'Yellow' : 'Green',
          risk_score: Math.random() * 100,
          dropout_probability: Math.random(),
          risk_factors: [
            studentData.attendance_percentage < 70 ? 'Low attendance (below 70%)' : null,
            studentData.test_scores.some(score => score < 60) ? 'Poor academic performance' : null,
            studentData.fee_status !== 'paid' ? 'Fee payment issues' : null,
            studentData.previous_gpa && studentData.previous_gpa < 2.5 ? 'Low previous GPA' : null
          ].filter(Boolean),
          recommendations: [
            'Schedule immediate meeting with student and parents',
            'Implement attendance monitoring system',
            'Arrange academic support and tutoring',
            'Connect family with financial aid resources'
          ],
          alert_needed: true
        };
        
        // Adjust risk level based on actual data
        if (studentData.attendance_percentage < 50 || studentData.fee_status === 'overdue') {
          mockPrediction.risk_level = 'Red';
          mockPrediction.risk_score = 80 + Math.random() * 20;
        } else if (studentData.attendance_percentage < 70 || studentData.fee_status === 'pending') {
          mockPrediction.risk_level = 'Yellow';
          mockPrediction.risk_score = 40 + Math.random() * 40;
        } else {
          mockPrediction.risk_level = 'Green';
          mockPrediction.risk_score = Math.random() * 40;
        }

        setPrediction(mockPrediction);
        setLoading(false);
        toast.success('Prediction completed successfully!');
      }, 2000);

    } catch (error) {
      setLoading(false);
      toast.error('Prediction failed. Please try again.');
      console.error('Prediction error:', error);
    }
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-md">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Single Student Prediction</h1>
            <p className="text-gray-600">Predict dropout risk for an individual student</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Student Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('student_id', { required: 'Student ID is required' })}
                  placeholder="e.g., ST001"
                />
                {errors.student_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.student_id.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('name', { required: 'Student name is required' })}
                  placeholder="e.g., John Doe"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  className="form-input"
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 10, message: 'Age must be at least 10' },
                    max: { value: 25, message: 'Age must be at most 25' }
                  })}
                  placeholder="16"
                />
                {errors.age && (
                  <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-select" {...register('gender', { required: 'Gender is required' })}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Attendance % *</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  {...register('attendance_percentage', { 
                    required: 'Attendance percentage is required',
                    min: { value: 0, message: 'Attendance cannot be negative' },
                    max: { value: 100, message: 'Attendance cannot exceed 100%' }
                  })}
                  placeholder="85.5"
                />
                {errors.attendance_percentage && (
                  <p className="text-red-600 text-sm mt-1">{errors.attendance_percentage.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Test Scores *</label>
              <input
                type="text"
                className="form-input"
                {...register('test_scores', { required: 'Test scores are required' })}
                placeholder="85, 78, 92, 80 (comma-separated)"
              />
              <p className="text-gray-500 text-sm mt-1">Enter test scores separated by commas</p>
              {errors.test_scores && (
                <p className="text-red-600 text-sm mt-1">{errors.test_scores.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Fee Status *</label>
                <select className="form-select" {...register('fee_status', { required: 'Fee status is required' })}>
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
                {errors.fee_status && (
                  <p className="text-red-600 text-sm mt-1">{errors.fee_status.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Previous GPA</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  {...register('previous_gpa', {
                    min: { value: 0, message: 'GPA cannot be negative' },
                    max: { value: 4.0, message: 'GPA cannot exceed 4.0' }
                  })}
                  placeholder="3.2"
                />
                {errors.previous_gpa && (
                  <p className="text-red-600 text-sm mt-1">{errors.previous_gpa.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Family Income</label>
                <select className="form-select" {...register('family_income')}>
                  <option value="">Select Income Level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Distance from School (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  {...register('distance_from_school', {
                    min: { value: 0, message: 'Distance cannot be negative' }
                  })}
                  placeholder="5.2"
                />
                {errors.distance_from_school && (
                  <p className="text-red-600 text-sm mt-1">{errors.distance_from_school.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Parent Education</label>
              <select className="form-select" {...register('parent_education')}>
                <option value="">Select Education Level</option>
                <option value="none">No formal education</option>
                <option value="primary">Primary education</option>
                <option value="secondary">Secondary education</option>
                <option value="higher">Higher education</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Predict Dropout Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Prediction Results</h2>
          
          {!prediction && !loading && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Fill out the form and click "Predict" to see results</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <LoadingSpinner size="large" className="mx-auto mb-4" />
              <p className="text-gray-600">Analyzing student data...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
            </div>
          )}

          {prediction && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">{prediction.name}</h3>
                <p className="text-gray-600 text-sm">ID: {prediction.student_id}</p>
              </div>

              {/* Risk Assessment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Risk Level:</span>
                  <RiskBadge level={prediction.risk_level} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Risk Score:</span>
                  <span className="font-semibold">{Math.round(prediction.risk_score)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Dropout Probability:</span>
                  <span className="font-semibold">{Math.round(prediction.dropout_probability * 100)}%</span>
                </div>
              </div>

              {/* Risk Factors */}
              {prediction.risk_factors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {prediction.risk_factors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={handleNewPrediction}
                  className="btn btn-secondary flex-1"
                >
                  New Prediction
                </button>
                <button className="btn btn-primary flex-1">
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePrediction;
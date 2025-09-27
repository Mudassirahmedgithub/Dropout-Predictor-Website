import React, { useState } from 'react';
import { Upload, FileText, Download, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const BulkPrediction = () => {
  const [csvData, setCsvData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
    onDrop: handleFileUpload
  });

  function handleFileUpload(files) {
    const file = files[0];
    if (!file) return;

    setProcessingStep('Reading CSV file...');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file');
          console.error('CSV parsing errors:', results.errors);
          return;
        }

        // Validate required columns
        const requiredColumns = ['student_id', 'name', 'age', 'gender', 'attendance_percentage', 'fee_status'];
        const csvColumns = Object.keys(results.data[0] || {});
        const missingColumns = requiredColumns.filter(col => !csvColumns.includes(col));

        if (missingColumns.length > 0) {
          toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        setCsvData({
          data: results.data,
          meta: results.meta,
          preview: results.data.slice(0, 5)
        });
        setProcessingStep('');
        toast.success(`Successfully loaded ${results.data.length} student records`);
      },
      error: (error) => {
        toast.error('Failed to parse CSV file');
        console.error('CSV parsing error:', error);
        setProcessingStep('');
      }
    });
  }

  const handleBulkPrediction = async () => {
    if (!csvData) return;

    setLoading(true);
    setProcessingStep('Processing student data...');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStep('Running ML predictions...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStep('Analyzing risk factors...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStep('Generating recommendations...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock predictions
      const mockPredictions = csvData.data.map((student, index) => {
        const attendance = parseFloat(student.attendance_percentage) || 75;
        const feeStatus = (student.fee_status || '').toLowerCase();
        
        let riskLevel = 'Green';
        let riskScore = Math.random() * 40;
        
        // Determine risk based on data
        if (attendance < 50 || feeStatus === 'overdue') {
          riskLevel = 'Red';
          riskScore = 70 + Math.random() * 30;
        } else if (attendance < 70 || feeStatus === 'pending') {
          riskLevel = 'Yellow';
          riskScore = 40 + Math.random() * 30;
        }

        const riskFactors = [
          attendance < 70 ? `Low attendance (${attendance}%)` : null,
          feeStatus === 'overdue' ? 'Overdue fee payments' : null,
          feeStatus === 'pending' ? 'Pending fee payments' : null,
          student.previous_gpa && parseFloat(student.previous_gpa) < 2.5 ? 'Low previous GPA' : null
        ].filter(Boolean);

        return {
          student_id: student.student_id,
          name: student.name,
          risk_level: riskLevel,
          risk_score: riskScore,
          dropout_probability: riskScore / 100,
          risk_factors: riskFactors,
          recommendations: generateRecommendations(riskFactors),
          alert_needed: riskLevel !== 'Green'
        };
      });

      const summary = {
        total_students: mockPredictions.length,
        green_risk: mockPredictions.filter(p => p.risk_level === 'Green').length,
        yellow_risk: mockPredictions.filter(p => p.risk_level === 'Yellow').length,
        red_risk: mockPredictions.filter(p => p.risk_level === 'Red').length,
        alerts: mockPredictions.filter(p => p.alert_needed).length
      };

      setPredictions({
        results: mockPredictions,
        summary: summary,
        alerts: mockPredictions.filter(p => p.alert_needed).slice(0, 10) // Top 10 alerts
      });

      setLoading(false);
      setProcessingStep('');
      toast.success('Bulk prediction completed successfully!');

    } catch (error) {
      setLoading(false);
      setProcessingStep('');
      toast.error('Prediction failed. Please try again.');
      console.error('Bulk prediction error:', error);
    }
  };

  const generateRecommendations = (riskFactors) => {
    const recommendations = [];
    
    if (riskFactors.some(f => f && f.includes('attendance'))) {
      recommendations.push('Implement attendance monitoring system');
      recommendations.push('Schedule meeting with student and parents');
    }
    
    if (riskFactors.some(f => f && f.includes('fee'))) {
      recommendations.push('Connect family with financial aid resources');
      recommendations.push('Discuss payment plan options');
    }
    
    if (riskFactors.some(f => f && f.includes('GPA'))) {
      recommendations.push('Arrange academic support and tutoring');
      recommendations.push('Review learning methods and study habits');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue regular monitoring');
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const downloadResults = () => {
    if (!predictions) return;

    const csvContent = Papa.unparse(predictions.results.map(p => ({
      student_id: p.student_id,
      name: p.name,
      risk_level: p.risk_level,
      risk_score: Math.round(p.risk_score),
      dropout_probability: Math.round(p.dropout_probability * 100),
      risk_factors: p.risk_factors.join('; '),
      recommendations: p.recommendations.join('; '),
      alert_needed: p.alert_needed ? 'Yes' : 'No'
    })));

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dropout_predictions_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Results downloaded successfully!');
  };

  const downloadTemplate = () => {
    const template = [
      {
        student_id: 'ST001',
        name: 'John Doe',
        age: 16,
        gender: 'male',
        attendance_percentage: 85.5,
        fee_status: 'paid',
        previous_gpa: 3.2,
        family_income: 'medium',
        distance_from_school: 5.2,
        parent_education: 'secondary',
        test1: 85,
        test2: 78,
        test3: 92
      },
      {
        student_id: 'ST002',
        name: 'Jane Smith',
        age: 17,
        gender: 'female',
        attendance_percentage: 92.0,
        fee_status: 'paid',
        previous_gpa: 3.8,
        family_income: 'high',
        distance_from_school: 2.1,
        parent_education: 'higher',
        test1: 90,
        test2: 88,
        test3: 94
      }
    ];

    const csvContent = Papa.unparse(template);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_data_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template downloaded successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-md">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Prediction</h1>
              <p className="text-gray-600">Upload CSV files for batch dropout risk analysis</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="btn btn-secondary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      {!csvData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Student Data</h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
            
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the CSV file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-gray-500 text-sm">
                  Supports CSV files with student data
                </p>
              </div>
            )}
          </div>

          {processingStep && (
            <div className="mt-4 flex items-center justify-center">
              <LoadingSpinner size="small" className="mr-2" />
              <span className="text-gray-600">{processingStep}</span>
            </div>
          )}

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Required Columns:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
              <span>• student_id</span>
              <span>• name</span>
              <span>• age</span>
              <span>• gender</span>
              <span>• attendance_percentage</span>
              <span>• fee_status</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Optional columns: previous_gpa, family_income, distance_from_school, parent_education, test scores (test1, test2, etc.)
            </p>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {csvData && !predictions && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
            <div className="text-sm text-gray-600">
              {csvData.data.length} students loaded
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(csvData.preview[0] || {}).map((header) => (
                    <th key={header} className="text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.preview.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="text-sm">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleBulkPrediction}
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Run Bulk Prediction
                </>
              )}
            </button>
            
            <button
              onClick={() => setCsvData(null)}
              className="btn btn-secondary"
            >
              Upload Different File
            </button>
          </div>

          {loading && processingStep && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-3" />
                <div>
                  <p className="font-medium text-blue-900">{processingStep}</p>
                  <p className="text-blue-700 text-sm">Please wait while we analyze the data...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prediction Results */}
      {predictions && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{predictions.summary.total_students}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">{predictions.summary.green_risk}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Medium Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">{predictions.summary.yellow_risk}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{predictions.summary.red_risk}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Prediction Results</h2>
              <div className="flex space-x-3">
                <button
                  onClick={downloadResults}
                  className="btn btn-success flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Results
                </button>
                <button
                  onClick={() => {
                    setCsvData(null);
                    setPredictions(null);
                  }}
                  className="btn btn-secondary"
                >
                  New Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Priority Alerts */}
          {predictions.alerts.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Priority Alerts ({predictions.alerts.length})
                </h3>
              </div>
              <div className="divide-y">
                {predictions.alerts.slice(0, 5).map((student, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <span className="text-sm text-gray-500">ID: {student.student_id}</span>
                          <RiskBadge level={student.risk_level} score={student.risk_score} />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Risk factors: {student.risk_factors.slice(0, 2).join(', ')}
                          {student.risk_factors.length > 2 && ` +${student.risk_factors.length - 2} more`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Results Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Risk Level</th>
                    <th>Risk Score</th>
                    <th>Primary Risk Factors</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.results.slice(0, 20).map((student, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                        </div>
                      </td>
                      <td>
                        <RiskBadge level={student.risk_level} />
                      </td>
                      <td className="font-medium">
                        {Math.round(student.risk_score)}%
                      </td>
                      <td>
                        <div className="text-sm text-gray-600">
                          {student.risk_factors.length > 0 
                            ? student.risk_factors.slice(0, 2).join(', ')
                            : 'No significant risks'
                          }
                          {student.risk_factors.length > 2 && (
                            <span className="text-gray-400"> +{student.risk_factors.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {student.alert_needed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {predictions.results.length > 20 && (
              <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
                Showing first 20 of {predictions.results.length} students. Download full results for complete data.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkPrediction;
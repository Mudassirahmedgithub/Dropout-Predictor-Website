import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Phone,
  MapPin,
  GraduationCap,
  User,
  Clock,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleViewAlert = (alert) => {
    // Create detailed student data based on the alert
    const studentDetails = {
      ...alert,
      age: 16 + Math.floor(Math.random() * 3), // Random age 16-18
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      attendancePercentage: alert.riskLevel === 'Red' ? 
        (Math.random() * 40 + 10) : // 10-50% for red
        alert.riskLevel === 'Yellow' ? 
        (Math.random() * 30 + 50) : // 50-80% for yellow
        (Math.random() * 20 + 80), // 80-100% for green
      feeStatus: alert.riskLevel === 'Red' ? 
        (Math.random() > 0.5 ? 'overdue' : 'pending') : 
        alert.riskLevel === 'Yellow' ? 
        (Math.random() > 0.7 ? 'pending' : 'paid') : 'paid',
      riskScore: alert.riskLevel === 'Red' ? 
        (Math.random() * 30 + 70) : // 70-100% for red
        alert.riskLevel === 'Yellow' ? 
        (Math.random() * 30 + 40) : // 40-70% for yellow
        (Math.random() * 40 + 0), // 0-40% for green
      lastPrediction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      riskFactors: alert.riskLevel === 'Red' ? 
        ['Low attendance (below 50%)', 'Overdue fee payments', 'Poor academic performance'] :
        alert.riskLevel === 'Yellow' ?
        ['Declining grades', 'Irregular attendance'] :
        ['Regular monitoring recommended'],
      recommendations: alert.riskLevel === 'Red' ?
        ['Immediate intervention required', 'Schedule parent meeting', 'Academic support program'] :
        alert.riskLevel === 'Yellow' ?
        ['Monitor closely', 'Academic counseling', 'Attendance tracking'] :
        ['Continue regular monitoring']
    };
    
    setSelectedStudent(studentDetails);
    setShowModal(true);
  };

  const fetchDashboardData = async () => {
    try {
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setDashboardData({
          totalStudents: 1250,
          atRiskStudents: 87,
          alertsToday: 12,
          interventionSuccessRate: 78.5,
          riskDistribution: {
            green: 892,
            yellow: 271,
            red: 87
          },
          weeklyTrends: [
            { day: 'Mon', predictions: 45, interventions: 8 },
            { day: 'Tue', predictions: 52, interventions: 12 },
            { day: 'Wed', predictions: 38, interventions: 6 },
            { day: 'Thu', predictions: 67, interventions: 15 },
            { day: 'Fri', predictions: 41, interventions: 9 },
            { day: 'Sat', predictions: 58, interventions: 11 },
            { day: 'Sun', predictions: 43, interventions: 7 }
          ]
        });

        setAlerts([
          {
            id: 1,
            studentName: 'Rahul Sharma',
            studentId: 'ST001',
            riskLevel: 'Red',
            message: 'Critical attendance issues (below 50%) and overdue fees',
            timestamp: '10 minutes ago'
          },
          {
            id: 2,
            studentName: 'Priya Patel',
            studentId: 'ST045',
            riskLevel: 'Yellow',
            message: 'Declining academic performance trend',
            timestamp: '25 minutes ago'
          },
          {
            id: 3,
            studentName: 'Amit Kumar',
            studentId: 'ST123',
            riskLevel: 'Red',
            message: 'Multiple concurrent risk factors',
            timestamp: '1 hour ago'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const pieChartData = [
    { name: 'Low Risk', value: dashboardData.riskDistribution.green, color: '#10b981' },
    { name: 'Medium Risk', value: dashboardData.riskDistribution.yellow, color: '#f59e0b' },
    { name: 'High Risk', value: dashboardData.riskDistribution.red, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-based Dropout Prediction System Overview</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalStudents.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">At Risk Students</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.atRiskStudents}</p>
              <p className="text-xs text-red-600">Requires attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <GraduationCap className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alerts Today</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.alertsToday}</p>
              <p className="text-xs text-yellow-600">New alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.interventionSuccessRate}%</p>
              <p className="text-xs text-green-600">Interventions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="predictions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Predictions"
              />
              <Line 
                type="monotone" 
                dataKey="interventions" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Interventions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow" data-section="recent-alerts">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {alert.studentName}
                    </h4>
                    <span className="text-xs text-gray-500">ID: {alert.studentId}</span>
                    <RiskBadge level={alert.riskLevel} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{alert.timestamp}</p>
                </div>
                <button 
                  onClick={() => handleViewAlert(alert)}
                  className="ml-4 btn btn-sm btn-primary"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Single Prediction</h3>
          <p className="text-gray-600 text-sm mb-4">Predict dropout risk for individual students</p>
          <button 
            onClick={() => navigate('/single-prediction')}
            className="btn btn-primary w-full"
          >
            Get Started
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Analysis</h3>
          <p className="text-gray-600 text-sm mb-4">Upload CSV files for batch processing</p>
          <button 
            onClick={() => navigate('/bulk-prediction')}
            className="btn btn-success w-full"
          >
            Upload Data
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 text-sm mb-4">View detailed reports and insights</p>
          <button 
            onClick={() => navigate('/analytics')}
            className="btn btn-secondary w-full"
          >
            View Reports
          </button>
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-8 py-16"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl drop-shadow-2xl max-w-2xl w-full h-auto max-h-[68vh] overflow-hidden relative mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 rounded-t-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{selectedStudent.studentName}</h2>
                  <p className="text-sm text-gray-500 font-medium">ID: {selectedStudent.studentId}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-4 max-h-96">
              {/* Risk Assessment */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 shadow-sm border border-red-100">
                <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-red-600 mb-2 font-medium">Risk Level</p>
                    <RiskBadge level={selectedStudent.riskLevel} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-red-600 mb-2 font-medium">Risk Score</p>
                    <p className="font-bold text-3xl text-red-700">{selectedStudent.riskScore.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center shadow-sm border border-blue-100">
                  <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900 mb-2">Attendance</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-1">
                    {selectedStudent.attendancePercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedStudent.attendancePercentage < 75 ? 'Below target' : 'Good attendance'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center shadow-sm border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900 mb-2">Fee Status</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    selectedStudent.feeStatus === 'paid' ? 'bg-green-200 text-green-800' :
                    selectedStudent.feeStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {selectedStudent.feeStatus.charAt(0).toUpperCase() + selectedStudent.feeStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Risk Factors */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm border border-orange-100">
                  <h4 className="font-semibold text-orange-900 mb-3 text-sm">Key Risk Factors</h4>
                  <div className="space-y-2">
                    {selectedStudent.riskFactors.slice(0, 2).map((factor, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-orange-700 leading-tight">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-3 text-sm">Immediate Actions</h4>
                  <div className="space-y-2">
                    {selectedStudent.recommendations.slice(0, 2).map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-purple-700 leading-tight">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-center items-center p-5 pb-6 px-8 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-b-xl">
              <div className="flex space-x-4 mb-2 mx-4">
                <button className="btn btn-sm btn-primary flex items-center text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Parent
                </button>
                <button 
                  onClick={() => navigate('/students')}
                  className="btn btn-sm btn-outline text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
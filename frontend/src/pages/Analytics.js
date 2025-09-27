import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData({
          overview: {
            totalPredictions: 2456,
            accuracyRate: 87.3,
            interventionRate: 73.2,
            preventedDropouts: 156
          },
          riskDistribution: [
            { name: 'Low Risk', value: 1567, percentage: 63.8, color: '#10b981' },
            { name: 'Medium Risk', value: 633, percentage: 25.8, color: '#f59e0b' },
            { name: 'High Risk', value: 256, percentage: 10.4, color: '#ef4444' }
          ],
          monthlyTrends: [
            { month: 'Jan', predictions: 180, interventions: 45, success: 38 },
            { month: 'Feb', predictions: 210, interventions: 52, success: 43 },
            { month: 'Mar', predictions: 195, interventions: 48, success: 39 },
            { month: 'Apr', predictions: 240, interventions: 65, success: 51 },
            { month: 'May', predictions: 225, interventions: 58, success: 46 },
            { month: 'Jun', predictions: 260, interventions: 71, success: 55 },
            { month: 'Jul', predictions: 245, interventions: 63, success: 48 },
            { month: 'Aug', predictions: 280, interventions: 78, success: 62 },
            { month: 'Sep', predictions: 295, interventions: 82, success: 67 }
          ],
          riskFactors: [
            { factor: 'Poor Attendance', count: 342, percentage: 38.2 },
            { factor: 'Academic Performance', count: 298, percentage: 33.3 },
            { factor: 'Fee Issues', count: 187, percentage: 20.9 },
            { factor: 'Low Previous GPA', count: 145, percentage: 16.2 },
            { factor: 'Demographic Factors', count: 89, percentage: 9.9 }
          ],
          interventionOutcomes: [
            { type: 'Academic Support', total: 145, successful: 112, rate: 77.2 },
            { type: 'Attendance Monitoring', total: 98, successful: 78, rate: 79.6 },
            { type: 'Financial Aid', total: 67, successful: 52, rate: 77.6 },
            { type: 'Counseling', total: 134, successful: 95, rate: 70.9 },
            { type: 'Mentoring', total: 89, successful: 71, rate: 79.8 }
          ],
          weeklyActivity: [
            { day: 'Mon', predictions: 45, alerts: 12 },
            { day: 'Tue', predictions: 52, alerts: 15 },
            { day: 'Wed', predictions: 38, alerts: 8 },
            { day: 'Thu', predictions: 67, alerts: 18 },
            { day: 'Fri', predictions: 41, alerts: 11 },
            { day: 'Sat', predictions: 28, alerts: 6 },
            { day: 'Sun', predictions: 23, alerts: 4 }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-md">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="btn btn-secondary flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalPredictions.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.accuracyRate}%</p>
              <p className="text-xs text-green-600">Model performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Intervention Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.interventionRate}%</p>
              <p className="text-xs text-yellow-600">Students helped</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prevented Dropouts</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.preventedDropouts}</p>
              <p className="text-xs text-purple-600">Success stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="predictions" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Predictions"
              />
              <Area 
                type="monotone" 
                dataKey="interventions" 
                stackId="2" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Interventions"
              />
              <Area 
                type="monotone" 
                dataKey="success" 
                stackId="3" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6}
                name="Successful"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} students`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {analyticsData.riskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.value}</span>
                  <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Risk Factors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.riskFactors} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="factor" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="predictions" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Predictions"
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Alerts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Intervention Outcomes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Intervention Outcomes</h3>
          <p className="text-gray-600 text-sm">Success rates by intervention type</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.interventionOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{outcome.type}</h4>
                  <p className="text-sm text-gray-600">
                    {outcome.successful} successful out of {outcome.total} total interventions
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{outcome.rate}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${outcome.rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Accuracy</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">87.3%</div>
            <p className="text-gray-600 text-sm">Overall prediction accuracy</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '87.3%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precision Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">84.1%</div>
            <p className="text-gray-600 text-sm">True positive rate</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '84.1%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recall Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">89.7%</div>
            <p className="text-gray-600 text-sm">Risk detection rate</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '89.7%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
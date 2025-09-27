import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Plus, Eye, AlertTriangle, Download, X } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    parent_phone: '',
    attendance_percentage: '',
    fee_status: 'pending'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockStudents = [
          {
            id: 1,
            student_id: 'ST001',
            name: 'Rahul Sharma',
            age: 16,
            gender: 'male',
            attendance_percentage: 45.2,
            fee_status: 'overdue',
            risk_level: 'Red',
            risk_score: 87.3,
            last_prediction: '2025-09-20',
            risk_factors: ['Critical attendance issues (below 50%)', 'Overdue fee payments'],
            contact_info: {
              phone: '+91 9876543210',
              email: 'rahul.sharma@school.edu',
              parent_phone: '+91 9876543211'
            }
          },
          {
            id: 2,
            student_id: 'ST002',
            name: 'Priya Patel',
            age: 17,
            gender: 'female',
            attendance_percentage: 68.5,
            fee_status: 'pending',
            risk_level: 'Yellow',
            risk_score: 56.8,
            last_prediction: '2025-09-19',
            risk_factors: ['Low attendance (below 70%)', 'Pending fee payments'],
            contact_info: {
              phone: '+91 9876543212',
              email: 'priya.patel@school.edu',
              parent_phone: '+91 9876543213'
            }
          },
          {
            id: 3,
            student_id: 'ST003',
            name: 'Amit Kumar',
            age: 16,
            gender: 'male',
            attendance_percentage: 89.2,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 23.1,
            last_prediction: '2025-09-20',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543214',
              email: 'amit.kumar@school.edu',
              parent_phone: '+91 9876543215'
            }
          },
          {
            id: 4,
            student_id: 'ST004',
            name: 'Sneha Reddy',
            age: 18,
            gender: 'female',
            attendance_percentage: 72.8,
            fee_status: 'paid',
            risk_level: 'Yellow',
            risk_score: 45.6,
            last_prediction: '2025-09-18',
            risk_factors: ['Below average academic performance'],
            contact_info: {
              phone: '+91 9876543216',
              email: 'sneha.reddy@school.edu',
              parent_phone: '+91 9876543217'
            }
          },
          {
            id: 5,
            student_id: 'ST005',
            name: 'Arjun Singh',
            age: 17,
            gender: 'male',
            attendance_percentage: 91.5,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 18.9,
            last_prediction: '2025-09-20',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543218',
              email: 'arjun.singh@school.edu',
              parent_phone: '+91 9876543219'
            }
          },
          {
            id: 6,
            student_id: 'ST006',
            name: 'Kavya Menon',
            age: 16,
            gender: 'female',
            attendance_percentage: 52.3,
            fee_status: 'overdue',
            risk_level: 'Red',
            risk_score: 82.4,
            last_prediction: '2025-09-19',
            risk_factors: ['Critical attendance issues (below 55%)', 'Overdue fee payments', 'Low academic performance'],
            contact_info: {
              phone: '+91 9876543220',
              email: 'kavya.menon@school.edu',
              parent_phone: '+91 9876543221'
            }
          },
          {
            id: 7,
            student_id: 'ST007',
            name: 'Ravi Gupta',
            age: 18,
            gender: 'male',
            attendance_percentage: 78.9,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 32.1,
            last_prediction: '2025-09-20',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543222',
              email: 'ravi.gupta@school.edu',
              parent_phone: '+91 9876543223'
            }
          },
          {
            id: 8,
            student_id: 'ST008',
            name: 'Ananya Joshi',
            age: 17,
            gender: 'female',
            attendance_percentage: 64.7,
            fee_status: 'pending',
            risk_level: 'Yellow',
            risk_score: 61.2,
            last_prediction: '2025-09-18',
            risk_factors: ['Below average attendance (below 70%)', 'Academic performance concerns'],
            contact_info: {
              phone: '+91 9876543224',
              email: 'ananya.joshi@school.edu',
              parent_phone: '+91 9876543225'
            }
          },
          {
            id: 9,
            student_id: 'ST009',
            name: 'Vikram Rao',
            age: 16,
            gender: 'male',
            attendance_percentage: 43.1,
            fee_status: 'overdue',
            risk_level: 'Red',
            risk_score: 91.5,
            last_prediction: '2025-09-20',
            risk_factors: ['Critical attendance issues (below 45%)', 'Overdue fee payments', 'Behavioral concerns'],
            contact_info: {
              phone: '+91 9876543226',
              email: 'vikram.rao@school.edu',
              parent_phone: '+91 9876543227'
            }
          },
          {
            id: 10,
            student_id: 'ST010',
            name: 'Meera Nair',
            age: 17,
            gender: 'female',
            attendance_percentage: 85.6,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 28.3,
            last_prediction: '2025-09-19',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543228',
              email: 'meera.nair@school.edu',
              parent_phone: '+91 9876543229'
            }
          },
          {
            id: 11,
            student_id: 'ST011',
            name: 'Deepak Agarwal',
            age: 18,
            gender: 'male',
            attendance_percentage: 69.2,
            fee_status: 'pending',
            risk_level: 'Yellow',
            risk_score: 54.7,
            last_prediction: '2025-09-17',
            risk_factors: ['Below average attendance (below 70%)', 'Pending fee payments'],
            contact_info: {
              phone: '+91 9876543230',
              email: 'deepak.agarwal@school.edu',
              parent_phone: '+91 9876543231'
            }
          },
          {
            id: 12,
            student_id: 'ST012',
            name: 'Ishita Sharma',
            age: 16,
            gender: 'female',
            attendance_percentage: 94.3,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 15.2,
            last_prediction: '2025-09-20',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543232',
              email: 'ishita.sharma@school.edu',
              parent_phone: '+91 9876543233'
            }
          },
          {
            id: 13,
            student_id: 'ST013',
            name: 'Karthik Reddy',
            age: 17,
            gender: 'male',
            attendance_percentage: 58.9,
            fee_status: 'overdue',
            risk_level: 'Red',
            risk_score: 76.8,
            last_prediction: '2025-09-18',
            risk_factors: ['Low attendance (below 60%)', 'Overdue fee payments'],
            contact_info: {
              phone: '+91 9876543234',
              email: 'karthik.reddy@school.edu',
              parent_phone: '+91 9876543235'
            }
          },
          {
            id: 14,
            student_id: 'ST014',
            name: 'Pooja Singh',
            age: 18,
            gender: 'female',
            attendance_percentage: 87.4,
            fee_status: 'paid',
            risk_level: 'Green',
            risk_score: 25.6,
            last_prediction: '2025-09-20',
            risk_factors: [],
            contact_info: {
              phone: '+91 9876543236',
              email: 'pooja.singh@school.edu',
              parent_phone: '+91 9876543237'
            }
          },
          {
            id: 15,
            student_id: 'ST015',
            name: 'Rohit Kumar',
            age: 16,
            gender: 'male',
            attendance_percentage: 71.8,
            fee_status: 'pending',
            risk_level: 'Yellow',
            risk_score: 48.9,
            last_prediction: '2025-09-19',
            risk_factors: ['Below average attendance (below 75%)'],
            contact_info: {
              phone: '+91 9876543238',
              email: 'rohit.kumar@school.edu',
              parent_phone: '+91 9876543239'
            }
          }
        ];
        
        setStudents(mockStudents);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRiskFilter = riskFilter === 'all' || 
                             student.risk_level.toLowerCase() === riskFilter.toLowerCase();
    
    return matchesSearch && matchesRiskFilter;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'risk_score':
        return b.risk_score - a.risk_score;
      case 'attendance':
        return a.attendance_percentage - b.attendance_percentage;
      case 'last_prediction':
        return new Date(b.last_prediction) - new Date(a.last_prediction);
      default:
        return 0;
    }
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newStudent.name || !newStudent.age || !newStudent.gender || !newStudent.phone || !newStudent.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate new student
    const studentToAdd = {
      id: students.length + 1,
      student_id: `ST${String(students.length + 1).padStart(3, '0')}`,
      name: newStudent.name,
      age: parseInt(newStudent.age),
      gender: newStudent.gender,
      attendance_percentage: parseFloat(newStudent.attendance_percentage) || 0,
      fee_status: newStudent.fee_status,
      risk_level: calculateRiskLevel(parseFloat(newStudent.attendance_percentage) || 0, newStudent.fee_status),
      risk_score: calculateRiskScore(parseFloat(newStudent.attendance_percentage) || 0, newStudent.fee_status),
      last_prediction: new Date().toISOString().split('T')[0],
      risk_factors: generateRiskFactors(parseFloat(newStudent.attendance_percentage) || 0, newStudent.fee_status),
      contact_info: {
        phone: newStudent.phone,
        email: newStudent.email,
        parent_phone: newStudent.parent_phone || 'Not provided'
      }
    };

    setStudents([...students, studentToAdd]);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      parent_phone: '',
      attendance_percentage: '',
      fee_status: 'pending'
    });
    toast.success(`Student ${newStudent.name} added successfully!`);
  };

  const calculateRiskLevel = (attendance, feeStatus) => {
    let score = calculateRiskScore(attendance, feeStatus);
    if (score >= 70) return 'Red';
    if (score >= 40) return 'Yellow';
    return 'Green';
  };

  const calculateRiskScore = (attendance, feeStatus) => {
    let score = 0;
    
    // Attendance factor (0-60 points)
    if (attendance < 50) score += 60;
    else if (attendance < 70) score += 30;
    else if (attendance < 80) score += 15;
    
    // Fee status factor (0-30 points)
    if (feeStatus === 'overdue') score += 30;
    else if (feeStatus === 'pending') score += 15;
    
    return Math.min(score, 100);
  };

  const generateRiskFactors = (attendance, feeStatus) => {
    const factors = [];
    
    if (attendance < 50) factors.push(`Critical attendance issues (below 50%)`);
    else if (attendance < 70) factors.push(`Low attendance (below 70%)`);
    else if (attendance < 80) factors.push(`Below average attendance (below 80%)`);
    
    if (feeStatus === 'overdue') factors.push('Overdue fee payments');
    else if (feeStatus === 'pending') factors.push('Pending fee payments');
    
    return factors;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleSendAlert = (student) => {
    toast.success(`Alert sent to counselor for ${student.name}`);
  };

  const exportStudentData = () => {
    // Create CSV content
    const csvHeaders = ['Student ID', 'Name', 'Risk Level', 'Risk Score', 'Attendance %', 'Fee Status', 'Last Prediction'];
    const csvRows = sortedStudents.map(student => [
      student.student_id,
      student.name,
      student.risk_level,
      student.risk_score.toFixed(1),
      student.attendance_percentage.toFixed(1),
      student.fee_status,
      student.last_prediction
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Student data exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-md">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600">Monitor and manage student records and risk assessments</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportStudentData}
              className="btn btn-secondary flex items-center text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Risk Levels</option>
            <option value="red">High Risk</option>
            <option value="yellow">Medium Risk</option>
            <option value="green">Low Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="name">Sort by Name</option>
            <option value="risk_score">Sort by Risk Score</option>
            <option value="attendance">Sort by Attendance</option>
            <option value="last_prediction">Sort by Last Prediction</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            {sortedStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-xl font-bold text-red-600">
                {students.filter(s => s.risk_level === 'Red').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-xl font-bold text-yellow-600">
                {students.filter(s => s.risk_level === 'Yellow').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-xl font-bold text-green-600">
                {students.filter(s => s.risk_level === 'Green').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Risk Assessment</th>
                <th>Attendance</th>
                <th>Fee Status</th>
                <th>Last Prediction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                      <p className="text-xs text-gray-400">{student.age} years, {student.gender}</p>
                    </div>
                  </td>
                  
                  <td>
                    <div className="space-y-1">
                      <RiskBadge level={student.risk_level} />
                      <p className="text-sm font-medium text-gray-900">
                        {student.risk_score.toFixed(1)}% risk
                      </p>
                      {student.risk_factors.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {student.risk_factors[0]}
                          {student.risk_factors.length > 1 && ` +${student.risk_factors.length - 1} more`}
                        </p>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.attendance_percentage.toFixed(1)}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendance_percentage >= 80 ? 'bg-green-500' :
                            student.attendance_percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(student.attendance_percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.fee_status === 'paid' ? 'bg-green-100 text-green-800' :
                      student.fee_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.fee_status.charAt(0).toUpperCase() + student.fee_status.slice(1)}
                    </span>
                  </td>
                  
                  <td>
                    <p className="text-sm text-gray-900">
                      {new Date(student.last_prediction).toLocaleDateString()}
                    </p>
                  </td>
                  
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {student.risk_level !== 'Green' && (
                        <button
                          onClick={() => handleSendAlert(student)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title="Send Alert"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Student ID:</span>
                    <span className="ml-2 font-medium">{selectedStudent.student_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <span className="ml-2 font-medium">{selectedStudent.age} years</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>
                    <span className="ml-2 font-medium">{selectedStudent.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Prediction:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedStudent.last_prediction).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <RiskBadge level={selectedStudent.risk_level} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Risk Score:</span>
                    <span className="font-bold text-lg">{selectedStudent.risk_score.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium">{selectedStudent.attendance_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fee Status:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      selectedStudent.fee_status === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedStudent.fee_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent.fee_status.charAt(0).toUpperCase() + selectedStudent.fee_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {selectedStudent.risk_factors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Risk Factors</h3>
                  <ul className="space-y-2">
                    {selectedStudent.risk_factors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2">{selectedStudent.contact_info.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{selectedStudent.contact_info.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Parent Phone:</span>
                    <span className="ml-2">{selectedStudent.contact_info.parent_phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              {selectedStudent.risk_level !== 'Green' && (
                <button
                  onClick={() => {
                    handleSendAlert(selectedStudent);
                    setShowModal(false);
                  }}
                  className="btn btn-danger flex items-center"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Alert
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-8 py-16"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Add New Student</h2>
                    <p className="text-sm text-gray-500 font-medium">Enter student information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddStudent} className="overflow-y-auto p-6 space-y-4 max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="25"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({...newStudent, age: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Age"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@school.edu"
                  />
                </div>

                {/* Parent Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newStudent.parent_phone}
                    onChange={(e) => setNewStudent({...newStudent, parent_phone: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Attendance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendance Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newStudent.attendance_percentage}
                    onChange={(e) => setNewStudent({...newStudent, attendance_percentage: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="85.5"
                  />
                </div>

                {/* Fee Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Status
                  </label>
                  <select
                    value={newStudent.fee_status}
                    onChange={(e) => setNewStudent({...newStudent, fee_status: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl space-x-3">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStudent}
                className="btn btn-primary text-sm"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
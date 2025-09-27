import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Resource not found.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || 'Bad request.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
);

export const dropoutPredictionAPI = {
  // Get basic info
  getSystemInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Single prediction
  predictSingle: async (studentData) => {
    const response = await api.post('/predict', studentData);
    return response.data;
  },

  // Bulk prediction
  predictBulk: async (studentsData) => {
    const response = await api.post('/bulk-predict', { students: studentsData });
    return response.data;
  },

  // Upload CSV (now works with serverless)
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },

  // Get model information
  getModelInfo: async () => {
    const response = await api.get('/model-info');
    return response.data;
  }
};

export default api;
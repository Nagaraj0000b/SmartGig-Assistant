import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Logs API
export const logsAPI = {
  transcribe: (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return api.post('/logs/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  save: (data) => api.post('/logs/save', data),
  getHistory: (params) => api.get('/logs/history', { params }),
  getLog: (id) => api.get(`/logs/${id}`),
  deleteLog: (id) => api.delete(`/logs/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getTrends: (days = 30) => api.get(`/analytics/trends?days=${days}`),
  getInsights: () => api.get('/analytics/insights'),
};

export default api;

import axios from 'axios';

// 1. Create a custom Axios instance
const api = axios.create({
  // Point to our Express backend
  baseURL: 'http://localhost:5000/api', 
});

// 2. Add an "interceptor" to automatically attach the JWT token
// Think of this as a middleman that intercepts every outgoing request
api.interceptors.request.use((config) => {
  // Check if we have a token saved in localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    // If yes, attach it to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

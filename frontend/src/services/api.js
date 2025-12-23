import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
};

// Transaction API
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  create: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Folder API
export const folderAPI = {
  getAll: () => api.get('/folders'),
  create: (folder) => api.post('/folders', folder),
  update: (id, folder) => api.put(`/folders/${id}`, folder),
  delete: (id) => api.delete(`/folders/${id}`),
};

// Goal API
export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (goal) => api.post('/goals', goal),
  update: (id, goal) => api.put(`/goals/${id}`, goal),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Reminder API
export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  create: (reminder) => api.post('/reminders', reminder),
  update: (id, reminder) => api.put(`/reminders/${id}`, reminder),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Note API
export const noteAPI = {
  getAll: () => api.get('/notes'),
  create: (note) => api.post('/notes', note),
  update: (id, note) => api.put(`/notes/${id}`, note),
  delete: (id) => api.delete(`/notes/${id}`),
};

export default api;

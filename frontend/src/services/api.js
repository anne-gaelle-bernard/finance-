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
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  create: async (transaction) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  update: async (id, transaction) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  exportCSV: async () => {
    const response = await api.get('/transactions/export', { responseType: 'blob' });
    return response.data;
  },
};

// Folder API
export const folderAPI = {
  getAll: async () => {
    const response = await api.get('/folders');
    return response.data;
  },
  create: async (folder) => {
    const response = await api.post('/folders', folder);
    return response.data;
  },
  update: async (id, folder) => {
    const response = await api.put(`/folders/${id}`, folder);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },
};

// Goal API
export const goalAPI = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  create: async (goal) => {
    const response = await api.post('/goals', goal);
    return response.data;
  },
  update: async (id, goal) => {
    const response = await api.put(`/goals/${id}`, goal);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

// Reminder API
export const reminderAPI = {
  getAll: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },
  create: async (reminder) => {
    const response = await api.post('/reminders', reminder);
    return response.data;
  },
  update: async (id, reminder) => {
    const response = await api.put(`/reminders/${id}`, reminder);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
};

// Note API
export const noteAPI = {
  getAll: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  create: async (note) => {
    const response = await api.post('/notes', note);
    return response.data;
  },
  update: async (id, note) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export default api;

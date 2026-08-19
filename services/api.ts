import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Update this to your computer's IP address when testing on a physical device
// For emulator, use localhost
// Your current IP: 192.168.0.130
const API_URL = 'https://gltbackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { fullName: string; email: string; password: string; role: string; branch?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Attendance APIs
export const attendanceAPI = {
  mark: (data: { branch: string; status: string; serviceType: string; userId?: string }) =>
    api.post('/attendance', data),
  checkIn: (data: { branchId: string; serviceType?: string }) =>
    api.post('/attendance/check-in', data),
  checkOut: (data: { branchId: string }) =>
    api.post('/attendance/check-out', data),
  getUserHistory: (userId: string) =>
    api.get(`/attendance/user/${userId}`),
  getBranchStats: (branchId: string) =>
    api.get(`/attendance/branch/${branchId}`),
};

// Content APIs
export const contentAPI = {
  // Testimonies
  submitTestimony: (data: { title: string; content: string; branch: string }) =>
    api.post('/content/testimony', data),
  getTestimonies: (branchId: string) =>
    api.get(`/content/testimonies/${branchId}`),

  // Events
  getEvents: () =>
    api.get('/content/events'),
  createEvent: (data: { title: string; description: string; date: string; branch?: string; type: string }) =>
    api.post('/content/events', data),

  // Accounts
  getAccounts: (branchId: string) =>
    api.get(`/content/accounts/${branchId}`),
  addAccount: (data: { bankName: string; accountNumber: string; accountName: string; branch: string; type: string }) =>
    api.post('/content/accounts', data),

  // Sermons
  getSermons: (branchId: string) =>
    api.get(`/content/sermons/${branchId}`),
};

// Branch APIs
export const branchAPI = {
  getBranches: () =>
    api.get('/branches'),
};

// Verification APIs
export const verificationAPI = {
  upload: (formData: FormData) =>
    api.post('/verification/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getPending: () =>
    api.get('/verification/pending'),
  approve: (id: string, notes?: string) =>
    api.post(`/verification/${id}/approve`, { notes }),
  reject: (id: string, notes?: string) =>
    api.post(`/verification/${id}/reject`, { notes }),
};

export default api;

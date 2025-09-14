import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { PaymentData, School } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Extend AxiosRequestConfig to include _retry
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await authAPI.post<{ data: { token: string } }>('/auth/refresh');
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem('auth_token', newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return authAPI(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Transaction API
export const transactionAPI = {
  getTransactions: (params: Record<string, any> = {}) => authAPI.get('/transaction', { params }),
  getSchoolTransactions: (schoolId: string, params: Record<string, any> = {}) =>
    authAPI.get(`/transaction/school/${schoolId}`, { params }),
  getTransactionStatus: (customOrderId: string) =>
    authAPI.get(`/transaction/status/${customOrderId}`),
  getTransactionStats: (params: Record<string, any> = {}) =>
    authAPI.get('/transaction/overview')
};

// Payment API
export const paymentAPI = {
  createPayment: (paymentData: PaymentData) => authAPI.post('/order/create-payment', paymentData)
};

// Webhook API
export const webhookAPI = {
  getWebhookLogs: (params: Record<string, any> = {}) => authAPI.get('/webhook/logs', { params })
};

export const school = {
  getAllSchools: async (): Promise<School[]> => {
    const res = await authAPI.get("/school");
    return res.data.schools; 
  },

  createSchool: async (data: { name: string; email: string }) => {
    const res = await authAPI.post("/school", data);
    return res.data;
  },
};
export default authAPI;

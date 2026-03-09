import axios from 'axios';
import { toast } from 'sonner';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/retail-chain') + '/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// --- Single API Client (no auth) ---
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: defaultHeaders,
  timeout: 10000,
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      // Backend controllers return String type -> content-type is text/plain
      // Axios won't auto-parse text/plain as JSON, so we parse it manually
      if (typeof response.data === 'string') {
        try {
          return JSON.parse(response.data);
        } catch (e) {
          return response.data;
        }
      }
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error);
    } else if (error.request) {
      throw new Error('Không kết nối được server');
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
  }
);

// Export aliases to avoid breaking existing service imports
export const axiosPublic = axiosClient;

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: defaultHeaders,
  timeout: 10000,
});

// Request interceptor for token
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for parsing and 401
axiosPrivate.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      if (typeof response.data === 'string') {
        try { return JSON.parse(response.data); } catch (e) { return response.data; }
      }
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Catch 403 Forbidden from Backend @PreAuthorize 
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này!');
      return Promise.reject(error);
    }

    if (error.response) return Promise.reject(error);
    if (error.request) throw new Error('Không kết nối được server');
    throw new Error(error.message || 'Có lỗi xảy ra');
  }
);

export default axiosClient;

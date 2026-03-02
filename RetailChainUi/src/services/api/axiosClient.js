import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/retail-chain') + '/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// --- Public API Client ---
export const axiosPublic = axios.create({
  baseURL: baseURL,
  headers: defaultHeaders,
  timeout: 10000,
});

// Response interceptor for public client 
axiosPublic.interceptors.response.use(
  (response) => {
    let data = response && response.data;
    // Spring Boot đôi khi trả về JSON dạng String (text/plain) → tự parse
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (_) { }
    }
    return data ?? response;
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

// --- Private API Client ---
export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: defaultHeaders,
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor: Attach Token
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration
axiosPrivate.interceptors.response.use(
  (response) => {
    let data = response && response.data;
    // Spring Boot đôi khi trả về JSON dạng String (text/plain) → tự parse
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (_) { }
    }
    return data ?? response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired or invalid)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("Unauthorized access - 401");

      return Promise.reject(error);
    }

    if (error.response) {
      return Promise.reject(error);
    } else if (error.request) {
      throw new Error('Không kết nối được server');
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
  }
);




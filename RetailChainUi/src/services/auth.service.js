import { axiosPublic, axiosPrivate } from './api/axiosClient';

const authService = {
  login: async (email, password) => {
    return axiosPublic.post('/v1/auth/login', { email, password });
  },

  register: async (email, password, fullName) => {
    return axiosPublic.post('/v1/auth/register', { email, password, fullName });
  },

  logout: async () => {
    return axiosPrivate.post('/v1/auth/logout');
  },

  getCurrentUser: async () => {
    return axiosPrivate.get('/user/me');
  }
};

export default authService;

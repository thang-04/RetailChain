import { axiosPrivate, axiosPublic } from './api/axiosClient';

const login = async (email, password) => {
    return await axiosPublic.post('/auth/login', { email, password });
};

const logout = async () => {
    return await axiosPrivate.post('/auth/logout');
};

const getCurrentUser = async () => {
    return await axiosPrivate.get('/user/me');
};

const changePassword = async (data) => {
    return await axiosPrivate.post('/auth/change-password', data);
};

const forgotPassword = async (email) => {
    return await axiosPublic.post(`/auth/forgot-password?email=${email}`);
};

const confirmPassword = async (data) => {
    return await axiosPublic.post('/auth/confirm-password', data);
};

const firstTimeChangePassword = async (data, token) => {
    return await axiosPublic.post('/auth/first-change-password', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const verifyOtp = async (email, otp) => {
    return await axiosPublic.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
};

const authService = {
    login,
    logout,
    getCurrentUser,
    changePassword,
    forgotPassword,
    confirmPassword,
    verifyOtp,
    firstTimeChangePassword
};

export default authService;

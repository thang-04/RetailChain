import { axiosPrivate } from './api/axiosClient';

const login = async (email, password) => {
    return await axiosPrivate.post('/auth/login', { email, password });
};

const logout = async () => {
    return await axiosPrivate.post('/auth/logout');
};

const getCurrentUser = async () => {
    return await axiosPrivate.get('/user/me');
};

const authService = {
    login,
    logout,
    getCurrentUser
};

export default authService;

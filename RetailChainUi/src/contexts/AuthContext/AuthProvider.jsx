import React, { createContext, useState, useEffect } from 'react';
import authService from '../../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined') {
                try {
                    const response = await authService.getCurrentUser();
                    if (response.code === 200) {
                        setUser(response.data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                }
            } else {
                localStorage.removeItem('token');
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const firstTimeChangePassword = async (data, tempToken) => {
        try {
            const response = await authService.firstTimeChangePassword(data, tempToken);
            if (response.code === 200) {
                const { accessToken, refreshToken, user } = response.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                setUser(user);
                return response.data;
            }
            throw new Error(response.message || 'Thay đổi mật khẩu thất bại');
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response.code === 200) {
                const data = response.data;
                if (data.requireChangePassword) {
                    return data;
                }
                
                const token = data.accessToken || data.token;
                if (token && token !== 'undefined') {
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    setUser(data.user);
                    return data;
                }
            }
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
        }
    };

    const hasRole = (role) => {
        if (!user || (!user.roles && !user.role)) return false;
        const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
        return userRoles.some(r => r && typeof r === 'string' && r.toUpperCase() === role.toUpperCase());
    };

    const isSuperAdmin = () => hasRole('SUPER_ADMIN');
    const isStoreManager = () => hasRole('STORE_MANAGER');
    const isStaff = () => hasRole('STAFF');

    const hasPermission = (permission) => {
        if (isSuperAdmin()) return true;
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            firstTimeChangePassword,
            isSuperAdmin,
            isStoreManager,
            isStaff,
            hasRole,
            hasPermission
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

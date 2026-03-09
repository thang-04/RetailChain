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

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const token = response.data?.accessToken || response.data?.token;
        if (response.code === 200 && token && token !== 'undefined') {
            localStorage.setItem('token', token);
            setUser(response.data.user);
            return response.data;
        }
        throw new Error(response.message || 'Login failed');
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const hasRole = (role) => {
        if (!user || (!user.roles && !user.role)) return false;
        const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
        return userRoles.includes(role);
    };

    const isSuperAdmin = () => hasRole('SUPER_ADMIN');
    const isStoreManager = () => hasRole('STORE_MANAGER');
    const isStaff = () => hasRole('STAFF');

    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
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

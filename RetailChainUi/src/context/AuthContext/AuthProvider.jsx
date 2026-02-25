import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../../services/auth.service';

// Helper: Lấy user từ localStorage
const getStoredUser = () => {
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    // Khởi tạo user từ localStorage (giữ trạng thái đăng nhập khi refresh trang)
    const [user, setUser] = useState(getStoredUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const storedUser = getStoredUser();

            if (token && storedUser) {
                // Đã có token + user trong localStorage -> set state ngay
                setUser(storedUser);
            } else if (token && !storedUser) {
                // Có token nhưng mất user -> xóa token
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setUser(null);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Lưu user vào localStorage mỗi khi user thay đổi
    const updateUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
        setUser(userData);
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            console.log("Login API Response:", JSON.stringify(response));

            // After interceptor, response is the parsed JSON: { code, desc, data }
            // response.data = { accessToken, refreshToken, user, expiresIn }
            if (response && response.code === 200 && response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                updateUser(response.data.user);
                return response.data;
            }
            // If code is not 200, throw with desc
            throw new Error(response?.desc || 'Login failed');
        } catch (error) {
            console.error("Login API Error Caught:", error);
            throw error;
        }
    };

    const register = async (email, password, fullName) => {
        try {
            const response = await authService.register(email, password, fullName);
            console.log("Register API Response:", JSON.stringify(response));

            if (response && response.code === 200 && response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                updateUser(response.data.user);
                return response.data;
            }
            throw new Error(response?.desc || 'Registration failed');
        } catch (error) {
            console.error("Register API Error Caught:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout API failed, continuing to clear local state", e);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, setUser: updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

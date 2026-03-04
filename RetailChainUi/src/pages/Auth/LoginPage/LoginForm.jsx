import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy URL mà người dùng muốn truy cập trước khi bị chặn
    const from = location.state?.from?.pathname || '/';

    // Validate từng field trước khi submit
    const validateForm = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!password) {
            errors.password = 'Mật khẩu không được để trống';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate trước khi gọi API
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true }); // Redirect về trang ban đầu
        } catch (err) {
            console.error("Login component error:", err);
            const errorMessage = err.response?.data?.desc || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">Welcome back to RetailChain</p>

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                        className={`w-full ${fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {fieldErrors.email && (
                        <p className="text-xs text-red-500">{fieldErrors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                        className={`w-full ${fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {fieldErrors.password && (
                        <p className="text-xs text-red-500">{fieldErrors.password}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;

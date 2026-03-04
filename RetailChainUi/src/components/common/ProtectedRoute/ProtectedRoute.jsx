import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

/**
 * ProtectedRoute - Chặn truy cập các trang khi chưa đăng nhập
 * Nếu chưa đăng nhập -> redirect về /login
 * Lưu lại URL hiện tại để sau khi login xong sẽ redirect về đúng trang
 */
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Lưu URL hiện tại để redirect sau khi đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;

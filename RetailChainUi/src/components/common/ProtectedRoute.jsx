import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoleAccess = allowedRoles.some(role => hasRole(role));
        if (!hasRoleAccess) {
            return <Navigate to="/" replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;

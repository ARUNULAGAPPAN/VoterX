import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User is logged in but does not have the required role
        return <Navigate to="/error" state={{ message: "Unauthorized Access. You do not have permission to view this page." }} replace />;
    }

    return <Outlet />; // Render child routes/components
};

export default ProtectedRoute;
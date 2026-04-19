import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return;

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;
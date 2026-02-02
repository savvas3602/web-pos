import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/useAuth';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }
    return <>{children}</>;
}

export default PublicRoute;


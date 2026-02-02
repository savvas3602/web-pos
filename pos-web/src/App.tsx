import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import {Box, CssBaseline, CircularProgress} from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import SaleForm from './components/SaleForm';
import { AuthProvider } from "./app/AuthContext";
import Navbar from "./components/Navbar.tsx";
import PurchaseHistory from './components/PurchaseHistory';
import { useAuth } from './app/useAuth';
import PublicRoute from './components/PublicRoute';
import Brands from './components/Brands';

function AuthRedirect() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
    } else {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <CssBaseline />
                <Routes>
                    <Route path="/" element={<AuthRedirect />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/dashboard" element={
                            <Box sx={{ backgroundColor: '#d7d7da', minHeight: '100vh' }}>
                            <PrivateRoute>
                                <Navbar />
                                <Box sx={{ pr: 1.5, pl: 1.5, pb: 2  }}>
                                    <SaleForm />
                                </Box>
                            </PrivateRoute>
                        </Box>
                    } />
                    <Route path="/purchase-history" element={
                        <Box sx={{ p: .8, backgroundColor: '#d7d7da', minHeight: '100vh' }}>
                            <PrivateRoute>
                                <Navbar />
                                <PurchaseHistory />
                            </PrivateRoute>
                        </Box>
                    } />
                    <Route path="/brands" element={
                        <Box sx={{ p: .8, backgroundColor: '#d7d7da', minHeight: '100vh' }}>
                            <PrivateRoute>
                                <Navbar />
                                <Box sx={{ pr: 1.5, pl: 1.5, pb: 2  }}>
                                    <Brands />
                                </Box>
                            </PrivateRoute>
                        </Box>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App

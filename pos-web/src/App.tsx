import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import {Box, CssBaseline, CircularProgress, ThemeProvider, createTheme} from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import SaleForm from './components/SaleForm';
import { AuthProvider } from "./app/AuthContext";
import Navbar from "./components/Navbar.tsx";
import PurchaseHistory from './components/PurchaseHistory';
import { useAuth } from './app/useAuth';
import PublicRoute from './components/PublicRoute';
import Brands from './components/Brands';
import Products from "./components/Products.tsx";
import ProductTypes from "./components/ProductTypes.tsx";
import Breadcrumbs from './components/Breadcrumbs';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
});

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
        <ThemeProvider theme={darkTheme}>
            <AuthProvider>
                <Router>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={<AuthRedirect />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/dashboard" element={
                            <Box sx={{ minHeight: '100vh' }}>
                                <PrivateRoute>
                                    <Navbar />
                                    <Box sx={{ p: 2}}>
                                        <Breadcrumbs />
                                        <SaleForm />
                                    </Box>
                                </PrivateRoute>
                            </Box>
                        } />
                        <Route path="/purchase-history" element={
                            <Box sx={{ minHeight: '100vh' }}>
                                <PrivateRoute>
                                    <Navbar />
                                    <Box sx={{ p: 2 }}>
                                        <Breadcrumbs />
                                        <PurchaseHistory />
                                    </Box>
                                </PrivateRoute>
                            </Box>
                        } />
                        <Route path="/brands" element={
                            <Box sx={{ minHeight: '100vh' }}>
                                <PrivateRoute>
                                    <Navbar />
                                    <Box sx={{ p: 2 }}>
                                        <Breadcrumbs />
                                        <Brands />
                                    </Box>
                                </PrivateRoute>
                            </Box>
                        } />
                        <Route path="/products" element={
                            <Box sx={{ minHeight: '100vh' }}>
                                <PrivateRoute>
                                    <Navbar />
                                    <Box sx={{ p: 2 }}>
                                        <Breadcrumbs />
                                        <Products />
                                    </Box>
                                </PrivateRoute>
                            </Box>
                        } />
                        <Route path="/product-types" element={
                            <Box sx={{ minHeight: '100vh' }}>
                                <PrivateRoute>
                                    <Navbar />
                                    <Box sx={{ p: 2 }}>
                                        <Breadcrumbs />
                                        <ProductTypes />
                                    </Box>
                                </PrivateRoute>
                            </Box>
                        } />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App

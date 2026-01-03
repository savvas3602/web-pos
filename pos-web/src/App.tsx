import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import { CssBaseline } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { AuthProvider } from "./app/AuthContext";
import Navbar from "./components/Navbar.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <CssBaseline />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Navbar />
                            <Dashboard />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App

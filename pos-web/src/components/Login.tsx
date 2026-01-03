import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, Grid, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/useAuth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await login(username, password);

            if (result) {
                setSuccess('Login successful!');
                navigate('/dashboard');
            }
            else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#bccac8',
            }}
        >

            <Grid container justifyContent="center">
                <Grid size={{ xs: 11, sm: 10 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >

                        <Typography variant="h4" mb={2} textAlign="center" fontWeight="bold" >
                            K2
                        </Typography>
                        <Typography variant="body1" mb={3} textAlign="center" color="textSecondary">
                            Please log in to your account
                        </Typography>
                        { error &&
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 4 }}>{error}</Alert>
                        }
                        { success &&
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 4 }}>{success}</Alert>
                        }
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={ username }
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 4
                                    },
                                }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={ password }
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 4
                                    },
                                }}
                            />
                            <Button type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={ loading }
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        borderRadius: 4,
                                    }}
                            >
                                { loading
                                    ? <CircularProgress size={24} color="inherit" />
                                    : 'Login'
                                }
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;

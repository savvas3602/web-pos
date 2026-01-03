import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
    return (
        <Box>
            <Box mt={4}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography variant="body1" textAlign="center">
                    This is a protected route. Only authenticated users can see this.
                </Typography>
            </Box>
        </Box>
    );
};

export default Dashboard;

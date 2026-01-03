import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export interface NotificationProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationProps> = ({ open, message, severity, onClose }) => (
    <Snackbar
        open={open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onClose}
    >
        <Alert
            variant="filled"
            onClose={onClose}
            severity={severity}
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
);

export default NotificationSnackbar;
import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Alert
} from '@mui/material';
import type { Brand } from '../types/Brand';
import { useBrandForm } from '../hooks/useBrandForm';

export interface BrandFormModalProps {
    open: boolean;
    onClose: () => void;
    brand?: Brand;
    onSuccess?: (brand: Brand) => void;
}

const BrandFormModal: React.FC<BrandFormModalProps> = ({ open, onClose, brand, onSuccess }) => {
    const { name, setName, description, setDescription, loading, error, isEditMode, handleSubmit, reset } =
        useBrandForm({ brand, onSuccess });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); }}>
                <DialogTitle>{isEditMode ? 'Edit Brand' : 'Add Brand'}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Brand Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Brand Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="inherit" disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BrandFormModal;

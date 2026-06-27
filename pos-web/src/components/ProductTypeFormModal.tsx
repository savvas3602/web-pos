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
import type { ProductType } from '../types/ProductType';
import { useProductTypeForm } from '../hooks/useProductTypeForm';

export interface ProductTypeFormModalProps {
    open: boolean;
    onClose: () => void;
    productType?: ProductType;
    onSuccess?: (productType: ProductType) => void;
}

const ProductTypeFormModal: React.FC<ProductTypeFormModalProps> = ({ open, onClose, productType, onSuccess }) => {
    const { name, setName, loading, error, isEditMode, handleSubmit, reset } =
        useProductTypeForm({ productType, onSuccess });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); }}>
                <DialogTitle>{isEditMode ? 'Edit Product Type' : 'Add Product Type'}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Product Type Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                            autoFocus
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

export default ProductTypeFormModal;

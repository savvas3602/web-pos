import React from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField
} from '@mui/material';
import type { Product } from '../types/Product';
import type { ProductType } from '../types/ProductType';
import type { Brand } from '../types/Brand';
import { useProductForm } from '../hooks/useProductForm';

export interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    product?: Product;
    productTypes: ProductType[];
    brands: Brand[];
    onSuccess?: (product: Product) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
    open, onClose, product, productTypes, brands, onSuccess
}) => {
    const { form, setFormValue, loading, error, isEditMode, handleSubmit, reset } =
        useProductForm({ product, onSuccess });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); }}>
                <DialogTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <TextField
                                label="Product Name"
                                value={form.name}
                                onChange={(e) => setFormValue('name', e.target.value)}
                                required
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                select
                                label="Product Type"
                                value={form.productTypeId}
                                onChange={(e) => setFormValue('productTypeId', Number(e.target.value))}
                                required
                                fullWidth
                            >
                                {productTypes.map((pt) => (
                                    <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
                            <TextField
                                select
                                label="Brand"
                                value={form.brandId}
                                onChange={(e) => setFormValue('brandId', e.target.value === '' ? '' : Number(e.target.value))}
                                fullWidth
                                sx={{ flex: 1 }}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {brands.map((b) => (
                                    <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Product Description"
                                value={form.description}
                                onChange={(e) => setFormValue('description', e.target.value)}
                                multiline
                                minRows={3}
                                maxRows={6}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <TextField
                                label="Retail Price"
                                value={form.retailPrice}
                                onChange={(e) => setFormValue('retailPrice', e.target.value)}
                                type="number"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Wholesale Price"
                                value={form.wholesalePrice}
                                onChange={(e) => setFormValue('wholesalePrice', e.target.value)}
                                type="number"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Stock Quantity"
                                value={form.stockQuantity}
                                onChange={(e) => setFormValue('stockQuantity', e.target.value)}
                                type="number"
                                required
                                fullWidth
                            />
                        </Stack>
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

export default ProductFormModal;

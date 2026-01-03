import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Paper,
    MenuItem
} from '@mui/material';
import {
    DataGrid,
    type GridColDef,
    GridActionsCellItem,
    type GridRowParams
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NotificationSnackbar from './NotificationSnackbar';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';
import type { ProductType } from '../types/ProductType';
import { productTypeService } from '../services/productTypeService';

type ProductFormState = {
    name: string;
    description: string;
    retailPrice: string;
    wholesalePrice: string;
    stockQuantity: string;
    productTypeId: number | '';
};

const initialFormState: ProductFormState = {
    name: '',
    description: '',
    retailPrice: '',
    wholesalePrice: '',
    stockQuantity: '',
    productTypeId: ''
};

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [form, setForm] = useState<ProductFormState>(initialFormState);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        void loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const productTypeData = await productTypeService.getAll();
            setProductTypes(productTypeData);
            await fetchProducts(productTypeData);
        } catch (err: any) {
            setNotification({
                open: true,
                message: 'Failed to load products. ' + err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (types: ProductType[] = productTypes) => {
        const data = await productService.getAll();

        const mappedProducts: Product[] = data.map((item) => {
            const productType = types.find((type) => type.id === item.productTypeId);
            return {
                ...item,
                productType,
                productTypeId: item.productTypeId ?? productType?.id
            };
        });

        setProducts(mappedProducts);
    };

    const setFormValue = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setForm(initialFormState);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            const originalProduct = products.find((product) => product.id === editingId);
            const originalProductTypeId = originalProduct?.productType?.id ?? originalProduct?.productTypeId ?? '';

            if (
                originalProduct &&
                originalProduct.name === form.name &&
                (originalProduct.description ?? '') === form.description &&
                originalProduct.retailPrice === Number(form.retailPrice) &&
                originalProduct.wholesalePrice === Number(form.wholesalePrice) &&
                originalProduct.stockQuantity === Number(form.stockQuantity) &&
                originalProductTypeId === form.productTypeId
            ) {
                setNotification({ open: true, message: 'No changes to save.', severity: 'info' });
                return;
            }
        }

        if (!form.productTypeId) {
            setNotification({ open: true, message: 'Please select a valid product type.', severity: 'error' });
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name: form.name,
                description: form.description,
                retailPrice: Number(form.retailPrice),
                wholesalePrice: Number(form.wholesalePrice),
                stockQuantity: Number(form.stockQuantity),
                productTypeId: form.productTypeId
            };

            if (editingId) {
                await productService.update(editingId, productData);
                setNotification({ open: true, message: 'Updated successfully', severity: 'success' });
            } else {
                await productService.create(productData);
                setNotification({ open: true, message: 'Submitted successfully', severity: 'success' });
            }

            resetForm();
            await fetchProducts();
        } catch (err: any) {
            setNotification({ open: true, message: 'Submission failed. ' + err.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setForm({
            name: product.name,
            description: product.description ?? '',
            retailPrice: String(product.retailPrice),
            wholesalePrice: String(product.wholesalePrice),
            stockQuantity: String(product.stockQuantity),
            productTypeId: product.productType?.id ?? product.productTypeId ?? ''
        });
        setEditingId(product.id);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        setLoading(true);
        try {
            await productService.delete(productToDelete.id);
            setNotification({
                open: true,
                message: productToDelete.name + ' deleted successfully.',
                severity: 'success'
            });
            await fetchProducts();
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to delete. ' + err.message, severity: 'error' });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            if (productToDelete.id === editingId) {
                resetForm();
            }
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const columns: GridColDef<Product>[] = useMemo(() => [
        { field: 'id', headerName: 'ID', minWidth: 60, flex: 0.3 },
        { field: 'name', headerName: 'Name', minWidth: 120, flex: 1 },
        { field: 'description', headerName: 'Description', minWidth: 120, flex: 1 },
        { field: 'retailPrice', headerName: 'Retail Price', type: 'number', minWidth: 120, flex: 0.5 },
        { field: 'wholesalePrice', headerName: 'Wholesale Price', type: 'number', minWidth: 120, flex: 0.5 },
        { field: 'stockQuantity', headerName: 'Stock', type: 'number', minWidth: 100, flex: 0.4 },
        {
            field: 'productType',
            headerName: 'Product Type',
            minWidth: 120,
            flex: 1,
            valueGetter: (_, row) => row.productType?.name ?? 'N/A'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 100,
            flex: 0.5,
            getActions: (params: GridRowParams<Product>) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon sx={{ color: 'red' }} />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.row)}
                />
            ]
        }
    ], [editingId]);

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            <NotificationSnackbar
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={() => setNotification({ ...notification, open: false })}
            />
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Manage Products
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <TextField
                                    label="Product Name"
                                    value={form.name}
                                    onChange={(e) => setFormValue('name', e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Product Description"
                                    value={form.description}
                                    onChange={(e) => setFormValue('description', e.target.value)}
                                    fullWidth
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

                            <TextField
                                select
                                label="Product Type"
                                value={form.productTypeId}
                                onChange={(e) => setFormValue('productTypeId', Number(e.target.value))}
                                required
                                sx={{ width: { xs: '100%', sm: '50%' } }}
                            >
                                {productTypes.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 }}}
                                >
                                    {editingId ? 'Update' : 'Add'}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="inherit"
                                        onClick={resetForm}
                                        sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 }}}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </form>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        autoHeight
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } }
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        loading={loading}
                        sx={{
                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    />
                </Box>
            </Paper>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the product "{productToDelete?.name}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Products;

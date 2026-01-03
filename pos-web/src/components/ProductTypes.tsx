import React, { useEffect, useState } from 'react';
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
    Paper
} from '@mui/material';
import {
    DataGrid,
    type GridColDef,
    GridActionsCellItem,
    GridToolbar
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NotificationSnackbar from './NotificationSnackbar';
import type { ProductType } from '../types/ProductType';
import { productTypeService } from '../services/productTypeService';

const ProductTypes: React.FC = () => {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [productTypeName, setProductTypeName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => {
            await fetchProductTypes();
        })();
    }, []);

    const fetchProductTypes = async () => {
        setLoading(true);
        try {
            const data = await productTypeService.getAll();
            setProductTypes(data);
        } catch (err: any) {
            setNotification({ open: true, message: "Failed to fetch product types. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            const originalProductType = productTypes.find(pt => pt.id === editingId);
            if (originalProductType && originalProductType.name === productTypeName) {
                setNotification({ open: true, message: "No changes to save.", severity: "info" });
                return;
            }
        }

        setLoading(true);
        try {
            if (editingId) {
                await productTypeService.update(editingId, { name: productTypeName });
                setNotification({ open: true, message: "Updated successfully", severity: "success" });
            } else {
                await productTypeService.create({ name: productTypeName });
                setNotification({ open: true, message: "Submitted successfully", severity: "success" });
            }

            setProductTypeName("");
            setEditingId(null);
            await fetchProductTypes();
        } catch (err: any) {
            setNotification({ open: true, message: "Submission failed. " + err.message, severity: "error" });
            console.error(err);
            setLoading(false);
        }
    };

    const handleEdit = (productType: ProductType) => {
        setProductTypeName(productType.name);
        setEditingId(productType.id);
    };

    const handleCancelEdit = () => {
        setProductTypeName("");
        setEditingId(null);
    };

    const handleDeleteClick = (productType: ProductType) => {
        setProductTypeToDelete(productType);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productTypeToDelete) return;

        setLoading(true);
        try {
            await productTypeService.delete(productTypeToDelete.id);
            setNotification({
                open: true, message: productTypeToDelete.name + " deleted successfully.", severity: "success"
            });
            await fetchProductTypes();
        } catch (err: any) {
            setNotification({ open: true, message: "Failed to delete. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);

            if (productTypeToDelete.id === editingId) {
                setEditingId(null);
                setProductTypeName('');
            }
            setProductTypeToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductTypeToDelete(null);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', minWidth: 60, flex: 0.3 },
        { field: 'name', headerName: 'Name', minWidth: 120, flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 100,
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit"
                                     onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem key="delete" icon={<DeleteIcon sx={{ color: 'red' }} />} label="Delete"
                                     onClick={() => handleDeleteClick(params.row)}
                />
            ]
        }
    ];

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
                    Manage Product Types
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <TextField
                                label="Product Type Name"
                                value={productTypeName}
                                onChange={e => setProductTypeName(e.target.value)}
                                required
                                fullWidth
                            />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                                >
                                    {editingId ? "Update" : "Add"}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleCancelEdit}
                                        sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Stack>
                    </form>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={productTypes}
                        columns={columns}
                        autoHeight
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } }
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        loading={loading}
                        slots={{ toolbar: GridToolbar }}
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
                    Are you sure you want to delete the product type "{productTypeToDelete?.name}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductTypes;

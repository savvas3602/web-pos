import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper
} from '@mui/material';
import {
    DataGrid,
    type GridColDef,
    GridActionsCellItem
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NotificationSnackbar from './NotificationSnackbar';
import CustomToolbar from './CustomToolBar';
import ProductTypeFormModal from './ProductTypeFormModal';
import type { ProductType } from '../types/ProductType';
import { productTypeService } from '../services/productTypeService';

const ProductTypes: React.FC = () => {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [productTypeToEdit, setProductTypeToEdit] = useState<ProductType | undefined>(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => { await fetchProductTypes(); })();
    }, []);

    const fetchProductTypes = async () => {
        setLoading(true);
        try {
            const data = await productTypeService.getAll();
            setProductTypes(data);
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to fetch product types. ' + err.message, severity: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setProductTypeToEdit(undefined);
        setModalOpen(true);
    };

    const handleOpenEdit = (productType: ProductType) => {
        setProductTypeToEdit(productType);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setProductTypeToEdit(undefined);
    };

    const handleModalSuccess = async (productType: ProductType) => {
        const message = productTypeToEdit
            ? `${productType.name} updated successfully.`
            : `${productType.name} added successfully.`;
        setModalOpen(false);
        setProductTypeToEdit(undefined);
        setNotification({ open: true, message, severity: 'success' });
        await fetchProductTypes();
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
            setNotification({ open: true, message: productTypeToDelete.name + ' deleted successfully.', severity: 'success' });
            await fetchProductTypes();
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to delete. ' + err.message, severity: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
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
                                     onClick={() => handleOpenEdit(params.row)}
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

            <ProductTypeFormModal
                open={modalOpen}
                onClose={handleModalClose}
                productType={productTypeToEdit}
                onSuccess={handleModalSuccess}
            />

            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Product Types
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                        Add Product Type
                    </Button>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={productTypes}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                            columns: { columnVisibilityModel: { id: false } }
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        loading={loading}
                        showToolbar
                        slots={{ toolbar: CustomToolbar }}
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

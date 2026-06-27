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
    type GridRowParams,
    GridActionsCellItem
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NotificationSnackbar from './NotificationSnackbar';
import CustomToolbar from './CustomToolBar';
import BrandFormModal from './BrandFormModal';
import type { Brand } from '../types/Brand';
import { brandService } from '../services/brandService';

const Brands: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState<Brand | undefined>(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => { await fetchBrands(); })();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await brandService.getAll();
            setBrands(data);
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to fetch brands. ' + err.message, severity: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setBrandToEdit(undefined);
        setModalOpen(true);
    };

    const handleOpenEdit = (brand: Brand) => {
        setBrandToEdit(brand);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setBrandToEdit(undefined);
    };

    const handleModalSuccess = async (brand: Brand) => {
        const message = brandToEdit ? `${brand.name} updated successfully.` : `${brand.name} added successfully.`;
        setModalOpen(false);
        setBrandToEdit(undefined);
        setNotification({ open: true, message, severity: 'success' });
        await fetchBrands();
    };

    const handleDeleteClick = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!brandToDelete) return;

        setLoading(true);
        try {
            await brandService.delete(brandToDelete.id);
            setNotification({ open: true, message: brandToDelete.name + ' deleted successfully.', severity: 'success' });
            await fetchBrands();
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to delete. ' + err.message, severity: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setBrandToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', minWidth: 60, flex: 0.3 },
        { field: 'name', headerName: 'Name', minWidth: 120, flex: 1 },
        { field: 'description', headerName: 'Description', minWidth: 120, flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 100,
            flex: 0.5,
            getActions: (params: GridRowParams<Brand>) => [
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

            <BrandFormModal
                open={modalOpen}
                onClose={handleModalClose}
                brand={brandToEdit}
                onSuccess={handleModalSuccess}
            />

            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Brands
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                        Add Brand
                    </Button>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={brands}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
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
                    Are you sure you want to delete the brand "{brandToDelete?.name}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Brands;

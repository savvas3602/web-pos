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
    type GridRowParams,
    GridActionsCellItem,
    GridToolbar
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NotificationSnackbar from './NotificationSnackbar';
import type { Brand } from '../types/Brand';
import { brandService } from '../services/brandService';

const Brands: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandName, setBrandName] = useState('');
    const [brandDescription, setBrandDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => {
            await fetchBrands();
        })();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await brandService.getAll();
            setBrands(data);
        } catch (err: any) {
            setNotification({ open: true, message: "Failed to fetch brands. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            const originalBrand = brands.find(b => b.id === editingId);
            if (originalBrand) {
                const originalDescription = originalBrand.description || '';
                if (originalBrand.name === brandName && originalDescription === brandDescription) {
                    setNotification({ open: true, message: "No changes to save.", severity: "info" });
                    return;
                }
            }
        }

        setLoading(true);
        try {
            if (editingId !== null) {
                await brandService.update(editingId, { name: brandName, description: brandDescription });
                setNotification({ open: true, message: "Updated successfully", severity: "success" });
            } else {
                await brandService.create({ name: brandName, description: brandDescription });
                setNotification({ open: true, message: "Submitted successfully", severity: "success" });
            }

            setBrandName("");
            setBrandDescription("");
            setEditingId(null);
            await fetchBrands();
        } catch (err: any) {
            setNotification({ open: true, message: "Submission failed. " + err.message, severity: "error" });
            console.error(err);
            setLoading(false);
        }
    };

    const handleEdit = (brand: Brand) => {
        setBrandName(brand.name);
        setBrandDescription(brand.description || '');
        setEditingId(brand.id);
    };

    const handleCancelEdit = () => {
        setBrandName("");
        setBrandDescription("");
        setEditingId(null);
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
            setNotification({
                open: true, message: brandToDelete.name + " deleted successfully.", severity: "success"
            });
            await fetchBrands();
        } catch (err: any) {
            setNotification({ open: true, message: "Failed to delete. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);

            // Only clear the form if we deleted the item being edited
            if (brandToDelete.id === editingId) {
                setEditingId(null);
                setBrandName('');
                setBrandDescription('');
            }
            setBrandToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
    };

    // DataGrid columns definition
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
                    Manage Brands
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                            <TextField
                                label="Brand Name"
                                value={brandName}
                                onChange={e => setBrandName(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Brand Description"
                                value={brandDescription}
                                onChange={e => setBrandDescription(e.target.value)}
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                            >
                                {editingId !== null ? "Update" : "Add"}
                            </Button>
                            {editingId !== null && (
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
                        rows={brands}
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

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
import NotificationSnackbar from '../NotificationSnackbar';
import CustomToolbar from '../CustomToolBar';
import BrandFormDialog from './BrandFormDialog';
import { useBrandManager } from '../../hooks/useBrandManager';
import type { Brand } from '../../types/Brand';

/**
 * Container for the Brands configuration page
 * @constructor
 */
const Brands: React.FC = () => {
    // Hook for brand CRUD operations
    const { brands, loading, fetchBrands, createBrand, updateBrand, deleteBrand } = useBrandManager();

    // UI-specific state (form and dialog management)
    const [brandName, setBrandName] = useState('');
    const [brandDescription, setBrandDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => {
            try {
                await fetchBrands();
            } catch (err: any) {
                setNotification({ open: true, message: "Failed to fetch brands. " + err.message, severity: "error" });
                console.error(err);
            }
        })();
    }, []);

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

        try {
            if (editingId !== null) {
                await updateBrand(editingId, { name: brandName, description: brandDescription });
                setNotification({ open: true, message: "Updated successfully", severity: "success" });
            } else {
                await createBrand({ name: brandName, description: brandDescription });
                setNotification({ open: true, message: "Submitted successfully", severity: "success" });
            }

            setBrandName("");
            setBrandDescription("");
            setEditingId(null);
        } catch (err: any) {
            setNotification({ open: true, message: "Submission failed. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setFormDialogOpen(false);
        }
    };

    const handleEdit = (brand: Brand) => {
        setBrandName(brand.name);
        setBrandDescription(brand.description || '');
        setEditingId(brand.id);
        setFormDialogOpen(true);
        setNotification({ open: true, message: 'Entered update mode', severity: 'info' });
    };

    const handleOpenCreate = () => {
        setBrandName('');
        setBrandDescription('');
        setEditingId(null);
        setFormDialogOpen(true);
    };

    const BrandsToolbar: React.FC = () => <CustomToolbar onAddClick={handleOpenCreate} />;

    const handleCloseFormDialog = () => {
        if (editingId !== null) {
            setNotification({ open: true, message: 'Exited update mode - no changes were saved', severity: 'info' });
        }
        setBrandName("");
        setBrandDescription("");
        setEditingId(null);
        setFormDialogOpen(false);
    };

    const handleDeleteClick = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!brandToDelete) return;

        try {
            await deleteBrand(brandToDelete.id);
            setNotification({
                open: true, message: brandToDelete.name + " deleted successfully.", severity: "success"
            });

            // Only clear the form if we deleted the item being edited
            if (brandToDelete.id === editingId) {
                setEditingId(null);
                setBrandName('');
                setBrandDescription('');
                setFormDialogOpen(false);
            }
        } catch (err: any) {
            setNotification({ open: true, message: "Failed to delete. " + err.message, severity: "error" });
            console.error(err);
        } finally {
            setDeleteDialogOpen(false);
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
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Brands
                    </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={brands}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            columns: {
                                columnVisibilityModel: {
                                    id: false
                                }
                            }
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        loading={loading}
                        showToolbar
                        slots={{ toolbar: BrandsToolbar }}
                        sx={{
                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    />
                </Box>
            </Paper>

            <BrandFormDialog
                open={formDialogOpen}
                name={brandName}
                description={brandDescription}
                isEditing={editingId !== null}
                loading={loading}
                onClose={handleCloseFormDialog}
                onNameChange={setBrandName}
                onDescriptionChange={setBrandDescription}
                onSubmit={handleSubmit}
            />

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

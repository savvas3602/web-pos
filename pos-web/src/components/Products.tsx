import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Tooltip
} from '@mui/material';
import {
    DataGrid,
    type GridColDef,
    GridActionsCellItem,
    type GridRowParams
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NotificationSnackbar from './NotificationSnackbar';
import CustomToolbar from './CustomToolBar';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';
import type { ProductType } from '../types/ProductType';
import { productTypeService } from '../services/productTypeService';
import type { Brand } from '../types/Brand';
import { brandService } from '../services/brandService';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        void loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [productTypeData, brandData] = await Promise.all([
                productTypeService.getAll(),
                brandService.getAll()
            ]);
            setProductTypes(productTypeData);
            setBrands(brandData);
            await fetchProducts(productTypeData, brandData);
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to load products. ' + err.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (types: ProductType[] = productTypes, brandList: Brand[] = brands) => {
        const data = await productService.getAll();
        const mapped: Product[] = data.map((item) => {
            const productType = types.find((t) => t.id === item.productTypeId);
            const brand = brandList.find((b) => b.id === item.brandId);
            return {
                ...item,
                productType,
                productTypeId: item.productTypeId ?? productType?.id,
                brand,
                brandId: item.brandId ?? brand?.id
            };
        });
        setProducts(mapped);
    };

    const handleOpenAdd = () => {
        setProductToEdit(undefined);
        setModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setProductToEdit(product);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setProductToEdit(undefined);
    };

    const handleModalSuccess = async (product: Product) => {
        const message = productToEdit
            ? `${product.name} updated successfully.`
            : `${product.name} added successfully.`;
        setModalOpen(false);
        setProductToEdit(undefined);
        setNotification({ open: true, message, severity: 'success' });
        await fetchProducts();
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
            setNotification({ open: true, message: productToDelete.name + ' deleted successfully.', severity: 'success' });
            await fetchProducts();
        } catch (err: any) {
            setNotification({ open: true, message: 'Failed to delete. ' + err.message, severity: 'error' });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
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
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => (
                <Tooltip
                    title={params.value}
                    arrow
                    placement="top"
                    enterTouchDelay={50}
                    leaveTouchDelay={3000}
                    slotProps={{ tooltip: { sx: { maxWidth: 420, fontSize: '0.875rem', lineHeight: 1.6, p: 1.5 } } }}
                >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {params.value}
                    </span>
                </Tooltip>
            )
        },
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
            field: 'brand',
            headerName: 'Brand',
            minWidth: 120,
            flex: 1,
            valueGetter: (_, row) => row.brand?.name ?? 'N/A'
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
                    onClick={() => handleOpenEdit(params.row)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon sx={{ color: 'red' }} />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.row)}
                />
            ]
        }
    ], []);

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            <NotificationSnackbar
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={() => setNotification({ ...notification, open: false })}
            />

            <ProductFormModal
                open={modalOpen}
                onClose={handleModalClose}
                product={productToEdit}
                productTypes={productTypes}
                brands={brands}
                onSuccess={handleModalSuccess}
            />

            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Products
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                        Add Product
                    </Button>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={products}
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

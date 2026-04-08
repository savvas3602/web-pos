import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Stack,
    Tooltip
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, type GridColDef, type GridActionsColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

import { orderDataService } from '../services/orderDataService';
import { productTypeService } from '../services/productTypeService';
import { paymentMethodService } from '../services/paymentMethodService';

import type { Product } from '../types/Product';
import type { PaymentMethod } from '../types/PaymentMethod';

import NotificationSnackbar from './NotificationSnackbar';
import ConfirmDialog from './SaleForm/ConfirmDialog';
import { useCart } from '../hooks/useCart';

const SaleForm: React.FC = () => {
    const [productTypes, setProductTypes] = useState<{ id: number; name: string }[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const { orderItems, total, addItem, removeItem, resetCart } = useCart();

    useEffect(() => {
        void loadInitialData();
    }, []);

    useEffect(() => {
        void fetchProducts();
    }, [productTypes]);

    const loadInitialData = async () => {
        try {
            const [productTypesData, paymentMethodsData] = await Promise.all([
                productTypeService.getAll(),
                paymentMethodService.getAll()
            ]);
            setProductTypes(productTypesData);
            setPaymentMethods(paymentMethodsData);
        } catch (err: any) {
            setNotification({
                open: true,
                message: 'Failed to load initial data. ' + err.message,
                severity: 'error'
            });
        }
    };

    const fetchProducts = async () => {
        if (productTypes.length === 0) return;

        try {
            const res = await orderDataService.getProducts();
            const productsWithTypes: Product[] = res.map(product => {
                const productType = productTypes.find(
                    pt => pt.id === product.productTypeId
                );
                return {
                    ...product,
                    productType: productType ? { id: productType.id, name: productType.name } : undefined
                };
            });
            setProducts(productsWithTypes);
        } catch (err: any) {
            setNotification({
                open: true,
                message: 'Failed to load products. ' + err.message,
                severity: 'error'
            });
        }
    };

    const handleAdd = () => {
        if (!selectedProduct || quantity < 1) return;
        addItem(selectedProduct, quantity);
        setSelectedProduct(null);
        setQuantity(1);
    };

    const handleReset = () => {
        resetCart();
        setSelectedProduct(null);
        setQuantity(1);
    };

    const columns: (GridColDef | GridActionsColDef)[] = [
        { field: 'name', headerName: 'Product Name', flex: 1 },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            renderCell: (params) => (
                <Tooltip
                    title={params.value}
                    arrow
                    placement="top"
                    enterTouchDelay={50}
                    leaveTouchDelay={3000}
                    slotProps={{
                        tooltip: {
                            sx: {
                                maxWidth: 420,
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                p: 1.5,
                            }
                        }
                    }}
                >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {params.value}
                    </span>
                </Tooltip>
            )
        },
        { field: 'quantity', headerName: 'Quantity', width: 120 },
        { field: 'price', headerName: 'Unit Price', width: 120 },
        {
            field: 'totalItemPrice',
            headerName: 'Total Price',
            width: 120,
            valueFormatter: (param: { value: number }) => `€${Number(param).toFixed(2)}`
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 60,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<DeleteIcon sx={{ color: 'error.main' }} />}
                    label="Remove"
                    onClick={() => removeItem(Number(id))}
                />
            ]
        }
    ];

    const handleDialogOpen = () => {
        setConfirmDialogOpen(true);
    };

    const handleDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    const handleOrderSuccess = () => {
        setNotification({
            open: true,
            message: 'Transaction submitted successfully',
            severity: 'success'
        });
        handleReset();
    };

    const handleOrderError = (message: string) => {
        setNotification({
            open: true,
            message,
            severity: 'error'
        });
    };

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
                    New Sale
                </Typography>
                <form onSubmit={e => { e.preventDefault(); handleDialogOpen(); }}>
                    <Stack spacing={2.5}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            useFlexGap
                            sx={{ flexWrap: 'wrap' }}
                        >
                            <Autocomplete
                                sx={{ flex: '9 1', minWidth: { sm: 300 } }}
                                options={products}
                                getOptionLabel={(option) => option.name}
                                value={selectedProduct}
                                onChange={(_, value) => setSelectedProduct(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Product"
                                    />
                                )}
                            />
                            <TextField
                                sx={{ flex: '1 1', minWidth: { sm: 150 } }}
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(
                                    Math.max(1, Number(e.target.value))
                                )}
                                required
                            />
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.5}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ flex: '1 1', width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 100 } }}
                                    onClick={handleAdd}
                                    disabled={!selectedProduct || quantity < 1}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ flex: '1 1', width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 100 } }}
                                    onClick={handleReset}
                                    disabled={orderItems.length === 0 && !selectedProduct}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>

                        <Box sx={{ width: '100%' }}>
                            <DataGrid
                                rows={orderItems}
                                columns={columns}
                                autoHeight
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 5, page: 0 } }
                                }}
                                pageSizeOptions={[5]}
                                hideFooterSelectedRowCount
                                getRowId={(row) => row.id}
                                sx={{
                                    '& .MuiDataGrid-row:nth-of-type(even)': {
                                        backgroundColor: 'action.hover'
                                    }
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 1
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Total:
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                €{total.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={orderItems.length === 0}
                                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 160 } }}
                            >
                                Submit Order
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>

            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={handleDialogClose}
                total={total}
                orderItems={orderItems}
                onSuccess={handleOrderSuccess}
                onError={handleOrderError}
                paymentMethods={paymentMethods}
            />
        </Box>
    );
};

export default SaleForm;

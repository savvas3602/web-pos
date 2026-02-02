import React, {useEffect, useState} from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import axios from 'axios';
import './SaleForm.css';

interface Product {
    id: number;
    name: string;
    retailPrice: number;
    wholesalePrice: number;
    stockQuantity: number;
    description: string;
    productTypeId: number | null;
}

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    totalItemPrice: number;
}

const SaleForm: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [submitFailed, setSubmitFailed] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load products');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const sum = orderItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
        setTotal(sum);
    }, [orderItems]);

    const handleAdd = () => {
        if (!selectedProduct || quantity < 1) return;

        const existing = orderItems.find(item => item.id === selectedProduct.id);
        if (existing) {
            setOrderItems(orderItems.map(item =>
                item.id === selectedProduct.id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        totalPrice: (item.quantity + quantity) * item.price
                    }
                    : item
            ));
        } else {
            setOrderItems([
                ...orderItems,
                {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.retailPrice,
                    quantity,
                    totalItemPrice: selectedProduct.retailPrice * quantity
                }
            ]);
        }
        setSelectedProduct(null);
        setQuantity(1);
    };

    const handleReset = () => {
        setOrderItems([]);
        setSelectedProduct(null);
        setQuantity(1);
        setTotal(0);
        setError(null);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Product Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', width: 120 },
        { field: 'price', headerName: 'Unit Price', width: 120 },
        {
            field: 'totalItemPrice',
            headerName: 'Total Price',
            width: 120,
            valueFormatter: (param: { value: number }) => `€${Number(param).toFixed(2)}`
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the order data to send
        const orderData = {
            orderValue: orderItems.reduce((acc, item) => acc + item.totalItemPrice, 0),
            products: orderItems.map(({ id, quantity }) => ({
                productId: id, quantity
            })),
        };

        axios.post("http://localhost:8080/orders", orderData, { withCredentials: true })
            .then(() => {
                setSuccess(true);
                handleReset();
            })
            .catch(() => {
                setSubmitFailed(true);
            });
    };

    return (
        <Box>
            <Paper sx={{ p: 3, margin: 'auto', mt: 4}}>
                <Typography variant="h5" sx={{mb: 2, fontWeight: 600}}>
                    New Sale
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                        <Autocomplete
                            sx={{flex: 2}}
                            options={products}
                            getOptionLabel={(option) => option.name}
                            value={selectedProduct}
                            onChange={(_, value) => setSelectedProduct(value)}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Product"
                                />
                            )}
                        />
                        <TextField
                            sx={{flex: 1}}
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{height: 56}}
                            onClick={handleAdd}
                            disabled={!selectedProduct || quantity < 1}
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{height: 56}}
                            onClick={handleReset}
                            disabled={orderItems.length === 0 && !selectedProduct}
                        >
                            Reset
                        </Button>
                    </Box>
                    <Box sx={{height: 320, mb: 2}}>
                        <DataGrid
                            rows={orderItems}
                            columns={columns}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5, page: 0 } }
                            }}
                            pageSizeOptions={[5]}
                            hideFooterSelectedRowCount
                            getRowId={(row) => row.id}
                            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'striped-row' : ''}
                        />
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                            Total:
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{fontWeight: 700}}>
                            €{total.toFixed(2)}
                        </Typography>
                    </Box>
                    {error && <Typography color="error" sx={{mb: 2}}>{error}</Typography>}
                    <Snackbar open={success}
                              autoHideDuration={4000}
                              onClose={() => setSuccess(false)}
                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert variant={"filled"} onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                            Transaction submitted successfully
                        </Alert>
                    </Snackbar>
                    <Snackbar open={submitFailed}
                              autoHideDuration={4000}
                              onClose={() => setSubmitFailed(false)}
                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert variant={"filled"} onClose={() => setSubmitFailed(false)} severity="error" sx={{ width: '100%' }}>
                            Transaction failed to submit
                        </Alert>
                    </Snackbar>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            disabled={orderItems.length === 0}
                        >
                            Submit Order
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default SaleForm;

import React, {useEffect, useState} from 'react';
import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {CircularProgress, Box, Typography, Alert} from '@mui/material';
import axios from 'axios';

interface OrderProduct {
    productId: number;
    quantity: number;
    name?: string;
}

interface Order {
    id: number;
    date: string;
    total: number;
    products: OrderProduct[];
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'Order ID', width: 100},
    {field: 'date', headerName: 'Date', width: 180},
    {field: 'total', headerName: 'Total', width: 120},
    {
        field: 'products',
        headerName: 'Products',
        width: 300,
        renderCell: (params) =>
            Array.isArray(params.value)
                ? params.value.map((p: OrderProduct) => `${p.name || p.productId} (x${p.quantity})`).join(', ')
                : '',
    },
];

const PurchaseHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8080/orders')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load purchase history');
                setLoading(false);
            });
    }, []);

    if (loading) return <Box display="flex" justifyContent="center"><CircularProgress/></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!orders.length) return <Typography>No purchase history found.</Typography>;

    return (
        <Box sx={{height: 500, width: '100%'}}>
            <Typography variant="h5" gutterBottom>Purchase History</Typography>
            <DataGrid
                rows={orders}
                columns={columns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } }
                }}
                getRowId={(row) => row.id}
                autoHeight
            />
        </Box>
    );
};

export default PurchaseHistory;

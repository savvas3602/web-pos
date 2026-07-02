import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OrderResponse, OrderResponseItem } from '../types/OrderResponse';
import { orderService } from '../services/orderService';

interface Props {
    orderId: number | null;
    onClose: () => void;
}

type ItemRow = OrderResponseItem & { id: number };

const itemColumns: GridColDef<ItemRow>[] = [
    { field: 'productName', headerName: 'Product', flex: 1, minWidth: 180 },
    {
        field: 'retailPrice',
        headerName: 'Unit Price',
        width: 120,
        valueFormatter: (value) => `€${Number(value).toFixed(2)}`,
    },
    { field: 'quantity', headerName: 'Qty', width: 80 },
    {
        field: 'lineTotal',
        headerName: 'Line Total',
        width: 120,
        valueGetter: (_value, row) => row.retailPrice * row.quantity,
        valueFormatter: (value) => `€${Number(value).toFixed(2)}`,
    },
];

const OrderDetailModal: React.FC<Props> = ({ orderId, onClose }) => {
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId === null) {
            setOrder(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        orderService.getById(orderId)
            .then((data) => { if (!cancelled) setOrder(data); })
            .catch((err: Error) => { if (!cancelled) setError(err.message ?? 'Failed to load order'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [orderId]);

    const rows: ItemRow[] = (order?.items ?? []).map((item, index) => ({ ...item, id: index }));

    return (
        <Dialog open={orderId !== null} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Order #{orderId}</DialogTitle>
            <DialogContent dividers>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && !loading && (
                    <Typography color="error">{error}</Typography>
                )}
                {order && !loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                                <Typography>{new Date(order.createdAt).toLocaleString()}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                                <Typography sx={{ textTransform: 'capitalize' }}>{order.paymentMethod}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Order Total</Typography>
                                <Typography fontWeight={700}>€{Number(order.orderValue).toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Total Overridden</Typography>
                                <Typography>{order.totalOverridden ? 'Yes' : 'No'}</Typography>
                            </Box>
                            {order.comments && (
                                <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                                    <Typography variant="caption" color="text.secondary">Comments</Typography>
                                    <Typography>{order.comments}</Typography>
                                </Box>
                            )}
                        </Box>
                        <Divider />
                        <DataGrid
                            rows={rows}
                            columns={itemColumns}
                            autoHeight
                            density="compact"
                            hideFooter={rows.length <= 10}
                            disableRowSelectionOnClick
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailModal;

import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
    MenuItem,
    Tooltip
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import TodayIcon from '@mui/icons-material/Today';
import { purchaseHistoryReportService, type PurchaseHistoryReportSearch } from '../services/purchaseHistoryReportService';
import { paymentMethodService } from '../services/paymentMethodService';
import type { PurchaseHistoryReport } from '../types/PurchaseHistoryReport';
import type { PaymentMethod } from '../types/PaymentMethod';
import NotificationSnackbar from './NotificationSnackbar';

const PurchaseHistory: React.FC = () => {
    const [reports, setReports] = useState<PurchaseHistoryReport[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [notification, setNotification] = useState<{
        open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [reportData, paymentMethodData] = await Promise.all([
                    purchaseHistoryReportService.search(),
                    paymentMethodService.getAll()
                ]);
                setReports(reportData);
                setPaymentMethods(paymentMethodData);
            } catch (err: any) {
                setNotification({
                    open: true,
                    message: 'Failed to load purchase history. ' + err.message,
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        void loadInitialData();
    }, []);

    const formatPaymentMethod = (name: string) =>
        name ? name.charAt(0).toUpperCase() + name.slice(1) : name;

    const runSearch = async (params: PurchaseHistoryReportSearch, successMessage: string, severity: 'success' | 'info') => {
        setLoading(true);
        try {
            const data = await purchaseHistoryReportService.search(params);
            setReports(data);
            setNotification({
                open: true,
                message: successMessage.replace('{count}', String(data.length)),
                severity
            });
        } catch (err: any) {
            setNotification({
                open: true,
                message: 'Failed to load purchase history. ' + err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const buildDateParams = (): { startDate: string; endDate: string } | null => {
        if (!startDate && !endDate) {
            return null;
        }
        if (!startDate || !endDate) {
            setNotification({
                open: true,
                message: 'Please select both start and end dates',
                severity: 'warning'
            });
            return null;
        }

        const startDateTime = new Date(startDate + 'T00:00:00').toISOString();
        const endDateTime = new Date(endDate + 'T23:59:59').toISOString();
        return { startDate: startDateTime, endDate: endDateTime };
    };

    const fetchReportsByFilters = async () => {
        const dateParams = buildDateParams();
        if (startDate || endDate) {
            if (!dateParams) {
                return;
            }
        }

        await runSearch({
            ...dateParams,
            paymentMethod: paymentMethod || undefined
        }, 'Found {count} report(s)', 'success');
    };

    const fetchTodaysSales = async () => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const startDateISO = startOfDay.toISOString();
        const endDateISO = endOfDay.toISOString();

        const todayDateString = today.toISOString().slice(0, 10);
        setStartDate(todayDateString);
        setEndDate(todayDateString);

        await runSearch({
            startDate: startDateISO,
            endDate: endDateISO,
            paymentMethod: paymentMethod || undefined
        }, "Today's sales: {count} report(s)", 'info');
    };

    const handleClearFilters = async () => {
        setStartDate('');
        setEndDate('');
        setPaymentMethod('');
        await runSearch({}, 'Loaded {count} report(s)', 'info');
    };

    const columns: GridColDef<PurchaseHistoryReport>[] = [
        { field: 'id', headerName: 'Order ID', width: 100 },
        {
            field: 'createdAt',
            headerName: 'Date & Time',
            width: 180,
            valueFormatter: (value) => value ? new Date(String(value)).toLocaleString() : ''
        },
        {
            field: 'orderValue',
            headerName: 'Total (€)',
            width: 120,
            valueFormatter: (value) => `€${Number(value).toFixed(2)}`
        },
        {
            field: 'paymentMethod',
            headerName: 'Payment Method',
            width: 150,
            valueFormatter: (value) => formatPaymentMethod(String(value))
        },
        { field: 'totalItems', headerName: '# Items', width: 100 },
        {
            field: 'items',
            headerName: 'Products',
            flex: 1,
            minWidth: 300,
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
        {
            field: 'totalOverridden',
            headerName: 'Override',
            width: 100,
            valueFormatter: (value) => value ? 'Yes' : 'No'
        },
        {
            field: 'comments',
            headerName: 'Comments',
            flex: 1,
            minWidth: 180,
            valueFormatter: (value) => value ? String(value) : '-'
        }
    ];

    const totalRevenue = reports.reduce((sum, report) => sum + report.orderValue, 0);

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
                    Purchase History
                </Typography>

                <Stack spacing={2.5} sx={{ mb: 3 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="Payment Method"
                            select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">All Methods</MenuItem>
                            {paymentMethods.map((method) => (
                                <MenuItem key={method.id} value={method.name}>
                                    {formatPaymentMethod(method.name)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                            variant="contained"
                            onClick={fetchReportsByFilters}
                            disabled={(!startDate && !endDate && !paymentMethod) || (!!startDate !== !!endDate)}
                            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<TodayIcon />}
                            onClick={fetchTodaysSales}
                            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                        >
                            Today's Sales
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClearFilters}
                            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                        >
                            Clear
                        </Button>
                    </Stack>
                </Stack>

                <Box
                    sx={{
                        mb: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 0.5
                    }}
                >
                    <Typography variant="body1">
                        <strong>Total Orders:</strong> {reports.length}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        Total Revenue: €{totalRevenue.toFixed(2)}
                    </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={reports}
                        columns={columns}
                        autoHeight
                        loading={loading}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } }
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default PurchaseHistory;


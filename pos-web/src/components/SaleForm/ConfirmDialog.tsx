import React, { useState } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import type { OrderItem } from '../../types/OrderItem';
import type { PaymentMethod } from '../../types/PaymentMethod';
import { useOrderSubmit } from '../../hooks/useOrderSubmit';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    total: number;
    orderItems: OrderItem[];
    onSuccess: () => void;
    onError: (message: string) => void;
    paymentMethods: PaymentMethod[];
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    total,
    orderItems,
    onSuccess,
    onError,
    paymentMethods
}) => {
    const [overrideTotal, setOverrideTotal] = useState<string>('');
    const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
    const [cashReceived, setCashReceived] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const { submitOrder, loading } = useOrderSubmit();

    const overrideTotalValue = Number(overrideTotal);
    const hasValidOverride = overrideTotal !== '' && !isNaN(overrideTotalValue) && overrideTotalValue >= 0;
    const effectiveTotal = hasValidOverride ? overrideTotalValue : total;
    const selectedPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId) || null;
    const isCashPayment = selectedPaymentMethod?.name.trim().toLowerCase() === 'cash';

    const cashReceivedValue = Number(cashReceived);
    const hasValidCashReceived = cashReceived !== '' && !isNaN(cashReceivedValue) && cashReceivedValue >= 0;
    const cashDifference = hasValidCashReceived ? cashReceivedValue - effectiveTotal : null;
    const hasInsufficientCash = isCashPayment && hasValidCashReceived && (cashDifference ?? 0) < 0;
    const isConfirmDisabled = loading || (isCashPayment && (!hasValidCashReceived || hasInsufficientCash));

    const handleConfirmSubmit = async () => {
        if (!paymentMethodId) {
            onError('Please select a payment method');
            return;
        }

        if (isCashPayment) {
            if (!hasValidCashReceived) {
                onError('Please enter the cash amount received from the customer');
                return;
            }

            if ((cashDifference ?? 0) < 0) {
                onError(`Insufficient cash. Remaining balance: €${Math.abs(cashDifference ?? 0).toFixed(2)}`);
                return;
            }
        }

        const wasOverridden = hasValidOverride;

        try {
            await submitOrder({
                effectiveTotal,
                orderItems,
                wasOverridden,
                paymentMethodId,
                comments
            });
            onSuccess();
            handleClose();
        } catch (err: any) {
            onError('Failed to submit transaction. ' + err.message);
        }
    };

    const handleClose = () => {
        setOverrideTotal('');
        setPaymentMethodId(null);
        setCashReceived('');
        setComments('');
        onClose();
    };

    const handlePaymentMethodChange = (selectedId: string) => {
        const parsedId = Number(selectedId);
        setPaymentMethodId(parsedId);

        const method = paymentMethods.find(pm => pm.id === parsedId);
        if (method?.name.trim().toLowerCase() !== 'cash') {
            setCashReceived('');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Sale Submission</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to submit this sale?
                </DialogContentText>
                <Typography color="primary" sx={{ mt: 2, fontWeight: 600 }}>
                    Order Total: €{effectiveTotal.toFixed(2)}
                </Typography>
                <TextField
                    label="Override Order Total (€)"
                    type="number"
                    value={overrideTotal}
                    onChange={e => setOverrideTotal(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                    inputProps={{ min: 0, step: '0.01' }}
                    fullWidth
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method-select"
                        value={paymentMethodId?.toString() || ''}
                        label="Payment Method"
                        onChange={e => handlePaymentMethodChange(e.target.value)}
                    >
                        {paymentMethods.map(pm => (
                            <MenuItem key={pm.id} value={pm.id.toString()}>
                                {pm.name.charAt(0).toUpperCase() + pm.name.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Comments"
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    multiline
                    minRows={2}
                    sx={{ mt: 2 }}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${comments.length}/500`}
                    fullWidth
                />

                {isCashPayment && (
                    <>
                        <TextField
                            label="Cash Received (€)"
                            type="number"
                            value={cashReceived}
                            onChange={e => setCashReceived(e.target.value)}
                            sx={{ mt: 2 }}
                            inputProps={{ min: 0, step: '0.01' }}
                            fullWidth
                            error={cashReceived !== '' && (!hasValidCashReceived || hasInsufficientCash)}
                            helperText={
                                cashReceived !== '' && !hasValidCashReceived
                                    ? 'Please enter a valid non-negative amount'
                                    : hasInsufficientCash
                                        ? `Insufficient cash. Need €${Math.abs(cashDifference ?? 0).toFixed(2)} more`
                                        : ' '
                            }
                        />
                        {hasValidCashReceived && (
                            <Typography
                                color={hasInsufficientCash ? 'error.main' : 'success.main'}
                                sx={{ mt: 1, fontWeight: 600 }}
                            >
                                {hasInsufficientCash
                                    ? `Remaining balance: €${Math.abs(cashDifference ?? 0).toFixed(2)}`
                                    : `Change to return: €${(cashDifference ?? 0).toFixed(2)}`}
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleConfirmSubmit} color="primary" variant="contained" disabled={isConfirmDisabled}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;


import { useState } from 'react';
import { orderDataService } from '../services/orderDataService';
import type { OrderItem } from '../types/OrderItem';

interface SubmitOrderParams {
    effectiveTotal: number;
    orderItems: OrderItem[];
    wasOverridden: boolean;
    paymentMethodId: number;
    comments: string;
}

export const useOrderSubmit = () => {
    const [loading, setLoading] = useState(false);

    const submitOrder = async (params: SubmitOrderParams): Promise<void> => {
        setLoading(true);
        try {
            const orderData = {
                orderValue: params.effectiveTotal,
                products: params.orderItems.map(({ id, quantity }) => ({
                    productId: id,
                    quantity
                })),
                totalOverridden: params.wasOverridden,
                paymentMethodId: params.paymentMethodId,
                comments: params.comments.trim() === '' ? null : params.comments.trim()
            };

            await orderDataService.createOrder(orderData);
        } finally {
            setLoading(false);
        }
    };

    return {
        submitOrder,
        loading
    };
};


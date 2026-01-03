import api from './api';
import type { Product } from '../types/Product';

type OrderRequest = {
    orderValue: number;
    products: Array<{ productId: number; quantity: number }>;
    totalOverridden: boolean;
    paymentMethodId: number;
    comments: string | null;
};

export const orderDataService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    createOrder: async (order: OrderRequest): Promise<void> => {
        await api.post('/orders', order);
    }
};


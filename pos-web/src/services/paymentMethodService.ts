import api from './api';
import type { PaymentMethod } from '../types/PaymentMethod';

export const paymentMethodService = {
    getAll: async (): Promise<PaymentMethod[]> => {
        const response = await api.get<PaymentMethod[]>('/payment-methods');
        return response.data;
    },
    getById: async (id: number): Promise<PaymentMethod> => {
        const response = await api.get<PaymentMethod>(`/payment-methods/${id}`);
        return response.data;
    }
};

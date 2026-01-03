import api from './api';
export interface Order {
    id: number;
    orderValue: number;
    products: Array<{ productId: number; productName?: string; quantity: number }>;
    totalOverridden: boolean;
    paymentMethodId: number;
    comments: string | null;
    createdAt: string;
}
export const orderService = {
    getAll: async (): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },
    getByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders', {
            params: {
                startDate,
                endDate
            }
        });
        return response.data;
    },
    getById: async (id: number): Promise<Order> => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/orders/${id}`);
    }
};

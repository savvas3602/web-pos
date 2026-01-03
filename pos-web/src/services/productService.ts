import api from './api';
import type { Product } from '../types/Product';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    create: async (product: Omit<Product, 'id' | 'productType'> & { productTypeId: number }): Promise<Product> => {
        const response = await api.post<Product>('/products', product);
        return response.data;
    },

    update: async (id: number, product: Omit<Product, 'id' | 'productType'> & { productTypeId: number }): Promise<Product> => {
        const response = await api.put<Product>(`/products/${id}`, product);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    }
};
import api from './api';
import type { ProductType } from '../types/ProductType';

export const productTypeService = {
    getAll: async (): Promise<ProductType[]> => {
        const response = await api.get<ProductType[]>('/product-types');
        return response.data;
    },

    create: async (productType: Omit<ProductType, 'id'>): Promise<ProductType> => {
        const response = await api.post<ProductType>('/product-types', productType);
        return response.data;
    },

    update: async (id: number, productType: Omit<ProductType, 'id'>): Promise<ProductType> => {
        const response = await api.put<ProductType>(`/product-types/${id}`, productType);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/product-types/${id}`);
    }
};

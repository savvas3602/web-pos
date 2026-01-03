import api from './api';
import type { Brand } from '../types/Brand';

export const brandService = {
    getAll: async (): Promise<Brand[]> => {
        const response = await api.get<Brand[]>('/brands');
        return response.data;
    },

    create: async (brand: Omit<Brand, 'id'>): Promise<Brand> => {
        const response = await api.post<Brand>('/brands', brand);
        return response.data;
    },

    update: async (id: number, brand: Omit<Brand, 'id'>): Promise<Brand> => {
        const response = await api.put<Brand>(`/brands/${id}`, brand);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/brands/${id}`);
    }
};

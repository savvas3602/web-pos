import { useState } from 'react';
import type { Brand } from '../types/Brand';
import { brandService } from '../services/brandService';

/**
 * Custom hook to manage brand CRUD operations
 */
export interface BrandInput {
    name: string;
    description?: string;
}

export function useBrandManager() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);

    const loadBrands = async () => {
        const data = await brandService.getAll();
        setBrands(data);
    };

    const fetchBrands = async () => {
        setLoading(true);
        try {
            await loadBrands();
        } finally {
            setLoading(false);
        }
    };

    const createBrand = async (input: BrandInput) => {
        setLoading(true);
        try {
            await brandService.create(input);
            await loadBrands();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBrand = async (id: number, input: BrandInput) => {
        setLoading(true);
        try {
            await brandService.update(id, input);
            await loadBrands();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBrand = async (id: number) => {
        setLoading(true);
        try {
            await brandService.delete(id);
            await loadBrands();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        brands,
        loading,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand
    };
}


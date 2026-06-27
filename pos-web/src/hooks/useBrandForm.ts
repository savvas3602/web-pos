import { useState } from 'react';
import type { Brand } from '../types/Brand';
import { brandService } from '../services/brandService';

interface UseBrandFormOptions {
    brand?: Brand;
    onSuccess?: (brand: Brand) => void;
}

interface UseBrandFormReturn {
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    loading: boolean;
    error: string | null;
    isEditMode: boolean;
    handleSubmit: () => Promise<void>;
    reset: () => void;
}

export function useBrandForm({ brand, onSuccess }: UseBrandFormOptions = {}): UseBrandFormReturn {
    const [name, setName] = useState(brand?.name ?? '');
    const [description, setDescription] = useState(brand?.description ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = brand !== undefined;

    const handleSubmit = async () => {
        if (isEditMode) {
            const nameUnchanged = brand.name === name;
            const descriptionUnchanged = (brand.description ?? '') === description;
            if (nameUnchanged && descriptionUnchanged) {
                setError('No changes to save.');
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            const result = isEditMode
                ? await brandService.update(brand.id, { name, description })
                : await brandService.create({ name, description });
            onSuccess?.(result);
        } catch (err: any) {
            setError(err.message ?? 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setName(brand?.name ?? '');
        setDescription(brand?.description ?? '');
        setError(null);
    };

    return { name, setName, description, setDescription, loading, error, isEditMode, handleSubmit, reset };
}

import { useState } from 'react';
import type { ProductType } from '../types/ProductType';
import { productTypeService } from '../services/productTypeService';

interface UseProductTypeFormOptions {
    productType?: ProductType;
    onSuccess?: (productType: ProductType) => void;
}

interface UseProductTypeFormReturn {
    name: string;
    setName: (value: string) => void;
    loading: boolean;
    error: string | null;
    isEditMode: boolean;
    handleSubmit: () => Promise<void>;
    reset: () => void;
}

export function useProductTypeForm({ productType, onSuccess }: UseProductTypeFormOptions = {}): UseProductTypeFormReturn {
    const [name, setName] = useState(productType?.name ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = productType !== undefined;

    const handleSubmit = async () => {
        if (isEditMode && productType.name === name) {
            setError('No changes to save.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = isEditMode
                ? await productTypeService.update(productType.id, { name })
                : await productTypeService.create({ name });
            onSuccess?.(result);
        } catch (err: any) {
            setError(err.message ?? 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setName(productType?.name ?? '');
        setError(null);
    };

    return { name, setName, loading, error, isEditMode, handleSubmit, reset };
}

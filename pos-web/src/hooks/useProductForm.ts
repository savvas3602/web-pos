import { useState } from 'react';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';

export type ProductFormState = {
    name: string;
    description: string;
    retailPrice: string;
    wholesalePrice: string;
    stockQuantity: string;
    productTypeId: number | '';
    brandId: number | '';
};

export const initialProductFormState: ProductFormState = {
    name: '',
    description: '',
    retailPrice: '',
    wholesalePrice: '',
    stockQuantity: '',
    productTypeId: '',
    brandId: ''
};

function productToFormState(product: Product): ProductFormState {
    return {
        name: product.name,
        description: product.description ?? '',
        retailPrice: String(product.retailPrice),
        wholesalePrice: String(product.wholesalePrice),
        stockQuantity: String(product.stockQuantity),
        productTypeId: product.productType?.id ?? product.productTypeId ?? '',
        brandId: product.brand?.id ?? product.brandId ?? ''
    };
}

interface UseProductFormOptions {
    product?: Product;
    onSuccess?: (product: Product) => void;
}

interface UseProductFormReturn {
    form: ProductFormState;
    setFormValue: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void;
    loading: boolean;
    error: string | null;
    isEditMode: boolean;
    handleSubmit: () => Promise<void>;
    reset: () => void;
}

export function useProductForm({ product, onSuccess }: UseProductFormOptions = {}): UseProductFormReturn {
    const [form, setForm] = useState<ProductFormState>(
        product ? productToFormState(product) : initialProductFormState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = product !== undefined;

    const setFormValue = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setError(null);

        if (isEditMode) {
            const originalProductTypeId = product.productType?.id ?? product.productTypeId ?? '';
            const originalBrandId = product.brand?.id ?? product.brandId ?? '';
            const unchanged =
                product.name === form.name &&
                (product.description ?? '') === form.description &&
                product.retailPrice === Number(form.retailPrice) &&
                product.wholesalePrice === Number(form.wholesalePrice) &&
                product.stockQuantity === Number(form.stockQuantity) &&
                originalProductTypeId === form.productTypeId &&
                originalBrandId === form.brandId;

            if (unchanged) {
                setError('No changes to save.');
                return;
            }
        }

        if (!form.productTypeId) {
            setError('Please select a valid product type.');
            return;
        }

        if (!form.brandId) {
            setError('Please select a valid brand.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                retailPrice: Number(form.retailPrice),
                wholesalePrice: Number(form.wholesalePrice),
                stockQuantity: Number(form.stockQuantity),
                productTypeId: form.productTypeId,
                brandId: form.brandId
            };

            const result = isEditMode
                ? await productService.update(product.id, payload)
                : await productService.create(payload);

            onSuccess?.(result);
        } catch (err: any) {
            setError(err.message ?? 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setForm(product ? productToFormState(product) : initialProductFormState);
        setError(null);
    };

    return { form, setFormValue, loading, error, isEditMode, handleSubmit, reset };
}

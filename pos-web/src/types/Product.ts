import type { ProductType } from "./ProductType";

export interface Product {
    id: number;
    name: string;
    retailPrice: number;
    wholesalePrice: number;
    stockQuantity: number;
    description?: string;
    productTypeId?: number;
    productType?: ProductType;
}
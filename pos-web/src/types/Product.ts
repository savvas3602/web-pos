import type { ProductType } from "./ProductType";
import type { Brand } from "./Brand";

export interface Product {
    id: number;
    name: string;
    retailPrice: number;
    wholesalePrice: number;
    stockQuantity: number;
    description?: string;
    productTypeId?: number;
    productType?: ProductType;
    brandId?: number;
    brand?: Brand;
}
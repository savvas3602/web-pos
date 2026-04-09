import type { Brand } from './Brand';

export interface OrderItem {
    id: number;
    name: string;
    description?: string;
    brand?: Brand;
    price: number;
    quantity: number;
    totalItemPrice: number;
}
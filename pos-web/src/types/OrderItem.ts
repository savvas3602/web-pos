export interface OrderItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    totalItemPrice: number;
}
export interface OrderResponseItem {
    productName: string;
    retailPrice: number;
    quantity: number;
}

export interface OrderResponse {
    id: number;
    orderValue: number;
    paymentMethod: string;
    items: OrderResponseItem[];
    totalOverridden: boolean;
    comments: string | null;
    createdAt: string;
}

export interface PurchaseHistoryReport {
    id: number;
    createdAt: string;
    orderValue: number;
    comments: string | null;
    paymentMethod: string;
    totalOverridden: boolean;
    totalItems: number;
    items: string;
}
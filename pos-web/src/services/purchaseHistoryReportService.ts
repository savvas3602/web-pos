import api from './api';
import type { PurchaseHistoryReport } from '../types/PurchaseHistoryReport';

export type PurchaseHistoryReportSearch = {
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
};

const normalizeParams = (params: PurchaseHistoryReportSearch): Record<string, string> => {
    const normalized: Record<string, string> = {};

    if (params.startDate) {
        normalized.startDate = params.startDate;
    }
    if (params.endDate) {
        normalized.endDate = params.endDate;
    }
    if (params.paymentMethod && params.paymentMethod.trim() !== '') {
        normalized.paymentMethod = params.paymentMethod.trim();
    }

    return normalized;
};

export const purchaseHistoryReportService = {
    search: async (params: PurchaseHistoryReportSearch = {}): Promise<PurchaseHistoryReport[]> => {
        const response= await api.get<PurchaseHistoryReport[]>('/reports/purchase-history', {
            params: normalizeParams(params)
        });
        return response.data;
    }
};


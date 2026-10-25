import { httpClient } from '@/shared/api/httpClient';
import { ReceiptItem } from '../types';

export const receiptService = {
  getMyReceipts: async (): Promise<ReceiptItem[]> => {
    const response = await httpClient.get<ReceiptItem[]>('/receipts/me');
    return response.data;
  },

  getReceiptByToken: async (token: string): Promise<ReceiptItem> => {
    const response = await httpClient.get<ReceiptItem>(`/receipts/share/${token}`);
    return response.data;
  }
};

import { Lot } from '../lot/types';

export interface Receipt {
  id: string;
  lotId: string;
  winnerId: string;
  finalAmount: number;
  shareToken: string;
  createdAt: string;
}

export interface ReceiptItem {
  receipt: Receipt;
  lot: Lot | null;
}

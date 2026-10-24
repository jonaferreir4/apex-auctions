import { Receipt } from '../entities/Receipt';

export interface IReceiptRepository {
  findById(id: string): Promise<Receipt | null>;
  findByLotId(lotId: string): Promise<Receipt | null>;
  findByShareToken(token: string): Promise<Receipt | null>;
  findByWinnerId(winnerId: string): Promise<Receipt[]>;
  create(receipt: Receipt): Promise<Receipt>;
}

import { Bid } from '../entities/Bid';

export interface IBidRepository {
  findById(id: string): Promise<Bid | null>;
  findByLotId(lotId: string): Promise<Bid[]>;
  findLatestByLotId(lotId: string): Promise<Bid | null>;
  create(bid: Bid): Promise<Bid>;
}

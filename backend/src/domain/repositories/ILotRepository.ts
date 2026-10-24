import { Lot, LotStatus } from '../entities/Lot';

export interface LotFilters {
  status?: LotStatus;
  category?: string;
  search?: string;
}

export interface ILotRepository {
  findById(id: string): Promise<Lot | null>;
  findMany(filters?: LotFilters): Promise<Lot[]>;
  findByAuctioneerId(auctioneerId: string): Promise<Lot[]>;
  create(lot: Lot): Promise<Lot>;
  update(lot: Lot): Promise<Lot>;
  findExpiredLiveLots(now?: Date): Promise<Lot[]>;
}

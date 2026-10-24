import { LotStatus } from '../../../domain/entities/Lot';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';

export interface ListLotsFilterDTO {
  status?: LotStatus;
  category?: string;
  search?: string;
  auctioneerId?: string;
  excludeCanceled?: boolean;
}

export class ListLotsUseCase {
  constructor(private lotRepository: ILotRepository) { }

  async execute(filter: ListLotsFilterDTO = {}) {
    let lots = filter.auctioneerId
      ? await this.lotRepository.findByAuctioneerId(filter.auctioneerId)
      : await this.lotRepository.findMany({
        status: filter.status,
        category: filter.category,
        search: filter.search
      });

    const now = new Date();

    for (const lot of lots) {
      const prevStatus = lot.status;
      lot.syncStatusWithTime(now);
      if (prevStatus !== lot.status) {
        await this.lotRepository.update(lot);
      }
    }

    if (filter.excludeCanceled) {
      lots = lots.filter(lot => lot.status !== 'CANCELADO');
    }

    if (filter.status) {
      lots = lots.filter(lot => lot.status === filter.status);
    }

    return lots.map(lot => lot.toJSON());
  }
}

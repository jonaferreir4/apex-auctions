import { LotStatus } from '../../../domain/entities/Lot';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';

export interface ListLotsFilterDTO {
  status?: LotStatus;
  category?: string;
  search?: string;
  auctioneerId?: string;
  excludeCanceled?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedLotsResult {
  data: any[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ListLotsUseCase {
  constructor(private lotRepository: ILotRepository) { }

  async execute(filter: ListLotsFilterDTO = {}): Promise<any[] | PaginatedLotsResult> {
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

    if (filter.page !== undefined) {
      const page = Math.max(1, filter.page);
      const limit = Math.max(1, filter.limit || 10);
      const totalItems = lots.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = lots.slice(startIndex, startIndex + limit).map(lot => lot.toJSON());

      return {
        data: paginatedData,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    }

    return lots.map(lot => lot.toJSON());
  }
}

export type LotStatus = 'AGENDADO' | 'AO_VIVO' | 'ENCERRADO' | 'CANCELADO';

export interface Lot {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  itemAttributes?: Record<string, unknown> | null;
  status: LotStatus;
  initialPrice: number;
  minIncrement: number;
  currentPrice: number;
  currentLeaderId?: string | null;
  auctioneerId: string;
  startTime: string;
  endTime: string;
  minNextBid: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedLotsResponse {
  data: Lot[];
  meta: PaginationMeta;
}

export interface LotFilters {
  status?: LotStatus;
  category?: string;
  search?: string;
  excludeCanceled?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateLotPayload {
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  itemAttributes?: Record<string, unknown>;
  initialPrice: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
}

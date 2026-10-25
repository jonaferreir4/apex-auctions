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

export interface LotFilters {
  status?: LotStatus;
  category?: string;
  search?: string;
  excludeCanceled?: boolean;
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

import { httpClient } from '@/shared/api/httpClient';
import { CreateLotPayload, Lot, LotFilters } from '../types';

export const lotService = {
  getLots: async (filters?: LotFilters): Promise<Lot[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.excludeCanceled !== undefined) {
      params.append('excludeCanceled', String(filters.excludeCanceled));
    }

    const response = await httpClient.get<Lot[]>('/lots', { params });
    return response.data;
  },

  getMyLots: async (): Promise<Lot[]> => {
    const response = await httpClient.get<Lot[]>('/lots/my-lots');
    return response.data;
  },

  getLotById: async (id: string): Promise<Lot> => {
    const response = await httpClient.get<Lot>(`/lots/${id}`);
    return response.data;
  },

  createLot: async (payload: CreateLotPayload): Promise<Lot> => {
    const response = await httpClient.post<Lot>('/lots', payload);
    return response.data;
  },

  cancelLot: async (id: string): Promise<Lot> => {
    const response = await httpClient.post<Lot>(`/lots/${id}/cancel`);
    return response.data;
  }
};

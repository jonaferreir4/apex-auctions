import { httpClient } from '@/shared/api/httpClient';
import { CreateLotPayload, Lot, LotFilters, PaginatedLotsResponse } from '../types';

export const lotService = {
  getLots: async (filters?: LotFilters): Promise<Lot[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.excludeCanceled !== undefined) {
      params.append('excludeCanceled', String(filters.excludeCanceled));
    }
    if (filters?.page !== undefined) params.append('page', String(filters.page));
    if (filters?.limit !== undefined) params.append('limit', String(filters.limit));

    const response = await httpClient.get<Lot[] | PaginatedLotsResponse>('/lots', { params });
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return response.data as Lot[];
  },

  getPaginatedLots: async (filters?: LotFilters): Promise<PaginatedLotsResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.excludeCanceled !== undefined) {
      params.append('excludeCanceled', String(filters.excludeCanceled));
    }
    params.append('page', String(filters?.page || 1));
    params.append('limit', String(filters?.limit || 12));

    const response = await httpClient.get<PaginatedLotsResponse>('/lots', { params });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await httpClient.get<string[]>('/lots/categories');
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

import { httpClient } from '@/shared/api/httpClient';
import { ExternalItem } from '../types';

export const externalItemService = {
  searchItems: async (query?: string): Promise<ExternalItem[]> => {
    const params = new URLSearchParams();
    if (query && query.trim() !== '') params.append('q', query);

    const response = await httpClient.get<ExternalItem[]>('/items/search', { params });
    return response.data;
  }
};

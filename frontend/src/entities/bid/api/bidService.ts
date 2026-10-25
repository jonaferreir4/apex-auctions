import { httpClient } from '@/shared/api/httpClient';
import { Bid, PlaceBidPayload, PlaceBidResult } from '../types';

export const bidService = {
  getLotBids: async (lotId: string): Promise<Bid[]> => {
    const response = await httpClient.get<Bid[]>(`/lots/${lotId}/bids`);
    return response.data;
  },

  placeBid: async ({ lotId, amount }: PlaceBidPayload): Promise<PlaceBidResult> => {
    const response = await httpClient.post<PlaceBidResult>(`/lots/${lotId}/bids`, { amount });
    return response.data;
  }
};

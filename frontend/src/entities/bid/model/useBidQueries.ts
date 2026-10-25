import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bidService } from '../api/bidService';
import { PlaceBidPayload } from '../types';
import { LOTS_QUERY_KEY } from '@/entities/lot/model/useLotQueries';
import { WALLET_QUERY_KEY } from '@/entities/wallet/model/useWalletQueries';

export const BIDS_QUERY_KEY = ['bids'] as const;

export function useLotBidsQuery(lotId: string) {
  return useQuery({
    queryKey: [...BIDS_QUERY_KEY, lotId],
    queryFn: () => bidService.getLotBids(lotId),
    enabled: Boolean(lotId),
    refetchInterval: 3000
  });
}

export function usePlaceBidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceBidPayload) => bidService.placeBid(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...BIDS_QUERY_KEY, variables.lotId] });
      queryClient.invalidateQueries({ queryKey: [...LOTS_QUERY_KEY, 'detail', variables.lotId] });
      queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
    }
  });
}

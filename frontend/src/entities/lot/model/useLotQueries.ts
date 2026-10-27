import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lotService } from '../api/lotService';
import { CreateLotPayload, LotFilters } from '../types';

export const LOTS_QUERY_KEY = ['lots'] as const;

export function useLotsQuery(filters?: LotFilters) {
  return useQuery({
    queryKey: [...LOTS_QUERY_KEY, filters],
    queryFn: () => lotService.getLots(filters),
    refetchInterval: 5000
  });
}

export function usePaginatedLotsQuery(filters?: LotFilters) {
  return useQuery({
    queryKey: [...LOTS_QUERY_KEY, 'paginated', filters],
    queryFn: () => lotService.getPaginatedLots(filters),
    refetchInterval: 5000
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: [...LOTS_QUERY_KEY, 'categories'],
    queryFn: lotService.getCategories,
    refetchInterval: 10000
  });
}

export function useMyLotsQuery(isAuctioneer: boolean) {
  return useQuery({
    queryKey: [...LOTS_QUERY_KEY, 'my-lots'],
    queryFn: lotService.getMyLots,
    enabled: isAuctioneer,
    refetchInterval: 5000
  });
}

export function useLotDetailQuery(id: string) {
  return useQuery({
    queryKey: [...LOTS_QUERY_KEY, 'detail', id],
    queryFn: () => lotService.getLotById(id),
    enabled: Boolean(id)
  });
}

export function useCreateLotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLotPayload) => lotService.createLot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEY });
    }
  });
}

export function useCancelLotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lotService.cancelLot(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LOTS_QUERY_KEY, 'detail', id] });
    }
  });
}

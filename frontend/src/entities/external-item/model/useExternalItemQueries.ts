import { useQuery } from '@tanstack/react-query';
import { externalItemService } from '../api/externalItemService';

export const EXTERNAL_ITEMS_QUERY_KEY = ['external-items'] as const;

export function useExternalItemsQuery(query?: string) {
  return useQuery({
    queryKey: [...EXTERNAL_ITEMS_QUERY_KEY, query],
    queryFn: () => externalItemService.searchItems(query),
    staleTime: 1000 * 60 * 2
  });
}

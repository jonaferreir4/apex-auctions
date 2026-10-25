import { useQuery } from '@tanstack/react-query';
import { receiptService } from '../api/receiptService';

export const RECEIPTS_QUERY_KEY = ['receipts'] as const;

export function useMyReceiptsQuery(isBidder: boolean) {
  return useQuery({
    queryKey: [...RECEIPTS_QUERY_KEY, 'me'],
    queryFn: receiptService.getMyReceipts,
    enabled: isBidder
  });
}

export function useReceiptByTokenQuery(token: string) {
  return useQuery({
    queryKey: [...RECEIPTS_QUERY_KEY, 'share', token],
    queryFn: () => receiptService.getReceiptByToken(token),
    enabled: Boolean(token)
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../api/walletService';
import { DepositPayload } from '../types';

export const WALLET_QUERY_KEY = ['wallet'] as const;

export function useWalletQuery(isBidder: boolean) {
  return useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: walletService.getBalance,
    enabled: isBidder,
    staleTime: 1000 * 30
  });
}

export function useDepositMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepositPayload) => walletService.deposit(payload),
    onSuccess: (updatedBalance) => {
      queryClient.setQueryData(WALLET_QUERY_KEY, updatedBalance);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });
}

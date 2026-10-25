import { httpClient } from '@/shared/api/httpClient';
import { DepositPayload, WalletBalance } from '../types';

export const walletService = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await httpClient.get<WalletBalance>('/wallet');
    return response.data;
  },

  deposit: async (payload: DepositPayload): Promise<WalletBalance> => {
    const response = await httpClient.post<WalletBalance>('/wallet/deposit', payload);
    return response.data;
  }
};

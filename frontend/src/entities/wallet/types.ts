export interface WalletBalance {
  totalBalance: number;
  committedBalance: number;
  availableBalance: number;
}

export interface DepositPayload {
  amount: number;
}

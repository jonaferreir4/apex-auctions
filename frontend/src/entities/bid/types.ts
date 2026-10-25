export interface Bid {
  id: string;
  lotId: string;
  bidderId: string;
  amount: number;
  previousHash: string;
  hash: string;
  createdAt: string;
}

export interface PlaceBidPayload {
  lotId: string;
  amount: number;
}

export interface PlaceBidResult {
  bid: Bid;
  lot: any;
  status: 'GANHANDO';
}

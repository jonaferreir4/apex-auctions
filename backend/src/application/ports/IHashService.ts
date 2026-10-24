export interface IHashService {
  generateGenesisHash(lotId: string): string;
  calculateBidHash(
    previousHash: string,
    bidId: string,
    lotId: string,
    bidderId: string,
    amount: number,
    createdAt: Date
  ): string;
}

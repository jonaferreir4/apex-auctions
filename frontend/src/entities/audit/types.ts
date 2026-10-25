export interface AuditRecordItem {
  index: number;
  bidId: string;
  bidderMasked: string;
  amount: number;
  createdAt: string;
  previousHash: string;
  hash: string;
  recalculatedHash: string;
  isHashValid: boolean;
  isChainLinkValid: boolean;
}

export interface LotAuditReport {
  lotId: string;
  lotTitle: string;
  lotStatus: string;
  isIntegrityVerified: boolean;
  totalBids: number;
  genesisHash: string;
  records: AuditRecordItem[];
  tamperedAtBidIndex?: number | null;
  statusMessage: string;
}

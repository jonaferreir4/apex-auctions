export interface BidProps {
  id: string;
  lotId: string;
  bidderId: string;
  amount: number;
  previousHash: string;
  hash: string;
  createdAt: Date;
}

export class Bid {
  constructor(private props: BidProps) {}

  get id(): string {
    return this.props.id;
  }

  get lotId(): string {
    return this.props.lotId;
  }

  get bidderId(): string {
    return this.props.bidderId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get previousHash(): string {
    return this.props.previousHash;
  }

  get hash(): string {
    return this.props.hash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get maskedBidderId(): string {
    return `Licitante #****${this.props.bidderId.slice(-4)}`;
  }

  toJSON(maskBidder = false) {
    return {
      id: this.id,
      lotId: this.lotId,
      bidderId: maskBidder ? this.maskedBidderId : this.bidderId,
      amount: this.amount,
      previousHash: this.previousHash,
      hash: this.hash,
      createdAt: this.createdAt
    };
  }
}

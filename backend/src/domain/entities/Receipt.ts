export interface ReceiptProps {
  id: string;
  lotId: string;
  winnerId: string;
  finalAmount: number;
  shareToken: string;
  createdAt: Date;
}

export class Receipt {
  constructor(private props: ReceiptProps) {}

  get id(): string {
    return this.props.id;
  }

  get lotId(): string {
    return this.props.lotId;
  }

  get winnerId(): string {
    return this.props.winnerId;
  }

  get finalAmount(): number {
    return this.props.finalAmount;
  }

  get shareToken(): string {
    return this.props.shareToken;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get maskedWinnerId(): string {
    return `Arrematante #****${this.props.winnerId.slice(-4)}`;
  }

  toJSON(maskWinner = false) {
    return {
      id: this.id,
      lotId: this.lotId,
      winnerId: maskWinner ? this.maskedWinnerId : this.winnerId,
      finalAmount: this.finalAmount,
      shareToken: this.shareToken,
      createdAt: this.createdAt
    };
  }
}

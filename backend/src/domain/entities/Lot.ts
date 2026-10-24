export type LotStatus = 'AGENDADO' | 'AO_VIVO' | 'ENCERRADO' | 'CANCELADO';

export interface LotProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  itemAttributes?: Record<string, unknown> | null;
  status: LotStatus;
  initialPrice: number;
  minIncrement: number;
  currentPrice: number;
  currentLeaderId?: string | null;
  auctioneerId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Lot {
  constructor(private props: LotProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get category(): string {
    return this.props.category;
  }

  get itemAttributes(): Record<string, unknown> | null | undefined {
    return this.props.itemAttributes;
  }

  get status(): LotStatus {
    return this.props.status;
  }

  get initialPrice(): number {
    return this.props.initialPrice;
  }

  get minIncrement(): number {
    return this.props.minIncrement;
  }

  get currentPrice(): number {
    return this.props.currentPrice;
  }

  get currentLeaderId(): string | null | undefined {
    return this.props.currentLeaderId;
  }

  get auctioneerId(): string {
    return this.props.auctioneerId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  calculateMinNextBid(): number {
    if (!this.props.currentLeaderId || this.props.currentPrice === 0) {
      return this.props.initialPrice;
    }
    return Number((this.props.currentPrice + this.props.minIncrement).toFixed(2));
  }

  isLive(now: Date = new Date()): boolean {
    if (this.props.status === 'CANCELADO' || this.props.status === 'ENCERRADO') {
      return false;
    }
    return now >= this.props.startTime && now < this.props.endTime;
  }

  isAntiSnipingActive(now: Date = new Date()): boolean {
    const timeRemainingMs = this.props.endTime.getTime() - now.getTime();
    return timeRemainingMs > 0 && timeRemainingMs <= 2 * 60 * 1000;
  }

  extendAntiSniping(minutes: number = 2): void {
    this.props.endTime = new Date(this.props.endTime.getTime() + minutes * 60 * 1000);
    this.props.updatedAt = new Date();
  }

  applyBid(amount: number, bidderId: string, now: Date = new Date()): void {
    this.props.currentPrice = amount;
    this.props.currentLeaderId = bidderId;
    this.props.status = 'AO_VIVO';
    this.props.updatedAt = now;

    if (this.isAntiSnipingActive(now)) {
      this.extendAntiSniping(2);
    }
  }

  close(now: Date = new Date()): void {
    this.props.status = 'ENCERRADO';
    this.props.updatedAt = now;
  }

  cancel(now: Date = new Date()): void {
    this.props.status = 'CANCELADO';
    this.props.updatedAt = now;
  }

  syncStatusWithTime(now: Date = new Date()): void {
    if (this.props.status === 'CANCELADO' || this.props.status === 'ENCERRADO') {
      return;
    }

    if (now >= this.props.endTime) {
      this.props.status = 'ENCERRADO';
      this.props.updatedAt = now;
    } else if (now >= this.props.startTime && this.props.status === 'AGENDADO') {
      this.props.status = 'AO_VIVO';
      this.props.updatedAt = now;
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      category: this.category,
      itemAttributes: this.itemAttributes,
      status: this.status,
      initialPrice: this.initialPrice,
      minIncrement: this.minIncrement,
      currentPrice: this.currentPrice,
      currentLeaderId: this.currentLeaderId,
      auctioneerId: this.auctioneerId,
      startTime: this.startTime,
      endTime: this.endTime,
      minNextBid: this.calculateMinNextBid(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

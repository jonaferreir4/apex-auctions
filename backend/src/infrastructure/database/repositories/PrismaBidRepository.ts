import { PrismaClient } from '@prisma/client';
import { Bid } from '../../../domain/entities/Bid';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';

export class PrismaBidRepository implements IBidRepository {
  constructor(private prisma: PrismaClient) { }

  async findById(id: string): Promise<Bid | null> {
    const data = await this.prisma.bid.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByLotId(lotId: string): Promise<Bid[]> {
    const data = await this.prisma.bid.findMany({
      where: { lotId },
      orderBy: { createdAt: 'asc' }
    });
    return data.map(item => this.mapToDomain(item));
  }

  async findLatestByLotId(lotId: string): Promise<Bid | null> {
    const data = await this.prisma.bid.findFirst({
      where: { lotId },
      orderBy: { createdAt: 'desc' }
    });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async create(bid: Bid): Promise<Bid> {
    const created = await this.prisma.bid.create({
      data: {
        id: bid.id,
        lotId: bid.lotId,
        bidderId: bid.bidderId,
        amount: bid.amount,
        previousHash: bid.previousHash,
        hash: bid.hash,
        createdAt: bid.createdAt
      }
    });
    return this.mapToDomain(created);
  }

  private mapToDomain(data: {
    id: string;
    lotId: string;
    bidderId: string;
    amount: number;
    previousHash: string;
    hash: string;
    createdAt: Date;
  }): Bid {
    return new Bid({
      id: data.id,
      lotId: data.lotId,
      bidderId: data.bidderId,
      amount: data.amount,
      previousHash: data.previousHash,
      hash: data.hash,
      createdAt: data.createdAt
    });
  }
}

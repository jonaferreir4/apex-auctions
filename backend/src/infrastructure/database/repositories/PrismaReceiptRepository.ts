import { PrismaClient } from '@prisma/client';
import { Receipt } from '../../../domain/entities/Receipt';
import { IReceiptRepository } from '../../../domain/repositories/IReceiptRepository';

export class PrismaReceiptRepository implements IReceiptRepository {
  constructor(private prisma: PrismaClient) { }

  async findById(id: string): Promise<Receipt | null> {
    const data = await this.prisma.receipt.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByLotId(lotId: string): Promise<Receipt | null> {
    const data = await this.prisma.receipt.findUnique({ where: { lotId } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByShareToken(shareToken: string): Promise<Receipt | null> {
    const data = await this.prisma.receipt.findUnique({ where: { shareToken } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByWinnerId(winnerId: string): Promise<Receipt[]> {
    const data = await this.prisma.receipt.findMany({
      where: { winnerId },
      orderBy: { createdAt: 'desc' }
    });
    return data.map(item => this.mapToDomain(item));
  }

  async create(receipt: Receipt): Promise<Receipt> {
    const created = await this.prisma.receipt.create({
      data: {
        id: receipt.id,
        lotId: receipt.lotId,
        winnerId: receipt.winnerId,
        finalAmount: receipt.finalAmount,
        shareToken: receipt.shareToken,
        createdAt: receipt.createdAt
      }
    });
    return this.mapToDomain(created);
  }

  private mapToDomain(data: {
    id: string;
    lotId: string;
    winnerId: string;
    finalAmount: number;
    shareToken: string;
    createdAt: Date;
  }): Receipt {
    return new Receipt({
      id: data.id,
      lotId: data.lotId,
      winnerId: data.winnerId,
      finalAmount: data.finalAmount,
      shareToken: data.shareToken,
      createdAt: data.createdAt
    });
  }
}

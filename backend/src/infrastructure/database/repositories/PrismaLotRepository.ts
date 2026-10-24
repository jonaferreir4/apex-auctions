import { PrismaClient } from '@prisma/client';
import { Lot, LotProps, LotStatus } from '../../../domain/entities/Lot';
import { ILotRepository, LotFilters } from '../../../domain/repositories/ILotRepository';

export class PrismaLotRepository implements ILotRepository {
  constructor(private prisma: PrismaClient) { }

  async findById(id: string): Promise<Lot | null> {
    const data = await this.prisma.lot.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findMany(filters?: LotFilters): Promise<Lot[]> {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const data = await this.prisma.lot.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return data.map(item => this.mapToDomain(item));
  }

  async findByAuctioneerId(auctioneerId: string): Promise<Lot[]> {
    const data = await this.prisma.lot.findMany({
      where: { auctioneerId },
      orderBy: { createdAt: 'desc' }
    });
    return data.map(item => this.mapToDomain(item));
  }

  async findExpiredLiveLots(now = new Date()): Promise<Lot[]> {
    const data = await this.prisma.lot.findMany({
      where: {
        status: 'AO_VIVO',
        endTime: { lte: now }
      }
    });
    return data.map(item => this.mapToDomain(item));
  }

  async create(lot: Lot): Promise<Lot> {
    const created = await this.prisma.lot.create({
      data: {
        id: lot.id,
        title: lot.title,
        description: lot.description,
        imageUrl: lot.imageUrl,
        category: lot.category,
        itemAttributes: (lot.itemAttributes || {}) as any,
        status: lot.status,
        initialPrice: lot.initialPrice,
        minIncrement: lot.minIncrement,
        currentPrice: lot.currentPrice,
        currentLeaderId: lot.currentLeaderId || null,
        auctioneerId: lot.auctioneerId,
        startTime: lot.startTime,
        endTime: lot.endTime,
        createdAt: lot.createdAt,
        updatedAt: lot.updatedAt
      }
    });
    return this.mapToDomain(created);
  }

  async update(lot: Lot): Promise<Lot> {
    const updated = await this.prisma.lot.update({
      where: { id: lot.id },
      data: {
        title: lot.title,
        description: lot.description,
        imageUrl: lot.imageUrl,
        category: lot.category,
        itemAttributes: (lot.itemAttributes || {}) as any,
        status: lot.status,
        initialPrice: lot.initialPrice,
        minIncrement: lot.minIncrement,
        currentPrice: lot.currentPrice,
        currentLeaderId: lot.currentLeaderId || null,
        startTime: lot.startTime,
        endTime: lot.endTime,
        updatedAt: lot.updatedAt
      }
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(data: any): Lot {
    return new Lot({
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      itemAttributes: data.itemAttributes as Record<string, unknown>,
      status: data.status as LotStatus,
      initialPrice: data.initialPrice,
      minIncrement: data.minIncrement,
      currentPrice: data.currentPrice,
      currentLeaderId: data.currentLeaderId,
      auctioneerId: data.auctioneerId,
      startTime: data.startTime,
      endTime: data.endTime,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

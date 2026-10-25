import { describe, it, expect } from 'vitest';
import { PlaceBidUseCase } from '../src/application/use-cases/bids/PlaceBidUseCase';
import { User } from '../src/domain/entities/User';
import { Lot } from '../src/domain/entities/Lot';
import { Sha256HashService } from '../src/infrastructure/crypto/Sha256HashService';
import { BidRuleError, ForbiddenError, InsufficientBalanceError } from '../src/domain/errors/DomainError';

describe('Regras de Lances (PlaceBidUseCase)', () => {
  const hashService = new Sha256HashService();
  const mockEmitter: any = {
    emitToLot: () => { },
    emitToUser: () => { },
    broadcast: () => { }
  };

  const createMockBidder = (id: string, total: number, committed = 0) => new User({
    id,
    name: 'Licitante Teste',
    email: `${id}@test.com`,
    password: 'hash',
    role: 'LICITANTE',
    totalBalance: total,
    committedBalance: committed,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const createMockAuctioneer = () => new User({
    id: 'auc-1',
    name: 'Leiloeiro Teste',
    email: 'auc@test.com',
    password: 'hash',
    role: 'LEILOEIRO',
    totalBalance: 0,
    committedBalance: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  it('não deve permitir que leiloeiro dê lances', async () => {
    const auctioneer = createMockAuctioneer();
    const mockUserRepo: any = { findById: async () => auctioneer };
    const mockLotRepo: any = {};
    const mockBidRepo: any = {};

    const useCase = new PlaceBidUseCase(mockLotRepo, mockUserRepo, mockBidRepo, hashService, mockEmitter);

    await expect(useCase.execute({ lotId: 'lot-1', bidderId: auctioneer.id, amount: 500 }))
      .rejects.toThrow(ForbiddenError);
  });

  it('não deve permitir lance se o licitante já for o líder', async () => {
    const bidder = createMockBidder('bidder-1', 5000, 1000);
    const now = new Date();
    const lot = new Lot({
      id: 'lot-1',
      title: 'Lote Teste',
      description: 'Desc',
      imageUrl: 'http://img.com',
      category: 'Geral',
      status: 'AO_VIVO',
      initialPrice: 1000,
      minIncrement: 100,
      currentPrice: 1000,
      currentLeaderId: 'bidder-1',
      auctioneerId: 'auc-1',
      startTime: new Date(now.getTime() - 10000),
      endTime: new Date(now.getTime() + 100000),
      createdAt: now,
      updatedAt: now
    });

    const mockUserRepo: any = { findById: async () => bidder };
    const mockLotRepo: any = { findById: async () => lot };
    const mockBidRepo: any = {};

    const useCase = new PlaceBidUseCase(mockLotRepo, mockUserRepo, mockBidRepo, hashService, mockEmitter);

    await expect(useCase.execute({ lotId: lot.id, bidderId: bidder.id, amount: 1200 }))
      .rejects.toThrow('Você já está ganhando');
  });

  it('não deve aceitar lance abaixo do mínimo (lance atual + incremento)', async () => {
    const bidder = createMockBidder('bidder-2', 5000);
    const now = new Date();
    const lot = new Lot({
      id: 'lot-1',
      title: 'Lote Teste',
      description: 'Desc',
      imageUrl: 'http://img.com',
      category: 'Geral',
      status: 'AO_VIVO',
      initialPrice: 1000,
      minIncrement: 100,
      currentPrice: 1000,
      currentLeaderId: 'bidder-1',
      auctioneerId: 'auc-1',
      startTime: new Date(now.getTime() - 10000),
      endTime: new Date(now.getTime() + 100000),
      createdAt: now,
      updatedAt: now
    });

    const mockUserRepo: any = { findById: async () => bidder };
    const mockLotRepo: any = { findById: async () => lot };
    const mockBidRepo: any = {};

    const useCase = new PlaceBidUseCase(mockLotRepo, mockUserRepo, mockBidRepo, hashService, mockEmitter);

    await expect(useCase.execute({ lotId: lot.id, bidderId: bidder.id, amount: 1050 }))
      .rejects.toThrow(BidRuleError);
  });

  it('não deve aceitar lance se o saldo disponível for insuficiente', async () => {
    const bidder = createMockBidder('bidder-2', 1000, 200); // disponível = 800
    const now = new Date();
    const lot = new Lot({
      id: 'lot-1',
      title: 'Lote Teste',
      description: 'Desc',
      imageUrl: 'http://img.com',
      category: 'Geral',
      status: 'AO_VIVO',
      initialPrice: 500,
      minIncrement: 50,
      currentPrice: 500,
      currentLeaderId: 'bidder-1',
      auctioneerId: 'auc-1',
      startTime: new Date(now.getTime() - 10000),
      endTime: new Date(now.getTime() + 100000),
      createdAt: now,
      updatedAt: now
    });

    const mockUserRepo: any = { findById: async () => bidder };
    const mockLotRepo: any = { findById: async () => lot };
    const mockBidRepo: any = {};

    const useCase = new PlaceBidUseCase(mockLotRepo, mockUserRepo, mockBidRepo, hashService, mockEmitter);

    await expect(useCase.execute({ lotId: lot.id, bidderId: bidder.id, amount: 900 }))
      .rejects.toThrow(InsufficientBalanceError);
  });

  it('deve prorrogar o lote em +2 minutos se o lance for dado nos últimos 2 minutos (Anti-Sniping)', async () => {
    const bidder = createMockBidder('bidder-2', 5000);
    const now = new Date();
    const initialEndTime = new Date(now.getTime() + 60 * 1000); // falta 1 minuto para encerrar

    const lot = new Lot({
      id: 'lot-1',
      title: 'Lote Teste',
      description: 'Desc',
      imageUrl: 'http://img.com',
      category: 'Geral',
      status: 'AO_VIVO',
      initialPrice: 1000,
      minIncrement: 100,
      currentPrice: 1000,
      currentLeaderId: 'bidder-1',
      auctioneerId: 'auc-1',
      startTime: new Date(now.getTime() - 10000),
      endTime: initialEndTime,
      createdAt: now,
      updatedAt: now
    });

    const mockUserRepo: any = {
      findById: async (id: string) => id === 'bidder-2' ? bidder : createMockBidder('bidder-1', 3000, 1000),
      update: async (u: User) => u
    };
    const mockLotRepo: any = {
      findById: async () => lot,
      update: async (l: Lot) => l
    };
    const mockBidRepo: any = {
      findLatestByLotId: async () => null,
      create: async (b: any) => b
    };

    const useCase = new PlaceBidUseCase(mockLotRepo, mockUserRepo, mockBidRepo, hashService, mockEmitter);
    const result = await useCase.execute({ lotId: lot.id, bidderId: bidder.id, amount: 1200 });

    expect(result.status).toBe('GANHANDO');
    expect(lot.endTime.getTime()).toBeGreaterThan(initialEndTime.getTime());
    expect(lot.currentLeaderId).toBe(bidder.id);
    expect(lot.currentPrice).toBe(1200);
  });
});

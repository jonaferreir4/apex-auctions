import { describe, it, expect } from 'vitest';
import { Sha256HashService } from '../src/infrastructure/crypto/Sha256HashService';
import { VerifyLotAuditUseCase } from '../src/application/use-cases/bids/VerifyLotAuditUseCase';
import { Bid } from '../src/domain/entities/Bid';
import { Lot } from '../src/domain/entities/Lot';

describe('Hash Chain & Auditoria Criptográfica', () => {
  const hashService = new Sha256HashService();

  it('deve gerar hashes determinísticos e encadeados', () => {
    const lotId = 'lot-123';
    const genesisHash = hashService.generateGenesisHash(lotId);
    expect(genesisHash).toBeDefined();
    expect(genesisHash.length).toBe(64);

    const now1 = new Date();
    const hash1 = hashService.calculateBidHash(genesisHash, 'bid-1', lotId, 'bidder-1', 100, now1);
    expect(hash1).toBeDefined();
    expect(hash1.length).toBe(64);

    const now2 = new Date();
    const hash2 = hashService.calculateBidHash(hash1, 'bid-2', lotId, 'bidder-2', 150, now2);
    expect(hash2).toBeDefined();
    expect(hash2).not.toBe(hash1);
  });

  it('deve validar integridade quando a cadeia não sofreu adulteração', async () => {
    const lotId = 'lot-valid';
    const genesisHash = hashService.generateGenesisHash(lotId);
    const now = new Date();

    const bid1Time = new Date(now.getTime() - 10000);
    const bid1Hash = hashService.calculateBidHash(genesisHash, 'bid-1', lotId, 'bidder-1', 100, bid1Time);
    const bid1 = new Bid({
      id: 'bid-1',
      lotId,
      bidderId: 'bidder-1',
      amount: 100,
      previousHash: genesisHash,
      hash: bid1Hash,
      createdAt: bid1Time
    });

    const bid2Time = now;
    const bid2Hash = hashService.calculateBidHash(bid1Hash, 'bid-2', lotId, 'bidder-2', 120, bid2Time);
    const bid2 = new Bid({
      id: 'bid-2',
      lotId,
      bidderId: 'bidder-2',
      amount: 120,
      previousHash: bid1Hash,
      hash: bid2Hash,
      createdAt: bid2Time
    });

    const mockLotRepo: any = {
      findById: async () => new Lot({
        id: lotId,
        title: 'Lote Teste',
        description: 'Desc',
        imageUrl: 'http://img.com',
        category: 'Arte',
        status: 'AO_VIVO',
        initialPrice: 100,
        minIncrement: 20,
        currentPrice: 120,
        auctioneerId: 'auc-1',
        startTime: new Date(now.getTime() - 60000),
        endTime: new Date(now.getTime() + 60000),
        createdAt: now,
        updatedAt: now
      })
    };

    const mockBidRepo: any = {
      findByLotId: async () => [bid1, bid2]
    };

    const auditUseCase = new VerifyLotAuditUseCase(mockLotRepo, mockBidRepo, hashService);
    const result = await auditUseCase.execute(lotId);

    expect(result.isIntegrityVerified).toBe(true);
    expect(result.tamperedAtBidIndex).toBeNull();
    expect(result.records).toHaveLength(2);
    expect(result.records[0].isHashValid).toBe(true);
    expect(result.records[1].isHashValid).toBe(true);
  });

  it('deve detectar adulteração no valor de um lance modificado no banco', async () => {
    const lotId = 'lot-tampered';
    const genesisHash = hashService.generateGenesisHash(lotId);
    const now = new Date();

    const bid1Time = new Date(now.getTime() - 10000);
    const bid1Hash = hashService.calculateBidHash(genesisHash, 'bid-1', lotId, 'bidder-1', 100, bid1Time);

    const tamperedBid1 = new Bid({
      id: 'bid-1',
      lotId,
      bidderId: 'bidder-1',
      amount: 80,
      previousHash: genesisHash,
      hash: bid1Hash,
      createdAt: bid1Time
    });

    const mockLotRepo: any = {
      findById: async () => new Lot({
        id: lotId,
        title: 'Lote Teste',
        description: 'Desc',
        imageUrl: 'http://img.com',
        category: 'Arte',
        status: 'AO_VIVO',
        initialPrice: 100,
        minIncrement: 20,
        currentPrice: 100,
        auctioneerId: 'auc-1',
        startTime: new Date(now.getTime() - 60000),
        endTime: new Date(now.getTime() + 60000),
        createdAt: now,
        updatedAt: now
      })
    };

    const mockBidRepo: any = {
      findByLotId: async () => [tamperedBid1]
    };

    const auditUseCase = new VerifyLotAuditUseCase(mockLotRepo, mockBidRepo, hashService);
    const result = await auditUseCase.execute(lotId);

    expect(result.isIntegrityVerified).toBe(false);
    expect(result.tamperedAtBidIndex).toBe(1);
    expect(result.records[0].isHashValid).toBe(false);
  });
});

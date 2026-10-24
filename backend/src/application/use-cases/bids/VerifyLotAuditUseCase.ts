import { NotFoundError } from '../../../domain/errors/DomainError';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IHashService } from '../../ports/IHashService';

export interface AuditRecordItem {
  index: number;
  bidId: string;
  bidderMasked: string;
  amount: number;
  createdAt: Date;
  previousHash: string;
  hash: string;
  recalculatedHash: string;
  isHashValid: boolean;
  isChainLinkValid: boolean;
}

export interface LotAuditResult {
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

export class VerifyLotAuditUseCase {
  constructor(
    private lotRepository: ILotRepository,
    private bidRepository: IBidRepository,
    private hashService: IHashService
  ) { }

  async execute(lotId: string): Promise<LotAuditResult> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundError('Lote não encontrado para auditoria');
    }

    const bids = await this.bidRepository.findByLotId(lotId);
    const genesisHash = this.hashService.generateGenesisHash(lotId);

    if (bids.length === 0) {
      return {
        lotId: lot.id,
        lotTitle: lot.title,
        lotStatus: lot.status,
        isIntegrityVerified: true,
        totalBids: 0,
        genesisHash,
        records: [],
        tamperedAtBidIndex: null,
        statusMessage: 'Nenhum lance submetido para este lote até o momento. Registro íntegro.'
      };
    }

    let isEntireChainValid = true;
    let tamperedIndex: number | null = null;
    let expectedPreviousHash = genesisHash;
    const records: AuditRecordItem[] = [];

    for (let i = 0; i < bids.length; i++) {
      const bid = bids[i];
      const recalculatedHash = this.hashService.calculateBidHash(
        bid.previousHash,
        bid.id,
        bid.lotId,
        bid.bidderId,
        bid.amount,
        bid.createdAt
      );

      const isChainLinkValid = bid.previousHash === expectedPreviousHash;
      const isHashValid = bid.hash === recalculatedHash;

      if (!isChainLinkValid || !isHashValid) {
        isEntireChainValid = false;
        if (tamperedIndex === null) {
          tamperedIndex = i + 1;
        }
      }

      records.push({
        index: i + 1,
        bidId: bid.id,
        bidderMasked: bid.maskedBidderId,
        amount: bid.amount,
        createdAt: bid.createdAt,
        previousHash: bid.previousHash,
        hash: bid.hash,
        recalculatedHash,
        isHashValid,
        isChainLinkValid
      });

      expectedPreviousHash = bid.hash;
    }

    return {
      lotId: lot.id,
      lotTitle: lot.title,
      lotStatus: lot.status,
      isIntegrityVerified: isEntireChainValid,
      totalBids: bids.length,
      genesisHash,
      records,
      tamperedAtBidIndex: tamperedIndex,
      statusMessage: isEntireChainValid
        ? 'Todos os lances foram validados criptograficamente. O histórico não sofreu adulterações.'
        : `ALERTA DE SEGURANÇA: Corrupção ou adulteração detectada na cadeia a partir do lance #${tamperedIndex}.`
    };
  }
}

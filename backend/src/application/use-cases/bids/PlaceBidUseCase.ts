import { Bid } from '../../../domain/entities/Bid';
import { BidRuleError, ForbiddenError, InsufficientBalanceError, NotFoundError } from '../../../domain/errors/DomainError';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IHashService } from '../../ports/IHashService';
import { IWebSocketEmitter } from '../../ports/IWebSocketEmitter';
import crypto from 'node:crypto';

export interface PlaceBidDTO {
  lotId: string;
  bidderId: string;
  amount: number;
}

export class PlaceBidUseCase {
  constructor(
    private lotRepository: ILotRepository,
    private userRepository: IUserRepository,
    private bidRepository: IBidRepository,
    private hashService: IHashService,
    private websocketEmitter: IWebSocketEmitter
  ) { }

  async execute(dto: PlaceBidDTO) {
    const bidder = await this.userRepository.findById(dto.bidderId);
    if (!bidder) {
      throw new NotFoundError('Licitante não encontrado');
    }

    if (bidder.isAuctioneer()) {
      throw new ForbiddenError('Leiloeiro não pode dar lances');
    }

    const lot = await this.lotRepository.findById(dto.lotId);
    if (!lot) {
      throw new NotFoundError('Lote não encontrado');
    }

    const now = new Date();

    if (now < lot.startTime) {
      throw new BidRuleError('Lote ainda não iniciado');
    }

    if (now >= lot.endTime || lot.status === 'ENCERRADO') {
      throw new BidRuleError('Lote encerrado');
    }

    if (lot.status === 'CANCELADO') {
      throw new BidRuleError('Lote cancelado');
    }

    if (lot.currentLeaderId === bidder.id) {
      throw new BidRuleError('Você já está ganhando');
    }

    const minRequired = lot.calculateMinNextBid();
    if (dto.amount < minRequired) {
      throw new BidRuleError(`Lance abaixo do mínimo permitido de R$ ${minRequired.toFixed(2)}`);
    }

    if (!bidder.canAfford(dto.amount)) {
      throw new InsufficientBalanceError('Saldo insuficiente na carteira');
    }

    const previousLeaderId = lot.currentLeaderId;
    const previousPrice = lot.currentPrice;

    if (previousLeaderId && previousPrice > 0) {
      const prevLeader = await this.userRepository.findById(previousLeaderId);
      if (prevLeader) {
        prevLeader.releaseCommittedBalance(previousPrice);
        await this.userRepository.update(prevLeader);

        this.websocketEmitter.emitToUser(prevLeader.id, 'outbid_notification', {
          lotId: lot.id,
          lotTitle: lot.title,
          newAmount: dto.amount,
          message: 'Você foi superado!'
        });

        this.websocketEmitter.emitToUser(prevLeader.id, 'wallet_updated', {
          totalBalance: prevLeader.totalBalance,
          committedBalance: prevLeader.committedBalance,
          availableBalance: prevLeader.availableBalance
        });
      }
    }

    bidder.commitBalance(dto.amount);
    await this.userRepository.update(bidder);

    const wasAntiSniping = lot.isAntiSnipingActive(now);
    lot.applyBid(dto.amount, bidder.id, now);
    await this.lotRepository.update(lot);

    const latestBid = await this.bidRepository.findLatestByLotId(lot.id);
    const previousHash = latestBid ? latestBid.hash : this.hashService.generateGenesisHash(lot.id);
    const bidId = crypto.randomUUID();
    const bidHash = this.hashService.calculateBidHash(
      previousHash,
      bidId,
      lot.id,
      bidder.id,
      dto.amount,
      now
    );

    const bid = new Bid({
      id: bidId,
      lotId: lot.id,
      bidderId: bidder.id,
      amount: dto.amount,
      previousHash,
      hash: bidHash,
      createdAt: now
    });

    const savedBid = await this.bidRepository.create(bid);

    this.websocketEmitter.emitToUser(bidder.id, 'wallet_updated', {
      totalBalance: bidder.totalBalance,
      committedBalance: bidder.committedBalance,
      availableBalance: bidder.availableBalance
    });

    this.websocketEmitter.emitToLot(lot.id, 'bid_placed', {
      lotId: lot.id,
      currentPrice: lot.currentPrice,
      minNextBid: lot.calculateMinNextBid(),
      currentLeaderId: bidder.id,
      leaderMasked: bid.maskedBidderId,
      endTime: lot.endTime,
      isAntiSnipingTriggered: wasAntiSniping,
      bid: savedBid.toJSON(true)
    });

    if (wasAntiSniping) {
      this.websocketEmitter.emitToLot(lot.id, 'anti_sniping_triggered', {
        lotId: lot.id,
        newEndTime: lot.endTime,
        message: 'Lance nos minutos finais! Tempo prorrogado em +2 minutos.'
      });
    }

    this.websocketEmitter.broadcast('lot_updated', lot.toJSON());

    return {
      bid: savedBid.toJSON(),
      lot: lot.toJSON(),
      status: 'GANHANDO'
    };
  }
}

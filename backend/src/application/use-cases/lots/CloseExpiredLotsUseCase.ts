import { Receipt } from '../../../domain/entities/Receipt';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IReceiptRepository } from '../../../domain/repositories/IReceiptRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketEmitter } from '../../ports/IWebSocketEmitter';
import crypto from 'node:crypto';

export class CloseExpiredLotsUseCase {
  constructor(
    private lotRepository: ILotRepository,
    private userRepository: IUserRepository,
    private receiptRepository: IReceiptRepository,
    private websocketEmitter: IWebSocketEmitter
  ) { }

  async execute() {
    const expiredLots = await this.lotRepository.findExpiredLiveLots();
    const closedLots = [];

    for (const lot of expiredLots) {
      lot.close();
      await this.lotRepository.update(lot);

      if (lot.currentLeaderId && lot.currentPrice > 0) {
        const winner = await this.userRepository.findById(lot.currentLeaderId);
        const auctioneer = await this.userRepository.findById(lot.auctioneerId);

        if (winner && auctioneer) {
          winner.debitCommitted(lot.currentPrice);
          auctioneer.credit(lot.currentPrice);

          await this.userRepository.update(winner);
          await this.userRepository.update(auctioneer);

          const receipt = new Receipt({
            id: crypto.randomUUID(),
            lotId: lot.id,
            winnerId: winner.id,
            finalAmount: lot.currentPrice,
            shareToken: crypto.randomUUID(),
            createdAt: new Date()
          });

          await this.receiptRepository.create(receipt);

          this.websocketEmitter.emitToUser(winner.id, 'wallet_updated', {
            totalBalance: winner.totalBalance,
            committedBalance: winner.committedBalance,
            availableBalance: winner.availableBalance
          });

          this.websocketEmitter.emitToUser(auctioneer.id, 'wallet_updated', {
            totalBalance: auctioneer.totalBalance,
            committedBalance: auctioneer.committedBalance,
            availableBalance: auctioneer.availableBalance
          });

          this.websocketEmitter.emitToLot(lot.id, 'lot_closed', {
            lotId: lot.id,
            winnerId: receipt.maskedWinnerId,
            finalAmount: receipt.finalAmount,
            receiptToken: receipt.shareToken
          });
        }
      } else {
        this.websocketEmitter.emitToLot(lot.id, 'lot_closed', {
          lotId: lot.id,
          winnerId: null,
          finalAmount: 0
        });
      }

      this.websocketEmitter.broadcast('lot_updated', lot.toJSON());
      closedLots.push(lot.toJSON());
    }

    return closedLots;
  }
}

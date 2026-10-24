import { ForbiddenError, NotFoundError, ValidationError } from '../../../domain/errors/DomainError';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketEmitter } from '../../ports/IWebSocketEmitter';

export interface CancelLotDTO {
  lotId: string;
  auctioneerId: string;
}

export class CancelLotUseCase {
  constructor(
    private lotRepository: ILotRepository,
    private userRepository: IUserRepository,
    private websocketEmitter: IWebSocketEmitter
  ) { }

  async execute(dto: CancelLotDTO) {
    const lot = await this.lotRepository.findById(dto.lotId);
    if (!lot) {
      throw new NotFoundError('Lote não encontrado');
    }

    if (lot.auctioneerId !== dto.auctioneerId) {
      throw new ForbiddenError('Apenas o leiloeiro proprietário pode cancelar este lote');
    }

    if (lot.status === 'ENCERRADO') {
      throw new ValidationError('Lotes já encerrados não podem ser cancelados');
    }

    if (lot.status === 'CANCELADO') {
      throw new ValidationError('Lote já se encontra cancelado');
    }

    if (lot.currentLeaderId && lot.currentPrice > 0) {
      const leader = await this.userRepository.findById(lot.currentLeaderId);
      if (leader) {
        leader.releaseCommittedBalance(lot.currentPrice);
        await this.userRepository.update(leader);

        this.websocketEmitter.emitToUser(leader.id, 'wallet_updated', {
          totalBalance: leader.totalBalance,
          committedBalance: leader.committedBalance,
          availableBalance: leader.availableBalance,
          refundReason: `Lote ${lot.title} cancelado pelo leiloeiro`
        });
      }
    }

    lot.cancel();
    const updatedLot = await this.lotRepository.update(lot);

    this.websocketEmitter.emitToLot(lot.id, 'lot_canceled', {
      lotId: lot.id,
      title: lot.title
    });

    this.websocketEmitter.broadcast('lot_updated', updatedLot.toJSON());

    return updatedLot.toJSON();
  }
}

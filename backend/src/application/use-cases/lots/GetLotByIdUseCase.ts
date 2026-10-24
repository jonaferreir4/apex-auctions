import { NotFoundError } from '../../../domain/errors/DomainError';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';

export class GetLotByIdUseCase {
  constructor(private lotRepository: ILotRepository) { }

  async execute(lotId: string) {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundError('Lote não encontrado');
    }

    const now = new Date();
    const prevStatus = lot.status;
    lot.syncStatusWithTime(now);

    if (prevStatus !== lot.status) {
      await this.lotRepository.update(lot);
    }

    return lot.toJSON();
  }
}

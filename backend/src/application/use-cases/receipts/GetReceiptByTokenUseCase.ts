import { NotFoundError } from '../../../domain/errors/DomainError';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IReceiptRepository } from '../../../domain/repositories/IReceiptRepository';

export class GetReceiptByTokenUseCase {
  constructor(
    private receiptRepository: IReceiptRepository,
    private lotRepository: ILotRepository
  ) { }

  async execute(shareToken: string) {
    const receipt = await this.receiptRepository.findByShareToken(shareToken);
    if (!receipt) {
      throw new NotFoundError('Comprovante de arremate não encontrado');
    }

    const lot = await this.lotRepository.findById(receipt.lotId);

    return {
      receipt: receipt.toJSON(true),
      lot: lot ? lot.toJSON() : null
    };
  }
}

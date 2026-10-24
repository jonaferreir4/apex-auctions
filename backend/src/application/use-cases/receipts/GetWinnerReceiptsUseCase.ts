import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IReceiptRepository } from '../../../domain/repositories/IReceiptRepository';

export class GetWinnerReceiptsUseCase {
  constructor(
    private receiptRepository: IReceiptRepository,
    private lotRepository: ILotRepository
  ) { }

  async execute(winnerId: string) {
    const receipts = await this.receiptRepository.findByWinnerId(winnerId);
    const result = [];

    for (const receipt of receipts) {
      const lot = await this.lotRepository.findById(receipt.lotId);
      result.push({
        receipt: receipt.toJSON(false),
        lot: lot ? lot.toJSON() : null
      });
    }

    return result;
  }
}

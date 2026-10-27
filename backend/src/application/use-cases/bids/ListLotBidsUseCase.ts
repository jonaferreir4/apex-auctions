import { IBidRepository } from '../../../domain/repositories/IBidRepository';

export class ListLotBidsUseCase {
  constructor(private bidRepository: IBidRepository) { }

  async execute(lotId: string, maskBidders = true, limit?: number) {
    const bids = await this.bidRepository.findByLotId(lotId);
    const sorted = [...bids].reverse();
    const sliced = limit ? sorted.slice(0, limit) : sorted;
    return sliced.map(bid => bid.toJSON(maskBidders));
  }
}

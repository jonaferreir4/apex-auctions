import { IBidRepository } from '../../../domain/repositories/IBidRepository';

export class ListLotBidsUseCase {
  constructor(private bidRepository: IBidRepository) { }

  async execute(lotId: string, maskBidders = true) {
    const bids = await this.bidRepository.findByLotId(lotId);
    return bids.map(bid => bid.toJSON(maskBidders));
  }
}

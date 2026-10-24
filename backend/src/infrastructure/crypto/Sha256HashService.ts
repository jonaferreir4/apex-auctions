import crypto from 'node:crypto';
import { IHashService } from '../../application/ports/IHashService';

export class Sha256HashService implements IHashService {
  generateGenesisHash(lotId: string): string {
    return crypto
      .createHash('sha256')
      .update(`GENESIS_LOT_${lotId}`)
      .digest('hex');
  }

  calculateBidHash(
    previousHash: string,
    bidId: string,
    lotId: string,
    bidderId: string,
    amount: number,
    createdAt: Date
  ): string {
    const serializedTime = new Date(createdAt).toISOString();
    const payload = `${previousHash}:${bidId}:${lotId}:${bidderId}:${amount.toFixed(2)}:${serializedTime}`;

    return crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex');
  }
}

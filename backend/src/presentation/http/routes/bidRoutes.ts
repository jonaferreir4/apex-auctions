import { Router } from 'express';
import { BidController } from '../controllers/BidController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createBidRoutes(bidController: BidController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/:id/bids', authMiddleware, bidController.placeBid);
  router.get('/:id/bids', bidController.listBids);
  router.get('/:id/audit', bidController.verifyAudit);

  return router;
}

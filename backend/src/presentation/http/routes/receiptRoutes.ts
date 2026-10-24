import { Router } from 'express';
import { ReceiptController } from '../controllers/ReceiptController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createReceiptRoutes(receiptController: ReceiptController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.get('/share/:token', receiptController.getByToken);
  router.get('/me', authMiddleware, receiptController.getMyReceipts);

  return router;
}

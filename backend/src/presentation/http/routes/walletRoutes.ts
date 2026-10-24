import { Router } from 'express';
import { WalletController } from '../controllers/WalletController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createWalletRoutes(walletController: WalletController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.use(authMiddleware);
  router.get('/', walletController.getBalance);
  router.post('/deposit', walletController.deposit);

  return router;
}

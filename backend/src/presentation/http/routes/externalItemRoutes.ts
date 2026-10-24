import { Router } from 'express';
import { ExternalItemController } from '../controllers/ExternalItemController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createExternalItemRoutes(
  externalItemController: ExternalItemController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.get('/search', authMiddleware, externalItemController.search);

  return router;
}

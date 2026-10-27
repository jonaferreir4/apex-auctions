import { Router } from 'express';
import { LotController } from '../controllers/LotController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createLotRoutes(lotController: LotController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.get('/', lotController.list);
  router.get('/categories', lotController.getCategories);
  router.get('/my-lots', authMiddleware, lotController.getMyLots);
  router.get('/:id', lotController.getById);
  router.post('/', authMiddleware, lotController.create);
  router.post('/:id/cancel', authMiddleware, lotController.cancel);

  return router;
}

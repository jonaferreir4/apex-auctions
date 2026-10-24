import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createAuthRoutes(authController: AuthController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authMiddleware, authController.me);

  return router;
}

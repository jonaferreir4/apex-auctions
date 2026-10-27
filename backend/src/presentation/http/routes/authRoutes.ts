import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { authRateLimiter } from '../middlewares/rateLimiterMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createAuthRoutes(authController: AuthController, tokenService: ITokenService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/register', authRateLimiter, authController.register);
  router.post('/login', authRateLimiter, authController.login);
  router.get('/me', authMiddleware, authController.me);

  return router;
}

import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { buildContainer } from './container';
import { createAuthRoutes } from '../presentation/http/routes/authRoutes';
import { createLotRoutes } from '../presentation/http/routes/lotRoutes';
import { createBidRoutes } from '../presentation/http/routes/bidRoutes';
import { createWalletRoutes } from '../presentation/http/routes/walletRoutes';
import { createReceiptRoutes } from '../presentation/http/routes/receiptRoutes';
import { createExternalItemRoutes } from '../presentation/http/routes/externalItemRoutes';
import { errorHandlerMiddleware } from '../presentation/http/middlewares/errorHandlerMiddleware';
import { globalRateLimiter } from '../presentation/http/middlewares/rateLimiterMiddleware';

import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../presentation/http/docs/swaggerDocument';

export function createApp(container: ReturnType<typeof buildContainer>): Express {
  const app = express();

  app.set('trust proxy', 1);

  app.use(cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true
  }));

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', globalRateLimiter);

  const { controllers, tokenService } = container;

  app.use('/api/auth', createAuthRoutes(controllers.auth, tokenService));
  app.use('/api/lots', createLotRoutes(controllers.lot, tokenService));
  app.use('/api/lots', createBidRoutes(controllers.bid, tokenService));
  app.use('/api/wallet', createWalletRoutes(controllers.wallet, tokenService));
  app.use('/api/receipts', createReceiptRoutes(controllers.receipt, tokenService));
  app.use('/api/items', createExternalItemRoutes(controllers.externalItem, tokenService));

  app.use(errorHandlerMiddleware);

  return app;
}

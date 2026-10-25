import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../infrastructure/database/prisma/prismaClient';
import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaLotRepository } from '../infrastructure/database/repositories/PrismaLotRepository';
import { PrismaBidRepository } from '../infrastructure/database/repositories/PrismaBidRepository';
import { PrismaReceiptRepository } from '../infrastructure/database/repositories/PrismaReceiptRepository';
import { Sha256HashService } from '../infrastructure/crypto/Sha256HashService';
import { BcryptPasswordHasher } from '../infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastructure/auth/JwtTokenService';
import { DummyJsonItemGateway } from '../infrastructure/gateways/DummyJsonItemGateway';
import { SocketIOEmitter } from '../infrastructure/websocket/SocketIOEmitter';
import { env } from './config/env';

import { RegisterUserUseCase } from '../application/use-cases/auth/RegisterUserUseCase';
import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase';
import { GetProfileUseCase } from '../application/use-cases/auth/GetProfileUseCase';
import { CreateLotUseCase } from '../application/use-cases/lots/CreateLotUseCase';
import { ListLotsUseCase } from '../application/use-cases/lots/ListLotsUseCase';
import { GetLotByIdUseCase } from '../application/use-cases/lots/GetLotByIdUseCase';
import { CancelLotUseCase } from '../application/use-cases/lots/CancelLotUseCase';
import { CloseExpiredLotsUseCase } from '../application/use-cases/lots/CloseExpiredLotsUseCase';
import { PlaceBidUseCase } from '../application/use-cases/bids/PlaceBidUseCase';
import { ListLotBidsUseCase } from '../application/use-cases/bids/ListLotBidsUseCase';
import { VerifyLotAuditUseCase } from '../application/use-cases/bids/VerifyLotAuditUseCase';
import { DepositBalanceUseCase } from '../application/use-cases/wallet/DepositBalanceUseCase';
import { GetWalletBalanceUseCase } from '../application/use-cases/wallet/GetWalletBalanceUseCase';
import { GetReceiptByTokenUseCase } from '../application/use-cases/receipts/GetReceiptByTokenUseCase';
import { GetWinnerReceiptsUseCase } from '../application/use-cases/receipts/GetWinnerReceiptsUseCase';
import { SearchExternalItemsUseCase } from '../application/use-cases/external/SearchExternalItemsUseCase';

import { AuthController } from '../presentation/http/controllers/AuthController';
import { LotController } from '../presentation/http/controllers/LotController';
import { BidController } from '../presentation/http/controllers/BidController';
import { WalletController } from '../presentation/http/controllers/WalletController';
import { ReceiptController } from '../presentation/http/controllers/ReceiptController';
import { ExternalItemController } from '../presentation/http/controllers/ExternalItemController';

export function buildContainer(io: SocketIOServer) {
  const userRepository = new PrismaUserRepository(prisma);
  const lotRepository = new PrismaLotRepository(prisma);
  const bidRepository = new PrismaBidRepository(prisma);
  const receiptRepository = new PrismaReceiptRepository(prisma);

  const hashService = new Sha256HashService();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.JWT_SECRET);
  const itemGateway = new DummyJsonItemGateway();
  const websocketEmitter = new SocketIOEmitter(io);

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher, tokenService);
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
  const getProfileUseCase = new GetProfileUseCase(userRepository);

  const createLotUseCase = new CreateLotUseCase(lotRepository, userRepository, websocketEmitter);
  const listLotsUseCase = new ListLotsUseCase(lotRepository);
  const getLotByIdUseCase = new GetLotByIdUseCase(lotRepository);
  const cancelLotUseCase = new CancelLotUseCase(lotRepository, userRepository, websocketEmitter);
  const closeExpiredLotsUseCase = new CloseExpiredLotsUseCase(
    lotRepository,
    userRepository,
    receiptRepository,
    websocketEmitter
  );

  const placeBidUseCase = new PlaceBidUseCase(
    lotRepository,
    userRepository,
    bidRepository,
    hashService,
    websocketEmitter
  );
  const listLotBidsUseCase = new ListLotBidsUseCase(bidRepository);
  const verifyLotAuditUseCase = new VerifyLotAuditUseCase(lotRepository, bidRepository, hashService);

  const depositBalanceUseCase = new DepositBalanceUseCase(userRepository, websocketEmitter);
  const getWalletBalanceUseCase = new GetWalletBalanceUseCase(userRepository);

  const getReceiptByTokenUseCase = new GetReceiptByTokenUseCase(receiptRepository, lotRepository);
  const getWinnerReceiptsUseCase = new GetWinnerReceiptsUseCase(receiptRepository, lotRepository);

  const searchExternalItemsUseCase = new SearchExternalItemsUseCase(itemGateway);

  const authController = new AuthController(registerUserUseCase, loginUseCase, getProfileUseCase);
  const lotController = new LotController(createLotUseCase, listLotsUseCase, getLotByIdUseCase, cancelLotUseCase);
  const bidController = new BidController(placeBidUseCase, listLotBidsUseCase, verifyLotAuditUseCase);
  const walletController = new WalletController(getWalletBalanceUseCase, depositBalanceUseCase);
  const receiptController = new ReceiptController(getReceiptByTokenUseCase, getWinnerReceiptsUseCase);
  const externalItemController = new ExternalItemController(searchExternalItemsUseCase);

  return {
    tokenService,
    controllers: {
      auth: authController,
      lot: lotController,
      bid: bidController,
      wallet: walletController,
      receipt: receiptController,
      externalItem: externalItemController
    },
    useCases: {
      closeExpiredLots: closeExpiredLotsUseCase
    }
  };
}

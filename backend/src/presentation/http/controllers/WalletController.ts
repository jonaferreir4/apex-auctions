import { Response, NextFunction } from 'express';
import { GetWalletBalanceUseCase } from '../../../application/use-cases/wallet/GetWalletBalanceUseCase';
import { DepositBalanceUseCase } from '../../../application/use-cases/wallet/DepositBalanceUseCase';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class WalletController {
  constructor(
    private getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private depositBalanceUseCase: DepositBalanceUseCase
  ) { }

  getBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const balance = await this.getWalletBalanceUseCase.execute(userId);
      return res.status(200).json(balance);
    } catch (err) {
      next(err);
    }
  };

  deposit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { amount } = req.body;
      const result = await this.depositBalanceUseCase.execute({
        userId,
        amount: Number(amount)
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

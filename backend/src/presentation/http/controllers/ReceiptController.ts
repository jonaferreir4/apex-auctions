import { Response, NextFunction } from 'express';
import { GetReceiptByTokenUseCase } from '../../../application/use-cases/receipts/GetReceiptByTokenUseCase';
import { GetWinnerReceiptsUseCase } from '../../../application/use-cases/receipts/GetWinnerReceiptsUseCase';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class ReceiptController {
  constructor(
    private getReceiptByTokenUseCase: GetReceiptByTokenUseCase,
    private getWinnerReceiptsUseCase: GetWinnerReceiptsUseCase
  ) { }

  getByToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.getReceiptByTokenUseCase.execute(req.params.token);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getMyReceipts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const winnerId = req.user?.userId;
      if (!winnerId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const receipts = await this.getWinnerReceiptsUseCase.execute(winnerId);
      return res.status(200).json(receipts);
    } catch (err) {
      next(err);
    }
  };
}

import { Response, NextFunction } from 'express';
import { PlaceBidUseCase } from '../../../application/use-cases/bids/PlaceBidUseCase';
import { ListLotBidsUseCase } from '../../../application/use-cases/bids/ListLotBidsUseCase';
import { VerifyLotAuditUseCase } from '../../../application/use-cases/bids/VerifyLotAuditUseCase';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class BidController {
  constructor(
    private placeBidUseCase: PlaceBidUseCase,
    private listLotBidsUseCase: ListLotBidsUseCase,
    private verifyLotAuditUseCase: VerifyLotAuditUseCase
  ) { }

  placeBid = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const bidderId = req.user?.userId;
      if (!bidderId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { amount } = req.body;
      const result = await this.placeBidUseCase.execute({
        lotId: req.params.id,
        bidderId,
        amount: Number(amount)
      });

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  listBids = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const bids = await this.listLotBidsUseCase.execute(req.params.id, true);
      return res.status(200).json(bids);
    } catch (err) {
      next(err);
    }
  };

  verifyAudit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auditReport = await this.verifyLotAuditUseCase.execute(req.params.id);
      return res.status(200).json(auditReport);
    } catch (err) {
      next(err);
    }
  };
}

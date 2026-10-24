import { Response, NextFunction } from 'express';
import { CreateLotUseCase } from '../../../application/use-cases/lots/CreateLotUseCase';
import { ListLotsUseCase } from '../../../application/use-cases/lots/ListLotsUseCase';
import { GetLotByIdUseCase } from '../../../application/use-cases/lots/GetLotByIdUseCase';
import { CancelLotUseCase } from '../../../application/use-cases/lots/CancelLotUseCase';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { LotStatus } from '../../../domain/entities/Lot';

export class LotController {
  constructor(
    private createLotUseCase: CreateLotUseCase,
    private listLotsUseCase: ListLotsUseCase,
    private getLotByIdUseCase: GetLotByIdUseCase,
    private cancelLotUseCase: CancelLotUseCase
  ) { }

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auctioneerId = req.user?.userId;
      if (!auctioneerId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const lot = await this.createLotUseCase.execute({
        ...req.body,
        auctioneerId
      });

      return res.status(201).json(lot);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, category, search, auctioneerId, excludeCanceled } = req.query;

      const lots = await this.listLotsUseCase.execute({
        status: status as LotStatus | undefined,
        category: category as string | undefined,
        search: search as string | undefined,
        auctioneerId: auctioneerId as string | undefined,
        excludeCanceled: excludeCanceled !== 'false'
      });

      return res.status(200).json(lots);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const lot = await this.getLotByIdUseCase.execute(req.params.id);
      return res.status(200).json(lot);
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auctioneerId = req.user?.userId;
      if (!auctioneerId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const lot = await this.cancelLotUseCase.execute({
        lotId: req.params.id,
        auctioneerId
      });

      return res.status(200).json(lot);
    } catch (err) {
      next(err);
    }
  };

  getMyLots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auctioneerId = req.user?.userId;
      if (!auctioneerId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const lots = await this.listLotsUseCase.execute({
        auctioneerId,
        excludeCanceled: false
      });

      return res.status(200).json(lots);
    } catch (err) {
      next(err);
    }
  };
}

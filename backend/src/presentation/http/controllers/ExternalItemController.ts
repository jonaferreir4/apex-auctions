import { Request, Response, NextFunction } from 'express';
import { SearchExternalItemsUseCase } from '../../../application/use-cases/external/SearchExternalItemsUseCase';

export class ExternalItemController {
  constructor(private searchExternalItemsUseCase: SearchExternalItemsUseCase) { }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string | undefined;
      const items = await this.searchExternalItemsUseCase.execute(query);
      return res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  };
}

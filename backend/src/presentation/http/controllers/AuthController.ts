import { Response, NextFunction } from 'express';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { GetProfileUseCase } from '../../../application/use-cases/auth/GetProfileUseCase';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase,
    private getProfileUseCase: GetProfileUseCase
  ) { }

  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Não autorizado' });
      }
      const profile = await this.getProfileUseCase.execute(req.user.userId);
      return res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  };
}

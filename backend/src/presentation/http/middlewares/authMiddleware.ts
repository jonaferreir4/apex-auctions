import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../application/ports/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/DomainError';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token de autenticação não fornecido'));
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = tokenService.verify(token);
      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}

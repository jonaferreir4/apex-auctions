import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/DomainError';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: err.constructor.name
    });
  }

  console.error('Unhandled server error:', err);

  if (typeof res.status === 'function') {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      type: 'InternalServerError'
    });
  }

  next(err);
}

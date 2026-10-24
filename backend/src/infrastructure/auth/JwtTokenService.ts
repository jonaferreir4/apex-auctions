import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/ports/ITokenService';
import { UnauthorizedError } from '../../domain/errors/DomainError';

export class JwtTokenService implements ITokenService {
  constructor(private secretKey: string, private expiresIn: string = '7d') { }

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn as any });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return { userId: decoded.userId, role: decoded.role };
    } catch {
      throw new UnauthorizedError('Token de autenticação inválido ou expirado');
    }
  }
}

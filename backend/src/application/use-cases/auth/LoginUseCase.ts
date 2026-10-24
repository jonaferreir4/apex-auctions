import { UnauthorizedError, ValidationError } from '../../../domain/errors/DomainError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../ports/IPasswordHasher';
import { ITokenService } from '../../ports/ITokenService';
import { AuthResultDTO } from './RegisterUserUseCase';

export interface LoginDTO {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) { }

  async execute(dto: LoginDTO): Promise<AuthResultDTO> {
    if (!dto.email || !dto.password) {
      throw new ValidationError('Email e senha são obrigatórios');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = this.tokenService.generate({ userId: user.id, role: user.role });

    return {
      user: user.toJSON(),
      token
    };
  }
}

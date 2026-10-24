import { User, UserRole } from '../../../domain/entities/User';
import { ConflictError, ValidationError } from '../../../domain/errors/DomainError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../ports/IPasswordHasher';
import { ITokenService } from '../../ports/ITokenService';
import crypto from 'node:crypto';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResultDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    totalBalance: number;
    committedBalance: number;
    availableBalance: number;
  };
  token: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) { }

  async execute(dto: RegisterDTO): Promise<AuthResultDTO> {
    if (!dto.name || !dto.email || !dto.password) {
      throw new ValidationError('Nome, email e senha são obrigatórios');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError('Email já cadastrado');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const now = new Date();

    const user = new User({
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'LICITANTE',
      totalBalance: dto.role === 'LICITANTE' ? 1000 : 0,
      committedBalance: 0,
      createdAt: now,
      updatedAt: now
    });

    const savedUser = await this.userRepository.create(user);
    const token = this.tokenService.generate({ userId: savedUser.id, role: savedUser.role });

    return {
      user: savedUser.toJSON(),
      token
    };
  }
}

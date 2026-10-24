import { ForbiddenError, NotFoundError, ValidationError } from '../../../domain/errors/DomainError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketEmitter } from '../../ports/IWebSocketEmitter';

export interface DepositDTO {
  userId: string;
  amount: number;
}

export class DepositBalanceUseCase {
  constructor(
    private userRepository: IUserRepository,
    private websocketEmitter: IWebSocketEmitter
  ) { }

  async execute(dto: DepositDTO) {
    if (!dto.amount || dto.amount <= 0) {
      throw new ValidationError('O valor de depósito deve ser maior que zero');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (user.isAuctioneer()) {
      throw new ForbiddenError('Leiloeiros não possuem carteira de lances');
    }

    user.deposit(dto.amount);
    const updatedUser = await this.userRepository.update(user);

    this.websocketEmitter.emitToUser(user.id, 'wallet_updated', {
      totalBalance: updatedUser.totalBalance,
      committedBalance: updatedUser.committedBalance,
      availableBalance: updatedUser.availableBalance
    });

    return {
      totalBalance: updatedUser.totalBalance,
      committedBalance: updatedUser.committedBalance,
      availableBalance: updatedUser.availableBalance
    };
  }
}

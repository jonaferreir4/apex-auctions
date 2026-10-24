import { NotFoundError } from '../../../domain/errors/DomainError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class GetWalletBalanceUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return {
      totalBalance: user.totalBalance,
      committedBalance: user.committedBalance,
      availableBalance: user.availableBalance
    };
  }
}

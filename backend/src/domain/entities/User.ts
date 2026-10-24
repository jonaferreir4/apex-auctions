export type UserRole = 'LEILOEIRO' | 'LICITANTE';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  totalBalance: number;
  committedBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get totalBalance(): number {
    return this.props.totalBalance;
  }

  get committedBalance(): number {
    return this.props.committedBalance;
  }

  get availableBalance(): number {
    return Math.max(0, this.props.totalBalance - this.props.committedBalance);
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isAuctioneer(): boolean {
    return this.props.role === 'LEILOEIRO';
  }

  isBidder(): boolean {
    return this.props.role === 'LICITANTE';
  }

  canAfford(amount: number): boolean {
    return this.availableBalance >= amount;
  }

  commitBalance(amount: number): void {
    if (!this.canAfford(amount)) {
      throw new Error('Saldo disponível insuficiente para comprometer');
    }
    this.props.committedBalance += amount;
    this.props.updatedAt = new Date();
  }

  releaseCommittedBalance(amount: number): void {
    this.props.committedBalance = Math.max(0, this.props.committedBalance - amount);
    this.props.updatedAt = new Date();
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Valor de depósito deve ser positivo');
    }
    this.props.totalBalance += amount;
    this.props.updatedAt = new Date();
  }

  debitCommitted(amount: number): void {
    this.props.committedBalance = Math.max(0, this.props.committedBalance - amount);
    this.props.totalBalance = Math.max(0, this.props.totalBalance - amount);
    this.props.updatedAt = new Date();
  }

  credit(amount: number): void {
    this.props.totalBalance += amount;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      totalBalance: this.totalBalance,
      committedBalance: this.committedBalance,
      availableBalance: this.availableBalance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

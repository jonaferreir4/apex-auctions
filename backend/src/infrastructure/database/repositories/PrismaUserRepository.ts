import { PrismaClient } from '@prisma/client';
import { User, UserRole } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) { }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        totalBalance: user.totalBalance,
        committedBalance: user.committedBalance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    return this.mapToDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        totalBalance: user.totalBalance,
        committedBalance: user.committedBalance,
        updatedAt: user.updatedAt
      }
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    totalBalance: number;
    committedBalance: number;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as UserRole,
      totalBalance: data.totalBalance,
      committedBalance: data.committedBalance,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

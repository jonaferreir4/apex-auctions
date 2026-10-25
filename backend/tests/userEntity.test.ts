import { describe, it, expect } from 'vitest';
import { User } from '../src/domain/entities/User';

describe('Entidade de Domínio User', () => {
  it('deve calcular saldo disponível corretamente', () => {
    const user = new User({
      id: 'usr-1',
      name: 'João Teste',
      email: 'joao@test.com',
      password: 'hash',
      role: 'LICITANTE',
      totalBalance: 1000,
      committedBalance: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    expect(user.availableBalance).toBe(700);
  });

  it('deve comprometer saldo disponível', () => {
    const user = new User({
      id: 'usr-1',
      name: 'João Teste',
      email: 'joao@test.com',
      password: 'hash',
      role: 'LICITANTE',
      totalBalance: 1000,
      committedBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.commitBalance(400);
    expect(user.committedBalance).toBe(400);
    expect(user.availableBalance).toBe(600);
  });

  it('deve liberar saldo comprometido após ser superado', () => {
    const user = new User({
      id: 'usr-1',
      name: 'João Teste',
      email: 'joao@test.com',
      password: 'hash',
      role: 'LICITANTE',
      totalBalance: 1000,
      committedBalance: 400,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.releaseCommittedBalance(400);
    expect(user.committedBalance).toBe(0);
    expect(user.availableBalance).toBe(1000);
  });

  it('deve adicionar saldo com depósito', () => {
    const user = new User({
      id: 'usr-1',
      name: 'João Teste',
      email: 'joao@test.com',
      password: 'hash',
      role: 'LICITANTE',
      totalBalance: 1000,
      committedBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.deposit(500);
    expect(user.totalBalance).toBe(1500);
    expect(user.availableBalance).toBe(1500);
  });

  it('deve debitar saldo comprometido na liquidação do leilão', () => {
    const user = new User({
      id: 'usr-1',
      name: 'João Teste',
      email: 'joao@test.com',
      password: 'hash',
      role: 'LICITANTE',
      totalBalance: 1000,
      committedBalance: 600,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.debitCommitted(600);
    expect(user.committedBalance).toBe(0);
    expect(user.totalBalance).toBe(400);
    expect(user.availableBalance).toBe(400);
  });
});

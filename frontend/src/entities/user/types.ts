export type UserRole = 'LEILOEIRO' | 'LICITANTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  totalBalance: number;
  committedBalance: number;
  availableBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

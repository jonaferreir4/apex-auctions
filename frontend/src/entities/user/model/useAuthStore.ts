import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authenticateSocket, disconnectSocket } from '@/shared/socket/socketClient';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const getInitialAuth = () => {
  const legacyToken = localStorage.getItem('@leilao:token');
  const legacyUser = localStorage.getItem('@leilao:user');
  if (legacyToken && legacyUser) {
    try {
      return {
        user: JSON.parse(legacyUser),
        token: legacyToken,
        isAuthenticated: true
      };
    } catch {
      return {
        user: null,
        token: null,
        isAuthenticated: false
      };
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

const initial = getInitialAuth();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: initial.user,
      token: initial.token,
      isAuthenticated: initial.isAuthenticated,
      setAuth: (user, token) => {
        localStorage.setItem('@leilao:token', token);
        localStorage.setItem('@leilao:user', JSON.stringify(user));
        authenticateSocket(token);
        set({ user, token, isAuthenticated: true });
      },
      setUser: (user) => {
        localStorage.setItem('@leilao:user', JSON.stringify(user));
        set({ user });
      },
      logout: () => {
        localStorage.removeItem('@leilao:token');
        localStorage.removeItem('@leilao:user');
        disconnectSocket();
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: '@leilao:auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: Boolean(state.token && state.user)
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          authenticateSocket(state.token);
        }
      }
    }
  )
);

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: false,
    logout
  };
}

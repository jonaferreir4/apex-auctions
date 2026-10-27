import React, { useEffect } from 'react';
import { useAuthStore, useAuth } from '@/entities/user/model/useAuthStore';
import { useProfileQuery, USER_QUERY_KEY } from '@/entities/user/model/useUserQueries';
import { useQueryClient } from '@tanstack/react-query';

export { useAuth } from '@/entities/user/model/useAuthStore';
export type { AuthState } from '@/entities/user/model/useAuthStore';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data: profileUser, isError } = useProfileQuery(Boolean(token));

  useEffect(() => {
    if (profileUser) {
      setUser(profileUser);
    }
  }, [profileUser, setUser]);

  useEffect(() => {
    if (isError && token) {
      logout();
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ['wallet'] });
    }
  }, [isError, token, logout, queryClient]);

  return <>{children}</>;
}

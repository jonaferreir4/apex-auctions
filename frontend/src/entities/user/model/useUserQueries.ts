import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/userService';
import { LoginDTO, RegisterDTO } from '../types';
import { authenticateSocket } from '@/shared/socket/socketClient';

export const USER_QUERY_KEY = ['user', 'profile'] as const;

export function useProfileQuery(tokenAvailable: boolean) {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: userService.getProfile,
    enabled: tokenAvailable,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDTO) => userService.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('@leilao:token', data.token);
      localStorage.setItem('@leilao:user', JSON.stringify(data.user));
      authenticateSocket(data.token);
      queryClient.setQueryData(USER_QUERY_KEY, data.user);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    }
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDTO) => userService.register(data),
    onSuccess: (data) => {
      localStorage.setItem('@leilao:token', data.token);
      localStorage.setItem('@leilao:user', JSON.stringify(data.user));
      authenticateSocket(data.token);
      queryClient.setQueryData(USER_QUERY_KEY, data.user);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    }
  });
}

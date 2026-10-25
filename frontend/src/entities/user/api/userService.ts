import { httpClient } from '@/shared/api/httpClient';
import { AuthResponse, LoginDTO, RegisterDTO, User } from '../types';

export const userService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await httpClient.get<User>('/auth/me');
    return response.data;
  }
};

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const cleanOrigin = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const httpClient = axios.create({
  baseURL: `${cleanOrigin}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Erro inesperado na requisição';
    return Promise.reject(new Error(message));
  }
);

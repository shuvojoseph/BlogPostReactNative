import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  const { token, refreshToken } = response.data;

  await AsyncStorage.setItem('accessToken', token);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return response.data;
};

export const register = (data: any) => {
  return apiClient.post('/api/auth/register', data);
};

export const logout = async () => {
  await apiClient.post('/api/auth/logout');
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};

/*
import apiClient from './apiClient';
import { LoginPayload, RegisterPayload, TokenResponse } from '../models/auth';

const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await apiClient.post('/api/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<TokenResponse & { user?: any }> => {
    const res = await apiClient.post('/api/auth/login', payload);
    return res.data;
  },

  refreshToken: async (payload: { token: string; refreshToken: string; }) => {
    const res = await apiClient.post('/api/auth/refresh-token', payload);
    return res.data; // { token, refreshToken }
  },

  logout: async () => {
    const res = await apiClient.post('/api/auth/logout');
    return res.data;
  }
};

export default authService;
*/

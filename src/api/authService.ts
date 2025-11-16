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
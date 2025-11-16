import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Config from '../config';
import { storage } from '../utils/storage';

const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    //const token = await AsyncStorage.getItem('accessToken');
    const token = await storage.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any; // ✅ safe override due to typing mismatch
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
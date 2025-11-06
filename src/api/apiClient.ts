import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

/*
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Config from '../config';
import { storage } from '../utils/storage';
import authService from './authService';

const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else {
      if (token && prom.config.headers) prom.config.headers['Authorization'] = `Bearer ${token}`;
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
};

// request interceptor to attach token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken();
    if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor to handle 401 + refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        })
          .then((cfg: AxiosRequestConfig) => apiClient.request(cfg))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const res = await authService.refreshToken({ token: await storage.getAccessToken() || '', refreshToken });
        const newToken = res.token;
        const newRefresh = res.refreshToken;

        await storage.setAccessToken(newToken);
        await storage.setRefreshToken(newRefresh);

        processQueue(null, newToken);
        isRefreshing = false;

        if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient.request(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // optionally clear storage and navigate to login
        await storage.clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
*/

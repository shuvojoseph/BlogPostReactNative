import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authService from '../api/authService';
import { storage } from '../utils/storage';
import { LoginPayload, RegisterPayload } from '../models/auth';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await storage.getUser();
      const token = await storage.getAccessToken();
      if (storedUser && token) setUser(storedUser);
      setLoading(false);
    })();
  }, []);

  /*
  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload.email,payload.password);
    if (res.token && res.refreshToken) {
      await storage.setAccessToken(res.token);
      await storage.setRefreshToken(res.refreshToken);
      if (res.user) {
        await storage.setUser(res.user);
        setUser(res.user);
      }
    }
  };
*/
/*
  const login = async (payload: LoginPayload) => {
    try {
      const response = await authService.login(payload.email, payload.password);
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
    } catch (error) {
      throw error;
    }
  };
  */

  const login = async (payload: LoginPayload) => {
  try {
    // authService.login already returns the parsed response body (res.data).
    // We should not use response.data here unless authService returns the raw axios response.
    const res = await authService.login(payload.email, payload.password);

    // expected shape: { token: string, refreshToken: string, user?: { ... } }
    const token = res.token ?? res.accessToken ?? null;
    const refreshToken = res.refreshToken ?? null;
    const userFromApi = res.user ?? res;

    if (!token || !refreshToken) {
      // If backend returned 401/400, authService.login should throw.
      // But if it returned some unexpected shape, surface a clear error.
      throw new Error('Login response does not contain tokens.');
    }

    // Persist tokens + user in your storage wrapper (used by apiClient)
    await storage.setAccessToken(token);
    await storage.setRefreshToken(refreshToken);
    
    const userFromLogin = {
      email: payload.email,
    };

    await storage.setUser(userFromLogin);
    setUser(userFromLogin);
  
    return res; 
  } catch (err: any) {
    // Normalize error so UI can show a friendly message
    // If axios threw, err.response?.data may contain useful message
    const serverMessage = err?.response?.data?.message || err?.message || 'Login failed';
    // rethrow an Error so the screen's try/catch can show it
    throw new Error(serverMessage);
  }
};

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
  };
  
  
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {   }
    await storage.clearTokens();
    await storage.setUser(null as any);
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


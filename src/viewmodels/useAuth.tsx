import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authService from '../api/authService';
import { storage } from '../utils/storage';
import { LoginPayload, RegisterPayload } from '../models/auth';

interface AuthContextType {
  user: any | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await storage.getUser();
      const token = await storage.getAccessToken();
      if (storedUser && token) setUser(storedUser);
      setLoading(false);
    })();
  }, []);

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

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
    // optionally auto-login after registration
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) { /* ignore server error */ }
    await storage.clearTokens();
    await storage.setUser(null as any);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


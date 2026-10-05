'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthResponse, getAuthUser, getAuthToken, setAuthSession, clearAuthSession, API_BASE, getRefreshToken } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read auth session from cookies on mount
    const savedUser = getAuthUser();
    const savedToken = getAuthToken();
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (authData: AuthResponse) => {
    setAuthSession(authData);
    setUser(authData.user);
    setToken(authData.accessToken);
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        console.error('Logout error on backend:', err);
      }
    }
    clearAuthSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

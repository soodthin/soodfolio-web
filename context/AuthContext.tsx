'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  AuthResponse,
  getAuthUser,
  getAuthToken,
  setAuthSession,
  clearAuthSession,
  hasSessionFlag,
  API_BASE,
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse, rememberMe?: boolean) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const authData: AuthResponse = await res.json();
        setAuthSession(authData);
        setUser(authData.user);
        setToken(authData.accessToken);
        return true;
      }
    } catch (err) {
      console.warn('Silent refresh network check failed:', err);
    }
    return false;
  }, []);

  useEffect(() => {
    // If we have an active session flag cookie, perform silent refresh to hydrate in-memory token
    const initAuth = async () => {
      const cachedUser = getAuthUser();
      const currentToken = getAuthToken();

      if (currentToken) {
        setToken(currentToken);
        if (cachedUser) setUser(cachedUser);
        setIsLoading(false);
        return;
      }

      if (hasSessionFlag()) {
        if (cachedUser) {
          setUser(cachedUser);
        }
        const refreshed = await refreshSession();
        if (!refreshed) {
          clearAuthSession();
          setUser(null);
          setToken(null);
          if (
            typeof window !== 'undefined' &&
            (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/studio'))
          ) {
            window.location.href = '/login?sessionExpired=true';
          }
        }
      } else {
        clearAuthSession();
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshSession]);

  const login = useCallback((authData: AuthResponse, rememberMe: boolean = true) => {
    setAuthSession(authData, rememberMe);
    setUser(authData.user);
    setToken(authData.accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch (err) {
      console.warn('Logout error on backend:', err);
    } finally {
      clearAuthSession();
      setUser(null);
      setToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && (!!token || hasSessionFlag()),
        isLoading,
        login,
        logout,
        refreshSession,
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

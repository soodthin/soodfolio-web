import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import {
  setAuthSession,
  getAuthToken,
  getRefreshToken,
  getAuthUser,
  clearAuthSession,
  isAuthenticated,
  AuthResponse,
} from '@/lib/auth';

vi.mock('js-cookie', () => {
  const store: Record<string, string> = {};
  return {
    default: {
      get: vi.fn((key: string) => store[key]),
      set: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      remove: vi.fn((key: string) => {
        delete store[key];
      }),
      __store: store,
    },
  };
});

describe('Auth Service (lib/auth.ts)', () => {
  const mockAuthData: AuthResponse = {
    accessToken: 'mock-access-token-xyz',
    refreshToken: 'mock-refresh-token-abc',
    tokenType: 'Bearer',
    expiresInMs: 3600000,
    user: {
      id: 'usr_123',
      email: 'alex@example.com',
      fullName: 'Alex River',
      username: 'alexriver',
      role: 'USER',
      avatarUrl: 'https://avatar.com/alex.jpg',
    },
  };

  beforeEach(() => {
    clearAuthSession();
    vi.clearAllMocks();
  });

  it('should store tokens and user profile in cookies with rememberMe=true', () => {
    setAuthSession(mockAuthData, true);

    expect(Cookies.set).toHaveBeenCalledWith(
      'soodfolio_token',
      'mock-access-token-xyz',
      expect.objectContaining({ path: '/', expires: 7 })
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      'soodfolio_refresh_token',
      'mock-refresh-token-abc',
      expect.objectContaining({ path: '/', expires: 7 })
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      'soodfolio_user',
      JSON.stringify(mockAuthData.user),
      expect.objectContaining({ path: '/', expires: 7 })
    );
  });

  it('should store session cookies without expiration if rememberMe=false', () => {
    setAuthSession(mockAuthData, false);

    expect(Cookies.set).toHaveBeenCalledWith(
      'soodfolio_token',
      'mock-access-token-xyz',
      { path: '/' }
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      'soodfolio_refresh_token',
      'mock-refresh-token-abc',
      { path: '/' }
    );
  });

  it('should retrieve auth token correctly', () => {
    setAuthSession(mockAuthData);
    expect(getAuthToken()).toBe('mock-access-token-xyz');
    expect(isAuthenticated()).toBe(true);
  });

  it('should retrieve refresh token correctly', () => {
    setAuthSession(mockAuthData);
    expect(getRefreshToken()).toBe('mock-refresh-token-abc');
  });

  it('should parse and return the authenticated user', () => {
    setAuthSession(mockAuthData);
    const user = getAuthUser();
    expect(user).toEqual(mockAuthData.user);
    expect(user?.email).toBe('alex@example.com');
  });

  it('should return null if user cookie is malformed JSON', () => {
    vi.mocked(Cookies.get).mockReturnValueOnce('{ invalid json');
    expect(getAuthUser()).toBeNull();
  });

  it('should return null if user cookie is missing', () => {
    vi.mocked(Cookies.get).mockReturnValueOnce(undefined);
    expect(getAuthUser()).toBeNull();
  });

  it('should clear all cookies upon clearAuthSession', () => {
    setAuthSession(mockAuthData);
    clearAuthSession();

    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_token', { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_refresh_token', { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_user', { path: '/' });
    expect(isAuthenticated()).toBe(false);
  });
});

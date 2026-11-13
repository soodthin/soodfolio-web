import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import {
  setAuthSession,
  getAuthToken,
  setAccessToken,
  getRefreshToken,
  getAuthUser,
  clearAuthSession,
  isAuthenticated,
  hasSessionFlag,
  SESSION_FLAG_COOKIE,
  USER_COOKIE,
  AuthResponse,
} from '@/lib/auth';

let cookieStore: Record<string, string> = {};

vi.mock('js-cookie', () => {
  return {
    default: {
      get: vi.fn((key: string) => cookieStore[key]),
      set: vi.fn((key: string, value: string) => {
        cookieStore[key] = value;
      }),
      remove: vi.fn((key: string) => {
        delete cookieStore[key];
      }),
    },
  };
});

describe('Auth Service - Hybrid Auth Architecture (lib/auth.ts)', () => {
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
    cookieStore = {};
    vi.mocked(Cookies.get).mockImplementation((key: string) => cookieStore[key]);
    vi.mocked(Cookies.set).mockImplementation((key: string, value: string) => {
      cookieStore[key] = value;
      return undefined;
    });
    vi.mocked(Cookies.remove).mockImplementation((key: string) => {
      delete cookieStore[key];
    });
    clearAuthSession();
    vi.clearAllMocks();
  });

  it('stores accessToken in JS memory and session flag + user in cookies with rememberMe=true', () => {
    setAuthSession(mockAuthData, true);

    // In-memory token verified
    expect(getAuthToken()).toBe('mock-access-token-xyz');

    // Session flag cookie and user cookie are stored with 7 days expiration
    expect(Cookies.set).toHaveBeenCalledWith(
      SESSION_FLAG_COOKIE,
      '1',
      expect.objectContaining({ path: '/', sameSite: 'lax', expires: 7 })
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      USER_COOKIE,
      JSON.stringify(mockAuthData.user),
      expect.objectContaining({ path: '/', sameSite: 'lax', expires: 7 })
    );

    // Does NOT set accessToken or refreshToken in cookies (strictly in-memory / HttpOnly)
    expect(Cookies.set).not.toHaveBeenCalledWith('soodfolio_token', expect.anything(), expect.anything());
    expect(Cookies.set).not.toHaveBeenCalledWith('soodfolio_refresh_token', expect.anything(), expect.anything());

    // Cleans up legacy tokens if any existed
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_token', { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_refresh_token', { path: '/' });
  });

  it('stores session flag cookie without expiration when rememberMe=false', () => {
    setAuthSession(mockAuthData, false);

    expect(getAuthToken()).toBe('mock-access-token-xyz');
    expect(Cookies.set).toHaveBeenCalledWith(
      SESSION_FLAG_COOKIE,
      '1',
      { path: '/', sameSite: 'lax' }
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      USER_COOKIE,
      JSON.stringify(mockAuthData.user),
      { path: '/', sameSite: 'lax' }
    );
  });

  it('allows setting in-memory access token directly via setAccessToken', () => {
    expect(getAuthToken()).toBeNull();
    setAccessToken('custom-memory-token-999');
    expect(getAuthToken()).toBe('custom-memory-token-999');
    expect(isAuthenticated()).toBe(true);

    setAccessToken(null);
    expect(getAuthToken()).toBeNull();
  });

  it('returns undefined for getRefreshToken (HttpOnly cookie managed by browser/server)', () => {
    setAuthSession(mockAuthData);
    expect(getRefreshToken()).toBeUndefined();
  });

  it('identifies active session via hasSessionFlag', () => {
    expect(hasSessionFlag()).toBe(false);

    cookieStore[SESSION_FLAG_COOKIE] = '1';
    expect(hasSessionFlag()).toBe(true);
    expect(isAuthenticated()).toBe(true);

    // Backward compatibility with legacy soodfolio_token cookie
    delete cookieStore[SESSION_FLAG_COOKIE];
    cookieStore['soodfolio_token'] = 'legacy-token';
    expect(hasSessionFlag()).toBe(true);
  });

  it('parses and returns the authenticated user from USER_COOKIE', () => {
    setAuthSession(mockAuthData);
    const user = getAuthUser();
    expect(user).toEqual(mockAuthData.user);
    expect(user?.email).toBe('alex@example.com');
  });

  it('returns null if user cookie is malformed JSON', () => {
    cookieStore[USER_COOKIE] = '{ invalid json';
    expect(getAuthUser()).toBeNull();
  });

  it('returns null if user cookie is missing', () => {
    delete cookieStore[USER_COOKIE];
    expect(getAuthUser()).toBeNull();
  });

  it('clears in-memory token and all session/user cookies upon clearAuthSession', () => {
    setAuthSession(mockAuthData);
    expect(getAuthToken()).toBe('mock-access-token-xyz');

    clearAuthSession();

    expect(getAuthToken()).toBeNull();
    expect(Cookies.remove).toHaveBeenCalledWith(SESSION_FLAG_COOKIE, { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith(USER_COOKIE, { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_token', { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('soodfolio_refresh_token', { path: '/' });
    expect(isAuthenticated()).toBe(false);
  });
});

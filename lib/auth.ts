import Cookies from 'js-cookie';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl?: string | null;
  role: string;
  authProvider?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: AuthUser;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

const TOKEN_COOKIE = 'soodfolio_token';
const REFRESH_TOKEN_COOKIE = 'soodfolio_refresh_token';
const USER_COOKIE = 'soodfolio_user';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export function setAuthSession(data: AuthResponse, rememberMe: boolean = true) {
  const cookieOptions: Cookies.CookieAttributes = { path: '/' };
  if (rememberMe) {
    cookieOptions.expires = 7; // 7 days persistence
  }

  Cookies.set(TOKEN_COOKIE, data.accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, cookieOptions);
  Cookies.set(USER_COOKIE, JSON.stringify(data.user), cookieOptions);
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
}

export function getAuthUser(): AuthUser | null {
  const userJson = Cookies.get(USER_COOKIE);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  Cookies.remove(TOKEN_COOKIE, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(USER_COOKIE, { path: '/' });
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

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
  refreshToken?: string;
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

// Client API Base: uses Next.js rewrites or explicit public env var
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

// Cookie names
export const SESSION_FLAG_COOKIE = 'soodfolio_session';
export const USER_COOKIE = 'soodfolio_user';

// In-Memory Access Token (Strict XSS & Session Security)
let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAccessToken;
}

// Backward compatibility alias
export function getRefreshToken(): string | undefined {
  return undefined;
}

export function setAuthSession(data: AuthResponse, rememberMe: boolean = true) {
  // Store token in memory only
  inMemoryAccessToken = data.accessToken;

  // Set non-HttpOnly flag cookie so Next.js Middleware can route authenticated users
  const cookieOptions: Cookies.CookieAttributes = {
    path: '/',
    sameSite: 'lax',
  };
  if (rememberMe) {
    cookieOptions.expires = 7; // 7 days persistence
  }

  Cookies.set(SESSION_FLAG_COOKIE, '1', cookieOptions);
  Cookies.set(USER_COOKIE, JSON.stringify(data.user), cookieOptions);

  // Clean up legacy cookies if they exist
  Cookies.remove('soodfolio_token', { path: '/' });
  Cookies.remove('soodfolio_refresh_token', { path: '/' });
}

export function hasSessionFlag(): boolean {
  return Cookies.get(SESSION_FLAG_COOKIE) === '1' || Cookies.get('soodfolio_token') !== undefined;
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
  inMemoryAccessToken = null;
  Cookies.remove(SESSION_FLAG_COOKIE, { path: '/' });
  Cookies.remove(USER_COOKIE, { path: '/' });
  Cookies.remove('soodfolio_token', { path: '/' });
  Cookies.remove('soodfolio_refresh_token', { path: '/' });
}

export function isAuthenticated(): boolean {
  return !!inMemoryAccessToken || hasSessionFlag();
}

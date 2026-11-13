'use client';

import {
  API_BASE,
  getAuthToken,
  setAuthSession,
  clearAuthSession,
  hasSessionFlag,
  AuthResponse,
} from '@/lib/auth';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Response) => void;
  reject: (reason?: unknown) => void;
  url: string;
  options: RequestInit;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      const newOptions = { ...prom.options };
      const newHeaders = new Headers(newOptions.headers || {});
      if (token) {
        newHeaders.set('Authorization', `Bearer ${token}`);
      }
      newOptions.headers = newHeaders;
      newOptions.credentials = 'include';
      fetch(prom.url, newOptions)
        .then((res) => prom.resolve(res))
        .catch((err) => prom.reject(err));
    }
  });

  failedQueue = [];
};

/**
 * Enhanced fetch wrapper with Automatic Transparent In-Memory JWT Refresh Interceptor.
 * When an API call returns 401 Unauthorized, it pauses subsequent requests,
 * silently calls /auth/refresh using HttpOnly cookie credentials, updates the in-memory token,
 * and replays the original requests without user disruption.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const updatedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  let response: Response;
  try {
    response = await fetch(url, updatedOptions);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 503,
        error: 'NETWORK_ERROR',
        message: `Không thể kết nối đến máy chủ (${errorMsg}). Vui lòng kiểm tra lại kết nối mạng.`,
        path: url,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // If unauthorized and we have an active session indicator, initiate silent refresh
  if (response.status === 401) {
    // Check if we even have a session to refresh
    if (!hasSessionFlag() && !token) {
      clearAuthSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/preview') && window.location.pathname !== '/') {
        window.location.href = '/login?sessionExpired=true';
      }
      return response;
    }

    if (isRefreshing) {
      // Buffer the request while another request is actively refreshing the token
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({ resolve, reject, url, options: updatedOptions });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh token expired or revoked');
      }

      const authData: AuthResponse = await refreshRes.json();
      setAuthSession(authData);

      // Re-execute all buffered requests with the new access token
      processQueue(null, authData.accessToken);

      // Re-execute current request
      const retryHeaders = new Headers(updatedOptions.headers || {});
      retryHeaders.set('Authorization', `Bearer ${authData.accessToken}`);
      return fetch(url, { ...updatedOptions, headers: retryHeaders, credentials: 'include' });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAuthSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/preview') && window.location.pathname !== '/') {
        window.location.href = '/login?sessionExpired=true';
      }
      return response;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

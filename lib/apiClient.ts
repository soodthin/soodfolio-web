'use client';

import { API_BASE, getAuthToken, getRefreshToken, setAuthSession, clearAuthSession, AuthResponse } from '@/lib/auth';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Response) => void;
  reject: (reason?: any) => void;
  url: string;
  options: RequestInit;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      const newOptions = { ...prom.options };
      newOptions.headers = {
        ...newOptions.headers,
        Authorization: `Bearer ${token}`,
      };
      fetch(prom.url, newOptions)
        .then((res) => prom.resolve(res))
        .catch((err) => prom.reject(err));
    }
  });

  failedQueue = [];
};

/**
 * Enhanced fetch wrapper with Automatic Transparent JWT Refresh Interceptor.
 * When an API call returns 401 Unauthorized (expired Access Token), it pauses subsequent
 * requests, silently calls /auth/refresh using the Refresh Token, updates cookies,
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
        message: `Không thể kết nối đến máy chủ (${errorMsg}). Vui lòng kiểm tra lại dịch vụ Backend.`,
        path: url,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // If unauthorized and we have a refresh token, initiate transparent silent refresh
  if (response.status === 401) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh token expired or revoked');
      }

      const authData: AuthResponse = await refreshRes.json();
      setAuthSession(authData);

      // Re-execute all buffered requests with the new access token
      processQueue(null, authData.accessToken);

      // Re-execute current request
      headers.set('Authorization', `Bearer ${authData.accessToken}`);
      return fetch(url, { ...updatedOptions, headers });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAuthSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?sessionExpired=true';
      }
      return response;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

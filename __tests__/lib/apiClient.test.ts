import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fetchWithAuth } from '@/lib/apiClient';
import * as auth from '@/lib/auth';

describe('API Client Transparent Refresh Interceptor (lib/apiClient.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '', pathname: '/dashboard' };
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should attach Bearer token to request headers if token exists', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('valid-token-123');
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    const res = await fetchWithAuth('/api/v1/portfolios/me');
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/portfolios/me',
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const callHeaders = mockFetch.mock.calls[0][1].headers as Headers;
    expect(callHeaders.get('Authorization')).toBe('Bearer valid-token-123');
  });

  it('should redirect to /login?sessionExpired=true if 401 and no refresh token available', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('expired-token');
    vi.spyOn(auth, 'getRefreshToken').mockReturnValue(undefined);
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(res.status).toBe(401);
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('should transparently refresh token and replay original request on 401 when refresh token is valid', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValueOnce('expired-token').mockReturnValue('fresh-token-456');
    vi.spyOn(auth, 'getRefreshToken').mockReturnValue('valid-refresh-token');
    const setAuthSessionSpy = vi.spyOn(auth, 'setAuthSession').mockImplementation(() => {});

    const mockAuthResponse: auth.AuthResponse = {
      accessToken: 'fresh-token-456',
      refreshToken: 'new-refresh-token',
      tokenType: 'Bearer',
      expiresInMs: 3600000,
      user: {
        id: '1',
        email: 'user@example.com',
        fullName: 'User',
        username: 'user',
        role: 'USER',
      },
    };

    // First call returns 401, second call is /auth/refresh (200), third call is replayed request (200)
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockAuthResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'success' }), { status: 200 }));

    global.fetch = mockFetch;

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(setAuthSessionSpy).toHaveBeenCalledWith(mockAuthResponse);
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Verify /auth/refresh was called with refresh token
    expect(mockFetch.mock.calls[1][0]).toContain('/auth/refresh');
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toEqual({
      refreshToken: 'valid-refresh-token',
    });

    // Verify replayed request has new token
    const replayedHeaders = mockFetch.mock.calls[2][1].headers as Headers;
    expect(replayedHeaders.get('Authorization')).toBe('Bearer fresh-token-456');
    expect(res.status).toBe(200);
  });

  it('should clear session and redirect when refresh token endpoint also fails', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('expired-token');
    vi.spyOn(auth, 'getRefreshToken').mockReturnValue('revoked-refresh-token');
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    // Initial call: 401. Refresh call: 401.
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
      .mockResolvedValueOnce(new Response('Revoked', { status: 401 }));

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(res.status).toBe(401);
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('should catch network errors (Failed to fetch / Connection refused) and return a synthetic 503 response', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(res.ok).toBe(false);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe('NETWORK_ERROR');
    expect(body.message).toContain('Không thể kết nối');
  });
});


import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fetchWithAuth } from '@/lib/apiClient';
import * as auth from '@/lib/auth';

describe('API Client Transparent Refresh Interceptor (lib/apiClient.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as unknown as { location?: Location }).location;
    window.location = { href: '', pathname: '/dashboard' } as unknown as Location;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should attach Bearer token and credentials: include to request headers if token exists', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('valid-token-123');
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    const res = await fetchWithAuth('/api/v1/portfolios/me');
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/portfolios/me',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.any(Headers),
      })
    );

    const callHeaders = mockFetch.mock.calls[0][1].headers as Headers;
    expect(callHeaders.get('Authorization')).toBe('Bearer valid-token-123');
  });

  it('should redirect to /login?sessionExpired=true without calling /auth/refresh if 401 and no session exists', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null);
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(false);
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    const mockFetch = vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }));
    global.fetch = mockFetch;

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(res.status).toBe(401);
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1); // Did not attempt /auth/refresh
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('should transparently refresh token via HttpOnly cookies (credentials: include) and replay original request on 401', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValueOnce('expired-token').mockReturnValue('fresh-token-456');
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(true);
    const setAuthSessionSpy = vi.spyOn(auth, 'setAuthSession').mockImplementation(() => {});

    const mockAuthResponse: auth.AuthResponse = {
      accessToken: 'fresh-token-456',
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

    // 1st call returns 401, 2nd call is /auth/refresh (200), 3rd call is replayed request (200)
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockAuthResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'success' }), { status: 200 }));

    global.fetch = mockFetch;

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(setAuthSessionSpy).toHaveBeenCalledWith(mockAuthResponse);
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Verify /auth/refresh call has credentials: 'include' and empty JSON body (HttpOnly refresh token cookie)
    const refreshCall = mockFetch.mock.calls[1];
    expect(refreshCall[0]).toContain('/auth/refresh');
    expect(refreshCall[1].method).toBe('POST');
    expect(refreshCall[1].credentials).toBe('include');
    expect(JSON.parse(refreshCall[1].body)).toEqual({});

    // Verify replayed request has new Bearer token
    const replayedHeaders = mockFetch.mock.calls[2][1].headers as Headers;
    expect(replayedHeaders.get('Authorization')).toBe('Bearer fresh-token-456');
    expect(res.status).toBe(200);
  });

  it('should clear session and redirect when refresh token endpoint returns 401', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('expired-token');
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(true);
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    // Initial call: 401. Refresh call: 401.
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
      .mockResolvedValueOnce(new Response('Revoked or Expired', { status: 401 }));

    const res = await fetchWithAuth('/api/v1/portfolios/me');

    expect(res.status).toBe(401);
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('should buffer concurrent 401 requests during refresh and replay all with new token', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValueOnce('expired-token').mockReturnValue('fresh-token-456');
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(true);
    vi.spyOn(auth, 'setAuthSession').mockImplementation(() => {});

    const mockAuthResponse: auth.AuthResponse = {
      accessToken: 'fresh-token-456',
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

    const callCounts: Record<string, number> = {};

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      callCounts[url] = (callCounts[url] || 0) + 1;

      if (url.includes('/auth/refresh')) {
        // Slight artificial delay to allow concurrent request to hit isRefreshing
        await new Promise((r) => setTimeout(r, 10));
        return new Response(JSON.stringify(mockAuthResponse), { status: 200 });
      }

      // First attempt for any resource returns 401
      if (callCounts[url] === 1) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Replayed attempt returns 200
      return new Response(JSON.stringify({ url, ok: true }), { status: 200 });
    });

    global.fetch = mockFetch;

    // Fire 2 concurrent requests
    const p1 = fetchWithAuth('/api/v1/resource-1');
    // slight microtask delay so resource-1 enters refresh first
    await new Promise((r) => setTimeout(r, 2));
    const p2 = fetchWithAuth('/api/v1/resource-2');

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(callCounts['/api/v1/resource-1']).toBe(2);
    expect(callCounts['/api/v1/resource-2']).toBe(2);
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

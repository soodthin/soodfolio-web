import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as auth from '@/lib/auth';

function TestConsumer() {
  const { user, token, isAuthenticated, isLoading, login, logout, refreshSession } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="auth">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="user">{user ? user.username : 'no-user'}</div>
      <div data-testid="token">{token || 'no-token'}</div>
      <button
        onClick={() =>
          login({
            accessToken: 'new-acc-tok',
            tokenType: 'Bearer',
            expiresInMs: 3600000,
            user: {
              id: 'u1',
              email: 'test@example.com',
              fullName: 'Test User',
              username: 'testuser',
              role: 'USER',
            },
          })
        }
      >
        Trigger Login
      </button>
      <button onClick={() => logout()}>Trigger Logout</button>
      <button onClick={() => refreshSession()}>Trigger Refresh</button>
    </div>
  );
}

describe('AuthContext and useAuth Hook - Hybrid Auth Architecture', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as unknown as { location?: Location }).location;
    window.location = { href: '', pathname: '/dashboard' } as unknown as Location;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should initialize immediately if in-memory token and cached user exist', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue({
      id: 'stored-1',
      email: 'stored@example.com',
      fullName: 'Stored User',
      username: 'storeduser',
      role: 'USER',
    });
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('stored-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    expect(screen.getByTestId('user').textContent).toBe('storeduser');
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
  });

  it('should silently refresh session on mount when session flag cookie exists without in-memory token', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null);
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(true);
    vi.spyOn(auth, 'getAuthUser').mockReturnValue({
      id: 'u1',
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      role: 'USER',
    });
    const setAuthSessionSpy = vi.spyOn(auth, 'setAuthSession').mockImplementation(() => {});

    const mockRefreshedData: auth.AuthResponse = {
      accessToken: 'hydrated-in-memory-jwt',
      tokenType: 'Bearer',
      expiresInMs: 3600000,
      user: {
        id: 'u1',
        email: 'test@example.com',
        fullName: 'Test User',
        username: 'testuser',
        role: 'USER',
      },
    };

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockRefreshedData), { status: 200 })
    );
    global.fetch = mockFetch;

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({}),
      })
    );
    expect(setAuthSessionSpy).toHaveBeenCalledWith(mockRefreshedData);
    expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    expect(screen.getByTestId('token').textContent).toBe('hydrated-in-memory-jwt');
  });

  it('should clear session and redirect when session flag exists but silent refresh fails on protected route', async () => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null);
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(true);
    vi.spyOn(auth, 'getAuthUser').mockReturnValue(null);
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    expect(clearAuthSpy).toHaveBeenCalled();
    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('should initialize as unauthenticated if no cookies or session flag exist', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue(null);
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null);
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(false);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('token').textContent).toBe('no-token');
  });

  it('should update state and save session on login()', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue(null);
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null);
    vi.spyOn(auth, 'hasSessionFlag').mockReturnValue(false);
    const setAuthSessionSpy = vi.spyOn(auth, 'setAuthSession').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Trigger Login').click();
    });

    expect(setAuthSessionSpy).toHaveBeenCalled();
    expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    expect(screen.getByTestId('user').textContent).toBe('testuser');
    expect(screen.getByTestId('token').textContent).toBe('new-acc-tok');
  });

  it('should call /auth/logout API with credentials: include and clear session on logout()', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue({
      id: 'u1',
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      role: 'USER',
    });
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('tok');
    const clearAuthSpy = vi.spyOn(auth, 'clearAuthSession').mockImplementation(() => {});

    const mockFetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    global.fetch = mockFetch;

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Trigger Logout').click();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('token').textContent).toBe('no-token');
  });

  it('should throw error when useAuth is invoked outside AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleError.mockRestore();
  });
});

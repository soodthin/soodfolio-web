import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as auth from '@/lib/auth';

function TestConsumer() {
  const { user, token, isAuthenticated, isLoading, login, logout } = useAuth();
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
            refreshToken: 'new-ref-tok',
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
    </div>
  );
}

describe('AuthContext and useAuth Hook', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should initialize with cookies state if user and token exist', async () => {
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

  it('should initialize as unauthenticated if no cookies exist', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue(null);
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(undefined);

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
  });

  it('should update state and save cookies on login()', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue(null);
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(undefined);
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

  it('should call /auth/logout API and clear session on logout()', async () => {
    vi.spyOn(auth, 'getAuthUser').mockReturnValue({
      id: 'u1',
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      role: 'USER',
    });
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('tok');
    vi.spyOn(auth, 'getRefreshToken').mockReturnValue('ref-tok');
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
        body: JSON.stringify({ refreshToken: 'ref-tok' }),
      })
    );
    expect(clearAuthSpy).toHaveBeenCalled();
    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });

  it('should throw error when useAuth is invoked outside AuthProvider', () => {
    // Suppress React error boundary console error in test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleError.mockRestore();
  });
});

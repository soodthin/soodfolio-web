import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  SocialAuthButtons,
  GITHUB_CLIENT_ID,
  GOOGLE_CLIENT_ID,
} from '@/components/auth/SocialAuthButtons';

describe('SocialAuthButtons Component - OAuth CSRF & Flow Architecture', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    delete (window as unknown as { location?: Location }).location;
    window.location = {
      origin: 'https://soodfolio.dev',
      href: '',
    } as unknown as Location;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('renders correctly with default divider label and provider buttons', () => {
    render(<SocialAuthButtons />);
    expect(screen.getByText('Hoặc đăng nhập nhanh bằng')).toBeDefined();
    expect(screen.getByRole('button', { name: /github login/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /google login/i })).toBeDefined();
  });

  it('renders custom label when provided', () => {
    render(<SocialAuthButtons label="Hoặc tiếp tục với" />);
    expect(screen.getByText('Hoặc tiếp tục với')).toBeDefined();
  });

  it('fetches server-side CSRF state on mount with GET and credentials: include', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ state: 'server-csrf-state-456' }), { status: 200 })
    );
    global.fetch = mockFetch;

    render(<SocialAuthButtons />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://soodfolio.dev/api/v1/auth/oauth/state',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });
  });

  it('redirects to GitHub OAuth URL with server-returned state and client ID', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ state: 'secure-server-state-github' }), { status: 200 })
    );
    global.fetch = mockFetch;

    render(<SocialAuthButtons />);

    // Wait for state prefetch to finish
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const githubBtn = screen.getByRole('button', { name: /github login/i });
    fireEvent.click(githubBtn);

    expect(window.location.href).toContain('https://github.com/login/oauth/authorize');
    expect(window.location.href).toContain(`client_id=${GITHUB_CLIENT_ID}`);
    expect(window.location.href).toContain(encodeURIComponent('https://soodfolio.dev/auth/callback/github'));
    expect(window.location.href).toContain('state=secure-server-state-github');
    expect(localStorage.getItem('soodfolio_last_auth_provider')).toBe('github');
  });

  it('redirects to Google OAuth URL with server-returned state and client ID', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ state: 'secure-server-state-google' }), { status: 200 })
    );
    global.fetch = mockFetch;

    render(<SocialAuthButtons />);

    // Wait for state prefetch to finish
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const googleBtn = screen.getByRole('button', { name: /google login/i });
    fireEvent.click(googleBtn);

    expect(window.location.href).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(window.location.href).toContain(`client_id=${GOOGLE_CLIENT_ID}`);
    expect(window.location.href).toContain(encodeURIComponent('https://soodfolio.dev/auth/callback/google'));
    expect(window.location.href).toContain('state=secure-server-state-google');
    expect(localStorage.getItem('soodfolio_last_auth_provider')).toBe('google');
  });

  it('falls back gracefully to client-generated state when server state fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error on state fetch'));

    render(<SocialAuthButtons />);

    const githubBtn = screen.getByRole('button', { name: /github login/i });
    fireEvent.click(githubBtn);

    expect(window.location.href).toContain('https://github.com/login/oauth/authorize');
    expect(window.location.href).toContain('state=');
    const url = new URL(window.location.href);
    expect(url.searchParams.get('state')).toBeTruthy();
  });

  it('disables buttons while oauth redirect is initiating', () => {
    render(<SocialAuthButtons />);
    const githubBtn = screen.getByRole('button', { name: /github login/i });
    const googleBtn = screen.getByRole('button', { name: /google login/i });

    fireEvent.click(githubBtn);

    expect(githubBtn).toHaveProperty('disabled', true);
    expect(googleBtn).toHaveProperty('disabled', true);
  });

  it('renders "Gần đây" badge in hero variant when previous provider is recorded in localStorage', () => {
    localStorage.setItem('soodfolio_last_auth_provider', 'github');

    render(<SocialAuthButtons variant="hero" />);

    expect(screen.getByText('Gần đây')).toBeDefined();
    expect(screen.getByText('Tiếp tục với GitHub')).toBeDefined();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
  });

  it('triggers GitHub login on G keydown in hero variant when enableHotkeys=true', async () => {
    render(<SocialAuthButtons variant="hero" enableHotkeys={true} />);

    fireEvent.keyDown(window, { key: 'g', code: 'KeyG' });

    expect(window.location.href).toContain('https://github.com/login/oauth/authorize');
    expect(localStorage.getItem('soodfolio_last_auth_provider')).toBe('github');
  });
});

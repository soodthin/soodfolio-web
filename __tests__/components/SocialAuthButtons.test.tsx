import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

describe('SocialAuthButtons Component', () => {
  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = {
      origin: 'https://soodfolio.dev',
      href: '',
    };
  });

  it('renders correctly with default divider label', () => {
    render(<SocialAuthButtons />);
    expect(screen.getByText('Hoặc đăng nhập nhanh bằng')).toBeDefined();
    expect(screen.getByRole('button', { name: /github login/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /google login/i })).toBeDefined();
  });

  it('renders custom label when provided', () => {
    render(<SocialAuthButtons label="Hoặc tiếp tục với" />);
    expect(screen.getByText('Hoặc tiếp tục với')).toBeDefined();
  });

  it('redirects to GitHub OAuth URL when GitHub button is clicked', () => {
    render(<SocialAuthButtons />);
    const githubBtn = screen.getByRole('button', { name: /github login/i });

    fireEvent.click(githubBtn);

    expect(window.location.href).toContain('https://github.com/login/oauth/authorize');
    expect(window.location.href).toContain('client_id=Ov23li3aBSxR9V3u8J2O');
    expect(window.location.href).toContain(encodeURIComponent('https://soodfolio.dev/auth/callback/github'));
  });

  it('redirects to Google OAuth URL when Google button is clicked', () => {
    render(<SocialAuthButtons />);
    const googleBtn = screen.getByRole('button', { name: /google login/i });

    fireEvent.click(googleBtn);

    expect(window.location.href).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(window.location.href).toContain('622903719114-lilk7gbj5jcc138eva810gvr7uva3fqe.apps.googleusercontent.com');
    expect(window.location.href).toContain(encodeURIComponent('https://soodfolio.dev/auth/callback/google'));
  });

  it('disables buttons while oauth redirect is initiating', () => {
    render(<SocialAuthButtons />);
    const githubBtn = screen.getByRole('button', { name: /github login/i });
    const googleBtn = screen.getByRole('button', { name: /google login/i });

    fireEvent.click(githubBtn);

    expect(githubBtn).toHaveProperty('disabled', true);
    expect(googleBtn).toHaveProperty('disabled', true);
  });
});

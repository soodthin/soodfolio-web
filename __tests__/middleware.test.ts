import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('Next.js Middleware Security & Route Guards (middleware.ts)', () => {
  const createRequest = (pathname: string, token?: string) => {
    const url = new URL(`https://soodfolio.dev${pathname}`);
    const req = new NextRequest(url);
    if (token) {
      req.cookies.set('soodfolio_token', token);
    }
    return req;
  };

  it('redirects unauthenticated user accessing /dashboard to /login with redirect param', () => {
    const req = createRequest('/dashboard');
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toBe('https://soodfolio.dev/login?redirect=%2Fdashboard');
  });

  it('redirects unauthenticated user accessing subpath /dashboard/settings to /login with redirect param', () => {
    const req = createRequest('/dashboard/settings');
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toBe('https://soodfolio.dev/login?redirect=%2Fdashboard%2Fsettings');
  });

  it('allows authenticated user to access /dashboard', () => {
    const req = createRequest('/dashboard', 'valid-jwt-token');
    const res = middleware(req);

    // NextResponse.next() continues without redirect
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects authenticated user accessing /login to /dashboard', () => {
    const req = createRequest('/login', 'valid-jwt-token');
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://soodfolio.dev/dashboard');
  });

  it('redirects authenticated user accessing /register to /dashboard', () => {
    const req = createRequest('/register', 'valid-jwt-token');
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://soodfolio.dev/dashboard');
  });

  it('allows unauthenticated visitor to view public routes (/login, /register, /[username])', () => {
    const loginReq = createRequest('/login');
    const loginRes = middleware(loginReq);
    expect(loginRes.headers.get('location')).toBeNull();

    const registerReq = createRequest('/register');
    const registerRes = middleware(registerReq);
    expect(registerRes.headers.get('location')).toBeNull();

    const profileReq = createRequest('/thaidothinh');
    const profileRes = middleware(profileReq);
    expect(profileRes.headers.get('location')).toBeNull();
  });
});

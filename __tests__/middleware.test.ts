import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('Next.js Middleware Security & Route Guards (middleware.ts)', () => {
  const createRequest = (
    pathname: string,
    options?: { sessionFlag?: string; legacyToken?: string }
  ) => {
    const url = new URL(`https://soodfolio.dev${pathname}`);
    const req = new NextRequest(url);
    if (options?.sessionFlag !== undefined) {
      req.cookies.set('soodfolio_session', options.sessionFlag);
    }
    if (options?.legacyToken !== undefined) {
      req.cookies.set('soodfolio_token', options.legacyToken);
    }
    return req;
  };

  describe('Unauthenticated Visitors Accessing Protected Routes', () => {
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

    it('redirects unauthenticated user accessing /studio to /login with redirect param', () => {
      const req = createRequest('/studio');
      const res = middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location');
      expect(location).toBe('https://soodfolio.dev/login?redirect=%2Fstudio');
    });

    it('redirects user when soodfolio_session cookie has invalid value (not "1")', () => {
      const req = createRequest('/dashboard', { sessionFlag: '0' });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('https://soodfolio.dev/login?redirect=%2Fdashboard');
    });
  });

  describe('Authenticated Users with Session Flag (soodfolio_session=1)', () => {
    it('allows authenticated user with soodfolio_session=1 to access /dashboard', () => {
      const req = createRequest('/dashboard', { sessionFlag: '1' });
      const res = middleware(req);

      // NextResponse.next() continues without redirect
      expect(res.headers.get('location')).toBeNull();
    });

    it('allows authenticated user with soodfolio_session=1 to access /studio', () => {
      const req = createRequest('/studio', { sessionFlag: '1' });
      const res = middleware(req);

      expect(res.headers.get('location')).toBeNull();
    });

    it('redirects authenticated user with soodfolio_session=1 accessing /login to /dashboard', () => {
      const req = createRequest('/login', { sessionFlag: '1' });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('https://soodfolio.dev/dashboard');
    });

    it('redirects authenticated user with soodfolio_session=1 accessing /register to /dashboard', () => {
      const req = createRequest('/register', { sessionFlag: '1' });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('https://soodfolio.dev/dashboard');
    });
  });

  describe('Backward Compatibility with Legacy Token (soodfolio_token)', () => {
    it('allows access to /dashboard if legacy soodfolio_token cookie is present', () => {
      const req = createRequest('/dashboard', { legacyToken: 'legacy-jwt-value' });
      const res = middleware(req);

      expect(res.headers.get('location')).toBeNull();
    });

    it('redirects /login to /dashboard if legacy soodfolio_token cookie is present', () => {
      const req = createRequest('/login', { legacyToken: 'legacy-jwt-value' });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('https://soodfolio.dev/dashboard');
    });
  });

  describe('Public Unprotected Routes', () => {
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
});

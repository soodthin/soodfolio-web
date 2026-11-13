import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionFlag = request.cookies.get('soodfolio_session')?.value;
  const legacyToken = request.cookies.get('soodfolio_token')?.value;
  const hasSession = sessionFlag === '1' || !!legacyToken;
  const { pathname } = request.nextUrl;

  // 1. Protected Route: /dashboard and its sub-paths
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/studio')) {
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Auth Routes: /login, /register (Already authenticated users should go to dashboard)
  if (pathname === '/login' || pathname === '/register') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/studio/:path*', '/login', '/register'],
};

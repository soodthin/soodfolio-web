'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse, ApiErrorResponse } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json().catch(() => ({
          message: 'Failed to sign in. Please verify your credentials.',
        }));
        setErrorMessage(errorData.message || 'Invalid username or password.');
        setIsLoading(false);
        return;
      }

      const authData: AuthResponse = await res.json();
      login(authData);
      router.push(redirectTarget);
    } catch (err) {
      console.error('Login request failed:', err);
      setErrorMessage('Cannot connect to server. Please ensure the backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0b1124] text-[#ebe7ff]">
      {/* Background glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_40%,rgba(95,75,170,0.35),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-[#293d79] bg-[#0c142e]/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#f8c076] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f8c076] animate-pulse" />
            <span>SOODFOLIO CREATOR AUTH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white uppercase tracking-tight">
            SIGN IN
          </h1>
          <p className="text-xs font-mono text-[#8cb0fd]">
            Access and manage your presentation slide deck
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs font-mono text-rose-300 flex items-start gap-2">
            <span className="font-bold text-rose-400">[!]</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[#a6bbe7] uppercase tracking-wider block">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. alex or alex@example.com"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#a6bbe7] uppercase tracking-wider block">
                Password
              </label>
              <span className="text-[10px] text-[#6c82b5]">Demo: Password123!</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#f8c076] py-3 text-[#0b1124] font-bold uppercase tracking-wider hover:bg-[#ffcf8e] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(248,192,118,0.25)]"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN TO DASHBOARD ↗'}
          </button>
        </form>

        <div className="border-b border-[#1c274a]" />

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-[#7990c6]">
          <a href="/" className="hover:text-white transition-colors">
            ← Home
          </a>
          <div>
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="text-[#f8c076] hover:underline font-bold"
            >
              [ Register ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b1124]" />}>
      <LoginForm />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse, ApiErrorResponse } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json().catch(() => ({
          message: 'Registration failed. Please check your information.',
          status: res.status,
          error: 'Error',
          timestamp: '',
          path: '',
        }));

        if (errorData.validationErrors) {
          setFieldErrors(errorData.validationErrors);
        }
        setErrorMessage(errorData.message || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      const authData: AuthResponse = await res.json();
      // Auto-login upon registration & redirect to dashboard!
      login(authData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Cannot connect to server. Please check your backend connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0b1124] text-[#ebe7ff]">
      {/* Background glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_35%,rgba(95,75,170,0.35),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-lg rounded-2xl border border-[#293d79] bg-[#0c142e]/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#f8c076] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f8c076] animate-pulse" />
            <span>CLAIM YOUR DEVELOPER HANDLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white uppercase tracking-tight">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs font-mono text-[#8cb0fd]">
            Build your presentation portfolio on soodfolio.com/
            <span className="text-[#f8c076]">{username || 'your-name'}</span>
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
        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-[#a6bbe7] uppercase tracking-wider block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
            {fieldErrors.fullName && (
              <span className="text-rose-400 text-[10px]">{fieldErrors.fullName}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[#a6bbe7] uppercase tracking-wider block">
              Username (Portfolio URL Handle)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="e.g. johndoe"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
            {fieldErrors.username && (
              <span className="text-rose-400 text-[10px]">{fieldErrors.username}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[#a6bbe7] uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
            {fieldErrors.email && (
              <span className="text-rose-400 text-[10px]">{fieldErrors.email}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[#a6bbe7] uppercase tracking-wider block">
              Password (Min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#2b417e] bg-[#091024] px-3.5 py-2.5 text-white placeholder-[#4c6196] focus:border-[#f8c076] focus:outline-none transition-colors"
            />
            {fieldErrors.password && (
              <span className="text-rose-400 text-[10px]">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#f8c076] py-3 text-[#0b1124] font-bold uppercase tracking-wider hover:bg-[#ffcf8e] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(248,192,118,0.25)] mt-2"
          >
            {isLoading ? 'CREATING YOUR PORTFOLIO...' : 'CREATE ACCOUNT & PORTFOLIO ↗'}
          </button>
        </form>

        <div className="border-b border-[#1c274a]" />

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-[#7990c6]">
          <a href="/" className="hover:text-white transition-colors">
            ← Home
          </a>
          <div>
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#f8c076] hover:underline font-bold"
            >
              [ Sign In ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

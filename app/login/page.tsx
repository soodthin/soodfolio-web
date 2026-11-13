'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse, ApiErrorResponse } from '@/lib/auth';
import { StageGateAuthLayout } from '@/components/auth/StageGateAuthLayout';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { ThemePresetKey } from '@/lib/themePresets';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const resetSuccess = searchParams.get('resetSuccess') === 'true';
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemePresetKey>('classic-deck');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-dismiss top error banner
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usernameOrEmail: usernameOrEmail.trim(), 
          password 
        }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json().catch(() => ({
          timestamp: '',
          status: res.status,
          error: 'Error',
          message: 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
          path: '',
        }));

        let displayMsg = errorData.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.';
        if (res.status === 401) {
          displayMsg = 'Tên đăng nhập, email hoặc mật khẩu không chính xác.';
        }
        setErrorMessage(displayMsg);
        setIsLoading(false);
        return;
      }

      const authData: AuthResponse = await res.json();
      try {
        localStorage.setItem('soodfolio_last_auth_provider', 'email');
      } catch {
        // Ignore
      }
      login(authData, true); // Silent background token refresh default
      router.push(redirectTarget);
    } catch (err) {
      console.error('Login request failed:', err);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng và thử lại sau.');
      setIsLoading(false);
    }
  };

  // Derive preview username and full name from usernameOrEmail for live compilation
  const previewHandle = usernameOrEmail.includes('@')
    ? usernameOrEmail.split('@')[0]
    : usernameOrEmail;

  return (
    <>
      {/* Floating Status / Error Toasts */}
      {errorMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-white/95 dark:bg-[#0c141d]/95 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span className="font-sans font-medium leading-relaxed">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {resetSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-white/95 dark:bg-[#0c141d]/95 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="font-sans font-medium">Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập vào Studio.</span>
          </div>
        </div>
      )}

      {sessionExpired && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-white/95 dark:bg-[#0c141d]/95 border border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-teal-500 flex-shrink-0" />
            <span className="font-sans font-medium">Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.</span>
          </div>
        </div>
      )}

      <StageGateAuthLayout
        badgeText="ENGINEER ACCESS"
        title="Trở lại Studio trình chiếu"
        subtitle="Tiếp tục kiến tạo và quản trị slide deck portfolio kỹ thuật của bạn."
        username={previewHandle}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        footerPrompt={{
          question: 'Chưa có Stage?',
          actionText: 'Khởi tạo Stage miễn phí →',
          actionHref: '/register',
        }}
      >
        <div className="space-y-4">
          {/* Flipped OAuth Hierarchy: GitHub & Google SSO First */}
          <SocialAuthButtons variant="hero" label="hoặc tiếp tục với email" />

          {/* Login Form (Clean, zero redundant friction) */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username or Email Input */}
            <div className="space-y-1">
              <label 
                htmlFor="usernameOrEmail" 
                className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
              >
                Email hoặc Tên người dùng
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="alex.vance hoặc alex@soodfolio.com"
                required
                autoComplete="username"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0c141d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm transition-all duration-150 outline-none font-sans"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
                >
                  Mật khẩu
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 hover:underline transition-colors font-medium font-sans"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-10 px-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-[#0c141d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm transition-all duration-150 outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-sans font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-current" />
                  <span>Đang xác thực phiên làm việc...</span>
                </>
              ) : (
                <>
                  <span>Vào Studio</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </StageGateAuthLayout>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#080d12] text-slate-500 dark:text-slate-400 font-mono text-sm">
        Đang khởi tạo Studio...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

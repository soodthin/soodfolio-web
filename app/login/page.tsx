'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse, ApiErrorResponse } from '@/lib/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Clock
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
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      login(authData, rememberMe);
      router.push(redirectTarget);
    } catch (err) {
      console.error('Login request failed:', err);
      setErrorMessage('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại backend.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Nhập thông tin xác thực để truy cập không gian quản lý danh thiếp số của bạn."
      badgeText="OPERATE MODE"
    >
      <div className="space-y-6">
        {/* Social Quick Auth */}
        <SocialAuthButtons />

        {/* Success Banner from Reset Password */}
        {resetSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">
              Mật khẩu đã được cập nhật thành công! Vui lòng đăng nhập bằng mật khẩu mới của bạn.
            </div>
          </div>
        )}

        {/* Warning Banner from Session Expiration */}
        {sessionExpired && (
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <Clock className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">
              Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại để tiếp tục quản trị.
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username or Email Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="usernameOrEmail" 
              className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
            >
              Email hoặc Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-400 transition-colors">
                <User className="h-4 w-4" />
              </div>
              <input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="alex.vance hoặc alex@example.com"
                required
                autoComplete="username"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#12141d] border border-white/10 hover:border-white/20 focus:border-teal-500/80 focus:ring-2 focus:ring-teal-500/20 text-white placeholder:text-slate-400 text-sm transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
              >
                Mật khẩu
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-teal-400/90 hover:text-teal-300 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-400 transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#12141d] border border-white/10 hover:border-white/20 focus:border-teal-500/80 focus:ring-2 focus:ring-teal-500/20 text-white placeholder:text-slate-400 text-sm transition-all duration-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#12141d] border-white/20 text-teal-500 focus:ring-teal-500/30 focus:ring-offset-0 cursor-pointer accent-teal-500"
              />
              <span>Duy trì đăng nhập trong 7 ngày</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:from-teal-300 hover:via-teal-400 hover:to-teal-500 text-slate-950 font-semibold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Đang xác thực thông tin...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập vào Workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Chưa có tài khoản SoodFolio?{' '}
          <Link 
            href="/register" 
            className="font-semibold text-teal-400 hover:text-teal-300 hover:underline transition-colors ml-1"
          >
            Khởi tạo tài khoản miễn phí →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090a0f] text-slate-400 font-mono text-sm">
        Đang tải giao diện đăng nhập...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

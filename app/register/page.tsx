'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  X,
  Check
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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

  // Clean and sanitize username input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(rawVal);
  };

  // Live password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 4
  };

  const passwordScore = getPasswordStrength();
  const isUsernameValid = /^[a-z0-9_-]{3,30}$/.test(username.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Frontend validation
    if (!cleanUsername || !cleanFullName || !cleanEmail || !password) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (!isUsernameValid) {
      setErrorMessage('Tên định danh Stage phải có từ 3-30 ký tự thường, số, dấu gạch nối hoặc gạch dưới.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu tối thiểu phải từ 6 ký tự trở lên.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanFullName,
          username: cleanUsername,
          email: cleanEmail,
          password,
        }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json().catch(() => ({
          timestamp: '',
          status: res.status,
          error: 'Error',
          message: 'Khởi tạo tài khoản không thành công.',
          path: '',
        }));

        let displayMsg = errorData.message || 'Khởi tạo thất bại. Tên định danh hoặc email có thể đã tồn tại.';
        if (displayMsg.toLowerCase().includes('duplicate') || displayMsg.toLowerCase().includes('already exists')) {
          displayMsg = 'Tên định danh Stage hoặc email này đã có kỹ sư đăng ký sử dụng.';
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
      login(authData, true);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng và thử lại sau.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Error Toast */}
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

      <StageGateAuthLayout
        badgeText="STAGE INITIALIZATION"
        title="Khởi tạo Stage trình chiếu"
        subtitle="Xác lập không gian portfolio trực quan theo tiêu chuẩn kỹ thuật cấp cao."
        fullName={fullName}
        username={username}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        footerPrompt={{
          question: 'Đã có Stage trình chiếu?',
          actionText: 'Trở lại Studio →',
          actionHref: '/login',
        }}
      >
        <div className="space-y-4">
          {/* Flipped OAuth Hierarchy (GitHub & Google SSO First) */}
          <SocialAuthButtons variant="hero" label="hoặc tiếp tục với email" />

          {/* Registration Form (Zero friction, no confirm password) */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* HERO FIELD 1: Claim Stage URL with Live Slug Telemetry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="username"
                  className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
                >
                  Xác lập địa chỉ Stage
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {username ? (
                    isUsernameValid ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Sẵn sàng nhận diện</span>
                      </span>
                    ) : (
                      <span className="text-amber-500">3-30 ký tự</span>
                    )
                  ) : (
                    <span>soodfolio.com/[slug]</span>
                  )}
                </span>
              </div>

              {/* URL Claim Input Container */}
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-[#0c141d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 focus-within:border-teal-500 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all duration-150 overflow-hidden">
                <span className="px-3.5 py-2.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-white/[0.03] border-r border-slate-200/80 dark:border-white/[0.06] select-none shrink-0">
                  soodfolio.com/
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="alex.vance"
                  required
                  autoComplete="username"
                  maxLength={30}
                  className="w-full h-10 px-3 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-mono outline-none"
                />
              </div>
            </div>

            {/* FIELD 2: Full Name (Binds in real time to Slide 01) */}
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Vance"
                required
                autoComplete="name"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0c141d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm transition-all duration-150 outline-none font-sans"
              />
            </div>

            {/* FIELD 3: Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
              >
                Email công việc
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@soodfolio.com"
                required
                autoComplete="email"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0c141d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm transition-all duration-150 outline-none font-sans"
              />
            </div>

            {/* FIELD 4: Password (Single Input, zero confirm-password friction) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-sans text-slate-700 dark:text-slate-300 font-medium"
                >
                  Mật khẩu bảo mật
                </label>
                {password && (
                  <span className="text-[10px] font-sans font-medium text-slate-500">
                    {passwordScore <= 1 ? 'Cơ bản' : passwordScore <= 2 ? 'Trung bình' : passwordScore === 3 ? 'Mạnh' : 'Rất mạnh'}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  autoComplete="new-password"
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

              {/* Password strength hairline meters */}
              {password && (
                <div className="grid grid-cols-4 gap-1 pt-1">
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      passwordScore >= 1 ? 'bg-teal-500 dark:bg-[#2dd4bf]' : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      passwordScore >= 2 ? 'bg-teal-500 dark:bg-[#2dd4bf]' : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      passwordScore >= 3 ? 'bg-teal-500 dark:bg-[#2dd4bf]' : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      passwordScore >= 4 ? 'bg-teal-500 dark:bg-[#2dd4bf]' : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Terms text (No checkbox friction) */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed pt-1">
              Bằng cách khởi tạo Stage, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư của SoodFolio.
            </p>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-sans font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-current" />
                  <span>Đang khởi tạo không gian...</span>
                </>
              ) : (
                <>
                  <span>Khởi tạo Stage</span>
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse, ApiErrorResponse } from '@/lib/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Password strength calculation
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

  // Username validation helper
  const isUsernameValid = (name: string) => /^[a-z0-9_-]{3,30}$/.test(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validation
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!isUsernameValid(cleanUsername)) {
      setErrorMessage('Tên người dùng phải có từ 3-30 ký tự thường, số, dấu gạch nối hoặc gạch dưới.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu tối thiểu phải từ 6 ký tự trở lên.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: cleanUsername,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json().catch(() => ({
          timestamp: '',
          status: res.status,
          error: 'Error',
          message: 'Đăng ký tài khoản không thành công.',
          path: '',
        }));

        let displayMsg = errorData.message || 'Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.';
        if (displayMsg.toLowerCase().includes('duplicate') || displayMsg.toLowerCase().includes('already exists')) {
          displayMsg = 'Tên tài khoản hoặc địa chỉ email này đã được sử dụng.';
        }
        setErrorMessage(displayMsg);
        setIsLoading(false);
        return;
      }

      const authData: AuthResponse = await res.json();
      login(authData, true);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại backend.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo không gian trình chiếu"
      subtitle="Sở hữu slide deck portfolio trực quan dành riêng cho phong cách chuyên nghiệp của bạn."
      badgeText="EARLY ACCESS"
    >
      <div className="space-y-6">
        {/* Social Quick Auth */}
        <SocialAuthButtons />

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label 
              htmlFor="fullName"
              className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-medium"
            >
              Họ và tên
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400 transition-colors">
                <User className="h-4 w-4" />
              </div>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Vance"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#12141d] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Username / Handle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="username"
                className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-medium"
              >
                Định danh Deck (Username)
              </label>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                soodfolio.com/{username ? username.toLowerCase() : 'you'}
              </span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400 transition-colors">
                <AtSign className="h-4 w-4" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="elenavance"
                required
                maxLength={30}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#12141d] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all duration-200 outline-none font-mono"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label 
              htmlFor="email"
              className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-medium"
            >
              Địa chỉ Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#12141d] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Password & Strength Meter */}
          <div className="space-y-1.5">
            <label 
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-medium"
            >
              Mật khẩu (Tối thiểu 6 ký tự)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400 transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-slate-50 dark:bg-[#12141d] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all duration-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength meter bars */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1">
                <div className="grid grid-cols-4 gap-1.5">
                  <div className={`h-1 rounded-full transition-colors ${passwordScore >= 1 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <div className={`h-1 rounded-full transition-colors ${passwordScore >= 2 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <div className={`h-1 rounded-full transition-colors ${passwordScore >= 3 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <div className={`h-1 rounded-full transition-colors ${passwordScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Độ bảo mật mật khẩu</span>
                  <span className={passwordScore >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400'}>
                    {passwordScore <= 1 ? 'Cơ bản' : passwordScore <= 3 ? 'Khá' : 'Rất an toàn'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="confirmPassword"
              className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-medium"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400 transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#12141d] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-slate-100 dark:bg-[#12141d] border-slate-300 dark:border-white/20 text-teal-600 dark:text-teal-500 focus:ring-teal-500/20 cursor-pointer accent-teal-500"
              />
              <span className="leading-relaxed">
                Tôi đồng ý với{' '}
                <Link href="#" className="text-teal-600 dark:text-teal-400 hover:underline">Điều khoản dịch vụ</Link>
                {' '}và{' '}
                <Link href="#" className="text-teal-600 dark:text-teal-400 hover:underline">Chính sách bảo mật</Link>
                {' '}của SoodFolio.
              </span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-current" />
                <span>Đang khởi tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Tạo tài khoản & Mở Workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Đã có tài khoản SoodFolio?{' '}
          <Link 
            href="/login" 
            className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 hover:underline transition-colors ml-1"
          >
            Đăng nhập ngay →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { API_BASE } from '@/lib/auth';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [email, setEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setIsTokenValid(false);
      return;
    }

    fetch(`${API_BASE}/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setIsTokenValid(!!data.valid);
        if (data.email) setEmail(data.email);
      })
      .catch((err) => {
        console.error('Verify token failed:', err);
        setIsTokenValid(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  // Live Password strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu tối thiểu phải từ 6 ký tự trở lên.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Không thể đặt lại mật khẩu.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?resetSuccess=true');
      }, 2000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <AuthLayout
        title="Đang xác thực liên kết"
        subtitle="Vui lòng chờ trong giây lát trong khi chúng tôi kiểm tra liên kết của bạn..."
        badgeText="VERIFYING TOKEN"
      >
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          <span>Đang kiểm tra tính hợp lệ của token...</span>
        </div>
      </AuthLayout>
    );
  }

  if (!isTokenValid) {
    return (
      <AuthLayout
        title="Liên kết không hợp lệ"
        subtitle="Liên kết khôi phục mật khẩu đã hết hạn (quá 15 phút) hoặc đã được sử dụng trước đó."
        badgeText="TOKEN EXPIRED"
      >
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-5 w-5 text-rose-400 flex-shrink-0" />
              <span>Không thể sử dụng liên kết này</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-xs">
              Vì lý do an toàn, các liên kết khôi phục mật khẩu của SoodFolio sẽ tự động hủy sau 15 phút. Vui lòng gửi lại yêu cầu để nhận liên kết mới.
            </p>
          </div>

          <Link
            href="/forgot-password"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Yêu cầu liên kết mới</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="text-center text-xs text-slate-400">
            <Link href="/login" className="hover:text-teal-400 transition-colors">
              Quay lại trang Đăng nhập →
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Đặt lại mật khẩu mới"
      subtitle={email ? `Khởi tạo mật khẩu mới cho tài khoản ${email}.` : 'Nhập mật khẩu mới an toàn cho tài khoản của bạn.'}
      badgeText="RESET CREDENTIALS"
    >
      <div className="space-y-5">
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-[#131520] border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">
              Đổi mật khẩu thành công!
            </h3>
            <p className="text-xs text-slate-400">
              Đang chuyển hướng bạn về trang Đăng nhập...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label 
                htmlFor="newPassword" 
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
              >
                Mật khẩu mới (Tối thiểu 6 ký tự)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="new-password"
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

              {/* Strength meter bars */}
              {newPassword.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className={`h-1 rounded-full transition-colors ${passwordScore >= 1 ? 'bg-teal-400' : 'bg-white/10'}`} />
                    <div className={`h-1 rounded-full transition-colors ${passwordScore >= 2 ? 'bg-teal-400' : 'bg-white/10'}`} />
                    <div className={`h-1 rounded-full transition-colors ${passwordScore >= 3 ? 'bg-teal-400' : 'bg-white/10'}`} />
                    <div className={`h-1 rounded-full transition-colors ${passwordScore >= 4 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                    <span>Độ an toàn mật khẩu</span>
                    <span className={passwordScore >= 4 ? 'text-emerald-400' : 'text-teal-400'}>
                      {passwordScore <= 1 ? 'Yếu' : passwordScore <= 3 ? 'Trung bình' : 'Rất mạnh'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label 
                htmlFor="confirmPassword" 
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
              >
                Xác nhận lại mật khẩu mới
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#12141d] border border-white/10 hover:border-white/20 focus:border-teal-500/80 focus:ring-2 focus:ring-teal-500/20 text-white placeholder:text-slate-400 text-sm transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:from-teal-300 hover:via-teal-400 hover:to-teal-500 text-slate-950 font-semibold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Đang cập nhật mật khẩu...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận đổi mật khẩu</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090a0f] text-slate-400 font-mono text-sm">
        Đang tải trang đặt lại mật khẩu...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

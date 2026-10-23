'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { API_BASE } from '@/lib/auth';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        throw new Error('Không thể xử lý yêu cầu khôi phục mật khẩu.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Khôi phục mật khẩu"
      subtitle="Nhập địa chỉ email tài khoản của bạn để nhận liên kết đặt lại mật khẩu an toàn."
    >
      <div className="space-y-6">
        {isSubmitted ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Success Card */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#131520] border border-emerald-500/30 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Yêu cầu đã được ghi nhận!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Nếu tài khoản <span className="text-teal-600 dark:text-teal-400 font-mono font-medium">{email}</span> tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi đến bạn.
                </p>
              </div>

              {/* User Friendly Help Tip */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="leading-relaxed">
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục Thư rác/Spam) của bạn để mở liên kết và tiến hành đổi mật khẩu mới.
                </p>
              </div>
            </div>

            {/* Back to Login Action */}
            <Link
              href="/login"
              className="w-full h-11 rounded-xl bg-[#141622] hover:bg-[#1a1d2e] border border-white/10 hover:border-teal-500/30 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <div className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
              >
                Địa chỉ Email tài khoản
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  autoComplete="email"
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
                  <span>Đang xử lý yêu cầu...</span>
                </>
              ) : (
                <>
                  <span>Gửi liên kết khôi phục</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Nhớ mật khẩu của bạn?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-teal-400 hover:text-teal-300 hover:underline transition-colors ml-1"
              >
                Quay lại Đăng nhập →
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

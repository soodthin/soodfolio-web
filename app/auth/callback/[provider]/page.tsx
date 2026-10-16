'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, AuthResponse } from '@/lib/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const providerParam = (params?.provider as string) || '';
  const provider = providerParam.toUpperCase(); // GITHUB or GOOGLE
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Single-flight execution lock across React StrictMode and re-renders
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (error) {
      setErrorMessage(`Bạn đã hủy hoặc từ chối cấp quyền từ ${provider}.`);
      setIsLoading(false);
      return;
    }

    if (!code) {
      setErrorMessage('Không tìm thấy mã xác thực (Authorization code).');
      setIsLoading(false);
      return;
    }

    // Prevent duplicate token exchange requests in React 19 / StrictMode
    if (hasExecutedRef.current) {
      return;
    }
    hasExecutedRef.current = true;

    const exchangeCode = async () => {
      try {
        const redirectUri = window.location.origin + window.location.pathname;

        const res = await fetch(`${API_BASE}/auth/oauth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            code,
            redirectUri,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || `Xác thực qua ${provider} thất bại.`);
        }

        const authData: AuthResponse = data;
        login(authData, true); // Persist session with rememberMe=true
        setIsSuccess(true);

        setTimeout(() => {
          router.replace('/dashboard');
        }, 800);
      } catch (err: any) {
        console.warn('OAuth exchange warning:', err);
        setErrorMessage(err.message || 'Đã có lỗi xảy ra trong quá trình trao đổi token.');
      } finally {
        setIsLoading(false);
      }
    };

    exchangeCode();
  }, [code, error, provider, login, router]);

  const providerName = provider === 'GITHUB' ? 'GitHub' : provider === 'GOOGLE' ? 'Google' : provider;

  return (
    <AuthLayout
      title={`Đang đăng nhập với ${providerName}`}
      subtitle="Đang liên kết tài khoản và tạo phiên làm việc bảo mật..."
      badgeText="OAUTH 2.0 VERIFY"
    >
      <div className="space-y-6">
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-slate-300 font-mono text-xs animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-white text-sm">Đang trao đổi mã xác thực...</p>
              <p className="text-slate-400 text-xs">Vui lòng không tắt hoặc tải lại trang.</p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="p-6 rounded-2xl bg-[#131520] border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">
              Xác thực {providerName} thành công!
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Đang chuyển hướng bạn vào Workspace...
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-rose-200">Đăng nhập không thành công</p>
                <p className="leading-relaxed text-xs">{errorMessage}</p>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full h-11 rounded-xl bg-[#141622] hover:bg-[#1a1d2e] border border-white/10 hover:border-teal-500/30 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090a0f] text-slate-400 font-mono text-sm">
        Đang khởi tạo phiên OAuth...
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}

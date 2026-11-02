'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const GITHUB_CLIENT_ID = 'Ov23li3aBSxR9V3u8J2O';
export const GOOGLE_CLIENT_ID = '622903719114-lilk7gbj5jcc138eva810gvr7uva3fqe.apps.googleusercontent.com';

export interface SocialAuthButtonsProps {
  label?: string;
  variant?: 'default' | 'hero';
  enableHotkeys?: boolean;
}

export function SocialAuthButtons({
  label = 'Hoặc đăng nhập nhanh bằng',
  variant = 'default',
  enableHotkeys = true,
}: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('soodfolio_last_auth_provider');
      if (saved) {
        setLastProvider(saved.toLowerCase());
      }
    } catch {
      // Ignore localStorage read errors in SSR/strict modes
    }
  }, []);

  const handleGitHubLogin = () => {
    setLoadingProvider('GITHUB');
    try {
      localStorage.setItem('soodfolio_last_auth_provider', 'github');
    } catch {
      // Ignore storage error
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/github`);
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
    window.location.href = githubUrl;
  };

  const handleGoogleLogin = () => {
    setLoadingProvider('GOOGLE');
    try {
      localStorage.setItem('soodfolio_last_auth_provider', 'google');
    } catch {
      // Ignore storage error
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/google`);
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = googleUrl;
  };

  // Keyboard navigation shortcuts: G for GitHub, O for Google
  useEffect(() => {
    if (!enableHotkeys || variant !== 'hero') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable);
      if (isInput) return;

      if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleGitHubLogin();
      } else if ((e.key === 'o' || e.key === 'O') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleGoogleLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableHotkeys, variant]);

  // HERO VARIANT (The Stage-Gate System: Flipped OAuth Hierarchy)
  if (variant === 'hero') {
    return (
      <div className="space-y-2.5">
        {/* GitHub Hero Primary Button (Obsidian & Alabaster) */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={handleGitHubLogin}
          aria-label="GitHub Login"
          className="w-full h-11 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-sans font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 flex items-center justify-between cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] border border-transparent"
        >
          <div className="flex items-center gap-3">
            {loadingProvider === 'GITHUB' ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
            ) : (
              <svg className="h-4 w-4 fill-current text-slate-950" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            <span>Tiếp tục với GitHub</span>
          </div>
          <div className="flex items-center gap-2">
            {lastProvider === 'github' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-teal-500/15 text-teal-800 border border-teal-600/30">
                <span className="w-1 h-1 rounded-full bg-teal-600" />
                Gần đây
              </span>
            )}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200 text-slate-800 border border-slate-300">
              G
            </kbd>
          </div>
        </button>

        {/* Google Secondary Button */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={handleGoogleLogin}
          aria-label="Google Login"
          className="w-full h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-900 dark:text-slate-200 font-sans font-medium text-xs sm:text-sm border border-slate-200/80 dark:border-white/[0.08] transition-all duration-150 flex items-center justify-between cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            {loadingProvider === 'GOOGLE' ? (
              <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
              </svg>
            )}
            <span>Tiếp tục với Google</span>
          </div>
          <div className="flex items-center gap-2">
            {lastProvider === 'google' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <span className="w-1 h-1 rounded-full bg-teal-400" />
                Gần đây
              </span>
            )}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-white/10">
              O
            </kbd>
          </div>
        </button>

        {/* Hairline Divider below buttons */}
        <div className="relative flex items-center justify-center pt-2 pb-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80 dark:border-white/[0.08]" />
          </div>
          <div className="relative px-3 bg-[#f8fafc] dark:bg-[#080d12] text-xs font-sans font-medium text-slate-500 dark:text-slate-400">
            {label}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VARIANT (Maintains 100% backward compatibility with existing tests & minimal layouts)
  return (
    <div className="space-y-3 pt-2">
      {/* Subtle Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80 dark:border-white/10" />
        </div>
        <div className="relative px-3 bg-white dark:bg-[#0c141d] text-xs font-sans font-medium text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>

      {/* 2 Small Circular Icon Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* GitHub Circular Button */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={handleGitHubLogin}
          className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-teal-500/50 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm cursor-pointer disabled:opacity-60"
          title="Đăng nhập bằng GitHub"
          aria-label="GitHub Login"
        >
          {loadingProvider === 'GITHUB' ? (
            <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
          ) : (
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          )}
        </button>

        {/* Google Circular Button */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={handleGoogleLogin}
          className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm cursor-pointer disabled:opacity-60"
          title="Đăng nhập bằng Google"
          aria-label="Google Login"
        >
          {loadingProvider === 'GOOGLE' ? (
            <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

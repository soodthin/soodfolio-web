'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Sun, Moon, Globe, ArrowLeft } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { ThemePresetKey } from '@/lib/themePresets';
import { LiveCompilingStage } from './LiveCompilingStage';

export interface StageGateAuthLayoutProps {
  children: React.ReactNode;
  badgeText: string;
  title: string;
  subtitle: string;
  fullName?: string;
  username?: string;
  activeTheme?: ThemePresetKey;
  onThemeChange?: (theme: ThemePresetKey) => void;
  footerPrompt: {
    question: string;
    actionText: string;
    actionHref: string;
  };
}

export function StageGateAuthLayout({
  children,
  badgeText,
  title,
  subtitle,
  fullName = '',
  username = '',
  activeTheme = 'classic-deck',
  onThemeChange,
  footerPrompt,
}: StageGateAuthLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Locale>('vi');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
      const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);

      const savedLang = localStorage.getItem('soodfolio-lang') as Locale | null;
      if (savedLang) setLang(savedLang);
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('soodfolio-theme', nextTheme);
    } catch {
      // Ignore
    }
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const toggleLang = () => {
    const nextLang: Locale = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    try {
      localStorage.setItem('soodfolio-lang', nextLang);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      {/* =========================================================================
          LEFT PANE (42% Viewport on Desktop) — "The Keyboard-First Cockpit"
         ========================================================================= */}
      <div className="w-full lg:w-[42%] min-h-[100dvh] flex flex-col justify-between p-6 sm:p-9 lg:p-11 z-20 border-r border-slate-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#080d12]/95 backdrop-blur-xl shrink-0">
        {/* Cockpit Top Navigation */}
        <header className="flex items-center justify-between pb-6 sm:pb-8 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
            title="SoodFolio Home"
          >
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-sm text-slate-950 dark:text-white font-sans">
                SoodFolio
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-[#2dd4bf]" />
            </div>
          </Link>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              className="h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0d131a] dark:hover:bg-[#141b24] border border-slate-200 dark:border-white/[0.06] text-xs font-sans font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              <Globe className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0d131a] dark:hover:bg-[#141b24] border border-slate-200 dark:border-white/[0.06] text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-[#2dd4bf]" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-700" />
              )}
            </button>

            {/* Back to Home Link */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors ml-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Trang chủ</span>
            </Link>
          </div>
        </header>

        {/* Cockpit Main Form Content */}
        <main className="my-auto py-2 sm:py-4 space-y-4">
          {/* Eyebrow Badge & Keynote Headers */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
              <span className="uppercase tracking-wider">{badgeText}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Children: Flipped OAuth Buttons + Input Fields + Actions */}
          <div className="pt-2">{children}</div>

          {/* Footer Switcher (e.g. Register <-> Login) */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>{footerPrompt.question}</span>{' '}
            <Link
              href={footerPrompt.actionHref}
              className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 hover:underline transition-colors"
            >
              {footerPrompt.actionText}
            </Link>
          </div>
        </main>

        {/* Subtle Bottom Architectural Note */}
        <footer className="pt-6 sm:pt-8 text-center sm:text-left text-[11px] text-slate-400 dark:text-slate-500 font-sans flex-shrink-0">
          © {new Date().getFullYear()} SoodFolio · Kiến trúc hồ sơ năng lực dành cho kỹ sư cấp cao
        </footer>
      </div>

      {/* =========================================================================
          RIGHT PANE (58% Viewport on Desktop) — "The Live Compiling Stage"
         ========================================================================= */}
      <div className="w-full lg:w-[58%] min-h-[460px] lg:min-h-[100dvh] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative overflow-hidden bg-slate-100 dark:bg-[#05080c] border-t lg:border-t-0 border-slate-200/80 dark:border-white/[0.06]">
        <LiveCompilingStage
          fullName={fullName}
          username={username}
          activeTheme={activeTheme}
          onThemeChange={onThemeChange}
        />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Sun, Moon, Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  cardWidth?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  badgeText,
  cardWidth = 'max-w-md',
}: AuthLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Locale>('vi');

  useEffect(() => {
    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);

    const savedLang = localStorage.getItem('soodfolio-lang') as Locale | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('soodfolio-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const toggleLang = () => {
    const nextLang: Locale = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    localStorage.setItem('soodfolio-lang', nextLang);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
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

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLang}
            className="h-7 px-2.5 rounded-lg bg-white dark:bg-[#0d131a] hover:bg-slate-100 dark:hover:bg-[#141b24] border border-slate-200/60 dark:border-white/[0.05] text-xs font-sans font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-white dark:bg-[#0d131a] hover:bg-slate-100 dark:hover:bg-[#141b24] border border-slate-200/60 dark:border-white/[0.05] text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-[#2dd4bf]" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-slate-700" />
            )}
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="hidden sm:inline-flex text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors ml-1"
          >
            ← Trang chủ
          </Link>
        </div>
      </header>

      {/* Main Centered Content Area */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-6 w-full max-w-4xl mx-auto my-auto">
        {/* Title & Subtitle OUTSIDE and ABOVE the card */}
        <div className="text-center mb-4 space-y-1 animate-in fade-in duration-300 flex-shrink-0">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-1">
              <span>{badgeText}</span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-normal">
            {subtitle}
          </p>
        </div>

        {/* The Card */}
        <div className={`w-full ${cardWidth} p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200/60 dark:border-white/[0.05] transition-colors duration-200`}>
          {children}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
        © {new Date().getFullYear()} SoodFolio • Kiến trúc hồ sơ năng lực dành cho kỹ sư cấp cao
      </footer>
    </div>
  );
}

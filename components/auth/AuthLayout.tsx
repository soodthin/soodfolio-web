'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Sparkles, Layers, Briefcase, Palette } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function AuthLayout({ children, title, subtitle, badgeText = 'STUDIO ACCESS' }: AuthLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const isDark = saved ? saved === 'dark' : document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('soodfolio-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex flex-col justify-between bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden selection:bg-teal-500/20 selection:text-teal-600 dark:selection:text-teal-300">
      {/* Background Subtle Editorial Grid (Matches Home Page) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-40"
        style={{
          backgroundImage: theme === 'dark'
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      {/* Gentle Ambient Glow (Matte finish, non-neon) */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)',
        }}
      />

      {/* Floating Presentation Deck Previews in Background (Quiet Luxury Depth, Multidisciplinary) */}
      <div className="hidden xl:block absolute top-24 left-12 w-72 p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md shadow-sm pointer-events-none -rotate-3 opacity-40 dark:opacity-30 transition-all">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-teal-600 dark:text-teal-400 font-bold uppercase mb-2">
          <Palette className="h-3 w-3" />
          <span>Chapter 01 // Brand & Design</span>
        </div>
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Elena Vance</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          Global brand identity system across 420+ touchpoints with fluid spatial interactions.
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-24 right-12 w-80 p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md shadow-sm pointer-events-none rotate-2 opacity-40 dark:opacity-30 transition-all">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-teal-600 dark:text-teal-400 font-bold uppercase mb-2">
          <Briefcase className="h-3 w-3" />
          <span>Chapter 02 // Product Leadership</span>
        </div>
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Marcus Chen</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          Accelerated quarterly conversion by +34% through zero-latency collaborative pipelines.
        </div>
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group transition-transform active:scale-95">
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-lg text-slate-950 dark:text-white font-sans">
              SOODFOLIO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-[#2dd4bf]" />
          </div>
        </Link>

        {/* Right Header Controls: Theme Switcher & Home Link */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-[#0d131a] hover:bg-slate-100 dark:hover:bg-[#141b24] border border-slate-200 dark:border-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#2dd4bf]" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <Link
            href="/"
            className="text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-2 py-1"
          >
            ← Trang chủ
          </Link>
        </div>
      </header>

      {/* Center Main Stage Container */}
      <main className="relative z-20 w-full max-w-md mx-auto px-4 py-8 sm:py-12 my-auto">
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0d131a] border border-slate-200/90 dark:border-white/10 p-6 sm:p-9 shadow-[0_16px_50px_rgba(15,23,42,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all">
          
          {/* Card Eyebrow & Title */}
          <div className="space-y-2 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-[#2dd4bf] border border-teal-200 dark:border-teal-700/50">
              <Sparkles className="h-3 w-3" />
              <span>{badgeText}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Content Injected */}
          {children}
        </div>

        {/* Quiet Trust Footer Below Card */}
        <p className="text-center text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-6">
          Bảo mật tiêu chuẩn doanh nghiệp • SoodFolio 2026
        </p>
      </main>

      {/* Bottom Global Footer Links */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/[0.06]">
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Điều khoản sử dụng</Link>
          <span>•</span>
          <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Chính sách bảo mật</Link>
          <span>•</span>
          <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Trung tâm trợ giúp</Link>
        </div>
        <div className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
          The Career Presentation Standard
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Layers, Globe } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  cardWidth?: string;
}

const LEFT_PORTFOLIO_SLIDES = [
  {
    slideNumber: 'SLIDE 01',
    category: 'BRAND & DESIGN',
    author: 'Elena Vance',
    role: 'Principal Product Designer',
    tagline: 'Crafting fluid spatial interfaces & design systems.',
    tags: ['Figma', 'Design Systems', 'Design Tokens'],
    metric: '+38% Activation',
  },
  {
    slideNumber: 'SLIDE 02',
    category: 'CASE STUDY',
    author: 'Lumina Spatial OS',
    role: 'Interactive WebGL Canvas',
    tagline: 'Multi-threaded gesture canvas with 120fps motion fidelity.',
    tags: ['Next.js', 'Three.js', 'Tailwind'],
    metric: '120fps Fidelity',
  },
  {
    slideNumber: 'SLIDE 03',
    category: 'CAREER TIMELINE',
    author: 'Linear Labs',
    role: 'Head of Product Design (2022 — Present)',
    tagline: 'Scaled core design team from 3 to 24 contributors.',
    tags: ['Leadership', 'Design Operations'],
    metric: 'Team Scale 8x',
  },
  {
    slideNumber: 'SLIDE 04',
    category: 'CORE CAPABILITIES',
    author: 'Competencies',
    role: 'Design Architecture & Motion',
    tagline: 'Design System Engineering, Micro-interactions, Accessibility.',
    tags: ['Accessibility', 'Motion', 'WCAG AAA'],
    metric: 'A11y Verified',
  },
];

const RIGHT_PORTFOLIO_SLIDES = [
  {
    slideNumber: 'SLIDE 01',
    category: 'SYSTEMS & AI',
    author: 'Marcus Chen',
    role: 'Staff Infrastructure Architect',
    tagline: 'Distributed high-throughput event streaming & cloud mesh.',
    tags: ['Go', 'Rust', 'Kubernetes'],
    metric: '99.999% SLA',
  },
  {
    slideNumber: 'SLIDE 02',
    category: 'CASE STUDY',
    author: 'HyperFlow Broker',
    role: 'Real-time Telemetry Engine',
    tagline: 'Processing 4.2M events/sec with sub-millisecond p99 latency.',
    tags: ['Kafka', 'eBPF', 'ClickHouse'],
    metric: '4.2M req/sec',
  },
  {
    slideNumber: 'SLIDE 03',
    category: 'CAREER TIMELINE',
    author: 'Stripe Global',
    role: 'Principal Systems Engineer (2021 — 2024)',
    tagline: 'Architected multi-region failover mesh across 8 data centers.',
    tags: ['Distributed Systems', 'Cloud Mesh'],
    metric: 'Multi-Region Mesh',
  },
  {
    slideNumber: 'SLIDE 04',
    category: 'CORE CAPABILITIES',
    author: 'Competencies',
    role: 'High Concurrency & Storage',
    tagline: 'Distributed Consensus, Zero-Trust Security, Chaos Engineering.',
    tags: ['Consensus', 'PostgreSQL', 'GRPC'],
    metric: 'Zero Downtime',
  },
];

export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  cardWidth = 'max-w-lg sm:max-w-xl'
}: AuthLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);

    const savedLang = localStorage.getItem('soodfolio-lang') as 'vi' | 'en' | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('soodfolio-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const toggleLang = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    localStorage.setItem('soodfolio-lang', next);
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex flex-col justify-between bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden selection:bg-teal-500/20 selection:text-teal-600 dark:selection:text-teal-300">
      
      {/* Background Subtle Editorial Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30 z-0"
        style={{
          backgroundImage: theme === 'dark'
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      {/* Gentle Radial Atmosphere */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-15 z-0"
        style={{
          background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)',
        }}
      />

      {/* ARTISTIC BACKGROUND PREVIEW: LEFT COLUMN (Scrolls Downward) */}
      <div 
        className="hidden lg:block absolute left-4 xl:left-8 top-12 bottom-12 w-60 xl:w-68 overflow-hidden pointer-events-none opacity-25 dark:opacity-20 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="space-y-3.5 animate-marquee-down">
          {[...LEFT_PORTFOLIO_SLIDES, ...LEFT_PORTFOLIO_SLIDES].map((slide, idx) => (
            <div 
              key={`left-${idx}`}
              className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">
                <span>{slide.slideNumber}</span>
                <span className="uppercase tracking-wider">{slide.category}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{slide.author}</div>
                <div className="text-[11px] font-medium text-teal-600 dark:text-teal-400">{slide.role}</div>
              </div>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {slide.tagline}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04] text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[110px]">{slide.tags.join(' · ')}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{slide.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTISTIC BACKGROUND PREVIEW: RIGHT COLUMN (Scrolls Upward) */}
      <div 
        className="hidden lg:block absolute right-4 xl:right-8 top-12 bottom-12 w-60 xl:w-68 overflow-hidden pointer-events-none opacity-25 dark:opacity-20 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="space-y-3.5 animate-marquee-up">
          {[...RIGHT_PORTFOLIO_SLIDES, ...RIGHT_PORTFOLIO_SLIDES].map((slide, idx) => (
            <div 
              key={`right-${idx}`}
              className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">
                <span>{slide.slideNumber}</span>
                <span className="uppercase tracking-wider">{slide.category}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{slide.author}</div>
                <div className="text-[11px] font-medium text-teal-600 dark:text-teal-400">{slide.role}</div>
              </div>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {slide.tagline}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04] text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[110px]">{slide.tags.join(' · ')}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{slide.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Header Navigation (Compact padding) */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="h-7 w-7 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-base text-slate-950 dark:text-white font-sans">
              SOODFOLIO
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
            className="h-7 px-2 rounded-lg bg-white dark:bg-[#0d131a] hover:bg-slate-100 dark:hover:bg-[#141b24] border border-slate-200 dark:border-white/10 text-[11px] font-mono font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-white dark:bg-[#0d131a] hover:bg-slate-100 dark:hover:bg-[#141b24] border border-slate-200 dark:border-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-sm cursor-pointer"
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

      {/* Main Centered Content Area (Optimized height to prevent scrolling) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-1 sm:py-2 w-full max-w-4xl mx-auto my-auto">
        
        {/* Title & Subtitle OUTSIDE and ABOVE the card */}
        <div className="text-center mb-3 sm:mb-4 space-y-0.5 animate-in fade-in duration-300 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-normal">
            {subtitle}
          </p>
        </div>

        {/* The Card (Comfortable compact padding, fits standard viewports) */}
        <div className={`w-full ${cardWidth} p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0c141d]/90 border border-slate-200/80 dark:border-white/10 shadow-lg backdrop-blur-xl transition-all duration-200`}>
          {children}
        </div>
      </main>

      {/* Subtle Footer (Compact height) */}
      <footer className="relative z-20 w-full py-2 text-center text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-600 flex-shrink-0">
        SOODFOLIO STUDIO // MODERN SLIDE DECK PLATFORM
      </footer>
    </div>
  );
}

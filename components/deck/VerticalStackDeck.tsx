'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { PortfolioData } from '@/types/portfolio';
import { ProjectImageStack } from '@/components/deck/ProjectImageStack';
import { Locale, translations } from '@/lib/i18n';
import { getThemePreset } from '@/lib/themePresets';
import {
  playSlideSwitchSound,
  toggleMuteSound,
  getMuteState,
  playClickSound,
} from '@/lib/sound';
import {
  Volume2,
  VolumeX,
  Share2,
  Maximize2,
  Minimize2,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Sun,
  Moon,
  Globe,
  ArrowUp,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Layers,
  Calendar,
  Briefcase,
  Clock,
  Building2,
  ShieldCheck,
  Terminal,
  FileText,
  Phone,
  Sparkles,
  Award,
  Coffee,
  GitPullRequest,
  GitCommit,
  Zap,
  Database,
} from 'lucide-react';


function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}





// Live Saigon Clock Component (GMT+7)
function SaigonLiveClock() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTimeStr(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs text-slate-700 dark:text-slate-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>{timeStr || '12:00:00'} (GMT+7) · Ho Chi Minh City</span>
    </div>
  );
}

interface VerticalStackDeckProps {
  data: PortfolioData;
  variant?: string | null;
}

// Context Mapping for Skill section hover tooltips
const SKILL_CONTEXTS: Record<string, { type: 'exp' | 'project' | 'edu' | 'tool'; label: string }[]> = {
  JavaScript: [
    { type: 'project', label: 'FlexiConnect Web' },
    { type: 'project', label: 'Food Delivery & Restaurant App' },
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  TypeScript: [
    { type: 'exp', label: 'BW Industrial Dev JSC' },
    { type: 'project', label: 'Dev Portfolio Engine' },
  ],
  Java: [
    { type: 'project', label: 'FlexiConnect Web (Spring Boot)' },
  ],
  Python: [
    { type: 'exp', label: 'BW Industrial Dev JSC (FastAPI)' },
    { type: 'project', label: 'Food Delivery App (Django)' },
  ],
  'C++': [
    { type: 'edu', label: 'HCMCOU CS Fundamentals' },
  ],
  ReactJS: [
    { type: 'project', label: 'FlexiConnect Web' },
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  'Next.js': [
    { type: 'project', label: 'Dev Portfolio Engine' },
  ],
  'Spring Boot': [
    { type: 'project', label: 'FlexiConnect Web' },
  ],
  FastAPI: [
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  Django: [
    { type: 'project', label: 'Food Delivery & Restaurant App' },
  ],
  'Tailwind CSS': [
    { type: 'project', label: 'FlexiConnect Web' },
    { type: 'project', label: 'Dev Portfolio Engine' },
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  'RESTful API': [
    { type: 'project', label: 'FlexiConnect Web' },
    { type: 'project', label: 'Food Delivery App' },
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  PostgreSQL: [
    { type: 'exp', label: 'BW Industrial Dev JSC' },
    { type: 'project', label: 'Food Delivery & Restaurant App' },
  ],
  MySQL: [
    { type: 'project', label: 'FlexiConnect Web' },
  ],
  Redis: [
    { type: 'exp', label: 'BW Industrial Dev JSC' },
  ],
  Git: [
    { type: 'exp', label: 'BW Industrial Dev JSC' },
    { type: 'project', label: 'All Production Repositories' },
  ],
  'GitHub Actions': [
    { type: 'project', label: 'Dev Portfolio Engine (CI/CD)' },
  ],
  Postman: [
    { type: 'exp', label: 'BW Industrial Dev JSC (API Testing)' },
    { type: 'project', label: 'FlexiConnect Web' },
  ],
  Render: [
    { type: 'project', label: 'FlexiConnect Web (Cloud Host)' },
  ],
  'Claude Code': [
    { type: 'tool', label: 'AI Architecture & Workflows' },
  ],
  Codex: [
    { type: 'tool', label: 'AI Pair Programming' },
  ],
  'Antigravity (IDE)': [
    { type: 'tool', label: 'SoodFolio Platform Development' },
  ],
  'Prompt Engineering': [
    { type: 'exp', label: 'BWID Bank Statement OCR Fallback' },
  ],
  'Code Verification': [
    { type: 'exp', label: 'BWID Release Quality Control' },
  ],
};

function SkillWithContext({ name, accentColor }: { name: string; accentColor?: string }) {
  const contexts = SKILL_CONTEXTS[name] || [];
  return (
    <span className="relative group/skill inline-block cursor-pointer">
      <span
        className="underline decoration-dotted underline-offset-4 transition-colors hover:opacity-80"
        style={{ textDecorationColor: accentColor ? `${accentColor}80` : 'rgba(148, 163, 184, 0.5)' }}
      >
        {name}
      </span>
      {contexts.length > 0 && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/skill:flex flex-col gap-1 z-30 px-3 py-2 rounded-xl bg-slate-950/95 dark:bg-[#0c1020]/95 border border-slate-700/70 dark:border-white/15 text-xs font-sans shadow-2xl backdrop-blur-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 text-left">
          <span className="text-xs text-slate-400 font-medium">
            Được áp dụng tại
          </span>
          {contexts.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5 text-slate-200">
              <span
                className="text-xs font-semibold"
                style={{ color: accentColor || 'var(--accent-primary)' }}
              >
                {c.type === 'exp' ? 'Kinh nghiệm' : c.type === 'project' ? 'Dự án' : 'Ứng dụng'} •
              </span>
              <span className="font-medium">{c.label}</span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

export function VerticalStackDeck({ data, variant }: VerticalStackDeckProps) {
  const activePresetKey = variant || data.themeConfig || 'classic-deck';
  const activePreset = getThemePreset(activePresetKey);
  const isSpotlight = activePresetKey === 'spotlight-focus';
  const isTerminal = activePresetKey === 'terminal-matrix';
  const isEditorial = activePresetKey === 'editorial-clean';

  const [activeIdx, setActiveIdx] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Floating Back to Top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScrollToTop = useCallback(() => {
    playClickSound();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 0.9,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lang, setLang] = useState<Locale>('en');

  // Load language preference from localStorage (Default: English)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('soodfolio_lang') as Locale | null;
      if (savedLang === 'vi' || savedLang === 'en') {
        setLang(savedLang);
      }
    }
  }, []);

  const toggleLanguage = () => {
    playClickSound();
    const nextLang = lang === 'en' ? 'vi' : 'en';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soodfolio_lang', nextLang);
    }
  };

  const t = translations[lang];
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize theme from localStorage and Lenis scroll
  useEffect(() => {
    setIsMuted(getMuteState());

    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const toggleTheme = () => {
    playClickSound();
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('soodfolio-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Flow specified by user: Summary -> Exp -> Project -> Skill -> Contact
  const navItems = useMemo(
    () => [
      { id: 'summary', label: t.nav.summary },
      { id: 'experience', label: t.nav.experience },
      { id: 'works', label: t.nav.works },
      { id: 'skills', label: t.nav.skills },
      { id: 'contact', label: t.nav.contact },
    ],
    [t.nav]
  );

  const scrollToSection = useCallback((id: string) => {
    playClickSound();
    const targetId = id === 'works' ? 'project-01' : id;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${targetId}`, { offset: -90, duration: 0.8 });
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll tracking: calculate active section and project titles to create focal depth
  useEffect(() => {
    // Initial display for 2s on load, then auto-dim
    setIsScrolling(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
      const sectionIds = ['summary', 'experience', 'works', 'skills', 'contact'];
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollTop(scrollY > 400);
      const focalY = scrollY + 220;

      let currentIdx = 0;
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el && focalY >= el.offsetTop) {
          currentIdx = i;
        }
      }
      setActiveIdx(currentIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const toggleSound = () => {
    const muted = toggleMuteSound();
    setIsMuted(muted);
    if (!muted) playClickSound();
  };

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const shareDeck = () => {
    playClickSound();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const copyEmail = () => {
    playClickSound();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('thinhthai963@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const directEmail = 'thinhthai963@gmail.com';
  const userAvatar = data.avatarUrl || '/images/avatar.jpg';

  // Multi-image collections for Project Image Stacks (Ngan xep hinh)
  const project1Images = ['/images/flexiconnect1.png', '/images/flexiconnect2.png'];
  const project2Images = ['/images/restaurant1.png', '/images/restaurant2.png'];

  return (
    <main
      data-theme-preset={activePresetKey}
      style={{
        fontFamily: activePreset.fontVar,
        backgroundColor: theme === 'dark' ? activePreset.bgHex : undefined,
        ['--accent-primary' as any]: activePreset.accentHex,
        ['--accent-muted' as any]: activePreset.accentMutedHex,
        ['--bg-canvas' as any]: activePreset.bgHex,
        ['--surface-card' as any]: activePreset.surfaceHex,
      }}
      className={`relative min-h-screen bg-[#f8fafc] text-slate-800 dark:text-slate-100 selection:bg-teal-500/30 selection:text-white antialiased transition-colors duration-200 ${
        isTerminal ? 'font-mono' : ''
      }`}
    >
      {/* ========================================================================= */}
      {/* EDITORIAL FLOATING HEADER                                                 */}
      {/* ========================================================================= */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-12 py-3.5 flex items-center justify-between backdrop-blur-md bg-[#f8fafc]/90 border-b border-[#e2e8f0] dark:border-white/[0.07] transition-colors duration-200"
        style={{
          backgroundColor: theme === 'dark' ? `${activePreset.bgHex}e6` : undefined,
        }}
      >
        {/* Left: Identity Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: activePreset.accentHex }}
          />
          <span className="font-sans text-xs text-slate-950 dark:text-white font-bold">
            {data.title || 'Thai Do Thinh'}
          </span>
          <span className="hidden sm:inline-block text-slate-400 dark:text-slate-600 text-xs">•</span>
          <span className="hidden sm:inline-block font-sans text-xs text-slate-700 dark:text-slate-400 font-medium">
            {t.header.role}
          </span>
        </div>

        {/* Right: Action Controls (Theme, Sound, Fullscreen, Contact) */}
        <div className="flex items-center gap-2">
          {/* Language Toggle (EN / VI) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs font-bold"
            title={t.header.langTooltip}
          >
            <Globe className="h-3.5 w-3.5" style={{ color: activePreset.accentHex }} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={theme === 'dark' ? t.header.lightTooltip : t.header.darkTooltip}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" style={{ color: activePreset.accentHex }} />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Share Deck URL */}
          <button
            type="button"
            onClick={shareDeck}
            className="p-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={t.header.shareTooltip}
          >
            {copiedShare ? (
              <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={isMuted ? t.header.soundOnTooltip : t.header.soundOffTooltip}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4" style={{ color: activePreset.accentHex }} />
            )}
          </button>

          {/* Fullscreen Toggle (Hidden on mobile phones) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" style={{ color: activePreset.accentHex }} />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          {/* Direct CTA */}
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            style={{
              backgroundColor: activePreset.accentHex,
              color: activePresetKey === 'editorial-clean' ? '#121110' : '#080d12',
            }}
            className="ml-1 px-4 py-1.5 rounded-lg hover:opacity-90 font-sans font-semibold text-xs transition-opacity cursor-pointer active:scale-95"
          >
            {t.header.contactBtn}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FLOATING RIGHT SECTION TRACKER (AUTO-DIMS WHEN IDLE)                      */}
      {/* ========================================================================= */}
      <aside 
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden 2xl:flex flex-col items-end gap-3 transition-opacity duration-500 ease-out ${
          isScrolling ? 'opacity-100' : 'opacity-20 hover:opacity-100'
        }`}
      >
        {navItems.map((item, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center gap-2 cursor-pointer py-1 text-right transition-colors"
            >
              <span
                className={`font-sans text-xs transition-all duration-200 ${
                  isActive
                    ? 'font-semibold opacity-100 translate-x-0'
                    : 'text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 translate-x-1 group-hover:translate-x-0'
                }`}
                style={isActive ? { color: activePreset.accentHex } : undefined}
              >
                {item.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? 'w-2 h-2'
                    : 'w-1.5 h-1.5 bg-slate-300 dark:bg-white/20 group-hover:bg-slate-400 dark:group-hover:bg-white/50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: activePreset.accentHex,
                        boxShadow: `0 0 8px ${activePreset.accentHex}99`,
                      }
                    : undefined
                }
              />
            </button>
          );
        })}
      </aside>

      {/* Main Content Container - Expanded Full Width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 pt-28 pb-20 space-y-32">
        {/* ======================================================================= */}
        {/* SECTION 01: HERO (MASSIVE TYPOGRAPHY & OVERLAPPING PORTRAIT)           */}
        {/* ======================================================================= */}
        <section
          id="summary"
          className={`w-full max-w-[1280px] mx-auto space-y-10 pt-4 pb-4 ${
            isSpotlight ? 'text-center' : ''
          }`}
          style={{ paddingInline: 'clamp(20px, 5vw, 72px)' }}
        >
          {/* Eyebrow Status Ribbon */}
          <div className={`flex flex-wrap items-center ${isSpotlight ? 'justify-center' : ''} gap-3 sm:gap-4 text-xs font-mono transition-opacity duration-500 ${
            activeIdx > 0 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}>
            {isTerminal && (
              <div className="flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-950/20 font-mono text-xs text-emerald-400">
                <Terminal className="h-3.5 w-3.5 shrink-0" />
                <span>soodfolio@production:~$ init --profile active</span>
              </div>
            )}
            {isEditorial && (
              <div className="font-mono text-[11px] uppercase tracking-widest text-amber-500/90 font-semibold">
                Volume 2026 · Curated Monograph
              </div>
            )}
            <span className="inline-flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: activePreset.accentHex,
                  boxShadow: `0 0 8px ${activePreset.accentHex}99`,
                }}
              />
              {t.hero.available}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-slate-700 dark:text-slate-400">{t.hero.location}</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-slate-700 dark:text-slate-400">{t.hero.school}</span>
          </div>

          {/* Top Row: [ Name 2 lines + Title line ] [ Circular Avatar ] */}
          <div className={`grid grid-cols-1 ${
            isSpotlight
              ? 'justify-items-center text-center'
              : 'min-[820px]:grid-cols-[1fr_260px] lg:min-[820px]:grid-cols-[1fr_280px]'
          } gap-8 lg:gap-12 items-center`}>
            {/* Left Column: Name (2 lines: THAI DO / THINH) & Title Line */}
            <div className={`min-w-0 space-y-3 sm:space-y-4 ${isSpotlight ? 'text-center order-2 sm:order-1' : ''}`}>
              <h1
                className="font-black uppercase tracking-tight text-slate-950 dark:text-white leading-[0.88] select-none"
                style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.75rem)' }}
              >
                <span className="block">THAI DO</span>
                <span className="block">THINH</span>
              </h1>

              {/* Title Line */}
              <p
                className="text-sm sm:text-base lg:text-lg font-sans font-medium pt-1"
                style={{ color: activePreset.accentHex }}
              >
                {lang === 'vi' ? t.hero.tagline : (data.tagline ? data.tagline.replace(/\s*\/\/\s*/g, ' · ') : t.hero.tagline)}
              </p>
            </div>

            {/* Right Column: Circular Avatar */}
            <div className={`flex justify-center ${isSpotlight ? 'order-1 sm:order-2' : 'min-[820px]:justify-end'} items-center`}>
              <div
                className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 aspect-square overflow-hidden rounded-full border-4 shadow-xl transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#f0fdf4',
                  borderColor: activePreset.accentHex,
                  boxShadow: `0 0 35px ${activePreset.accentHex}40`,
                }}
              >
                <img
                  src={userAvatar}
                  alt={data.title || 'Thai Do Thinh'}
                  className="w-full h-full object-cover scale-[1.25] transition-transform duration-500 hover:scale-[1.32]"
                  style={{ objectPosition: '50% 72%' }}
                />
              </div>
            </div>
          </div>

          {/* Intro Paragraph (nội dung - max-width 60ch) */}
          <div className={`pt-2 ${isSpotlight ? 'text-center max-w-2xl mx-auto' : ''}`}>
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-300 leading-relaxed font-sans w-full">
              {lang === 'vi' ? t.hero.bio : (data.bio || t.hero.bio)}
            </p>
          </div>

          {/* Stats Row Moved Below Intro Content */}
          <div className={`border-t border-[#e2e8f0] dark:border-white/10 pt-6 sm:pt-8 grid grid-cols-1 min-[820px]:grid-cols-3 gap-6 sm:gap-8 ${
            isSpotlight ? 'text-center' : ''
          }`}>
            {/* Stat 1 */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-slate-950 dark:text-white tracking-tight tabular-nums whitespace-nowrap">
                10+
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-sans">
                {t.hero.stat1Label}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-slate-950 dark:text-white tracking-tight tabular-nums whitespace-nowrap">
                1d → 2h
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-sans">
                {t.hero.stat2Label}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-slate-950 dark:text-white tracking-tight tabular-nums whitespace-nowrap">
                75%
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-sans">
                {t.hero.stat3Label}
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 02: EXPERIENCE (MINIMALIST WORK HISTORY & EDUCATION)           */}
        {/* ======================================================================= */}
        {/* ======================================================================= */}
        {/* SECTION 02: EXPERIENCE (MINIMALIST WORK HISTORY & EDUCATION)           */}
        {/* ======================================================================= */}
        <section id="experience" className="space-y-10 pt-6">
          {/* Section Header (Dims slightly when scrolled past to create depth) */}
          <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
            activeIdx > 1 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}>
            <div>
              <span
                className="font-sans text-xs block mb-1 font-semibold"
                style={{ color: activePreset.accentHex }}
              >
                {isTerminal ? `> ${t.experience.eyebrow}` : isEditorial ? `CHRONICLE · ${t.experience.eyebrow}` : t.experience.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                {t.experience.title}
              </h2>
            </div>
          </div>

          {/* Career Lifecycle Timeline Track */}
          <div className="relative pl-7 sm:pl-10 lg:pl-12 space-y-10 sm:space-y-12">
            {/* Continuous Vertical Career Lifecycle Spine */}
            <div 
              className="absolute left-[11px] sm:left-[15px] lg:left-[19px] top-3 bottom-6 w-[2px] pointer-events-none" 
              style={{ backgroundColor: `${activePreset.accentHex}33` }}
              aria-hidden="true"
            />

            {/* CAREER MILESTONE 01: Corporate Engineering Experience */}
            <div className="relative space-y-3">
              {/* Timeline Node Marker 01 */}
              <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-1 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                    borderColor: activePreset.accentHex,
                    boxShadow: `0 0 10px ${activePreset.accentHex}40`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activePreset.accentHex }}
                  />
                </div>
              </div>

              {/* Milestone Header */}
              <div
                className="flex items-center gap-2 font-mono text-xs font-bold"
                style={{ color: activePreset.accentHex }}
              >
                <span>01</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>{isTerminal ? `exec_log.${t.experience.tag1.toLowerCase()}` : t.experience.tag1}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">{t.experience.period1}</span>
              </div>

              {/* Minimalist Corporate Experience Card */}
              <div
                className="p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] dark:border-white/[0.07] bg-white/95 dark:backdrop-blur-sm space-y-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:shadow-xl"
                style={{
                  backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
                  borderColor: isTerminal ? `${activePreset.accentHex}33` : isEditorial ? 'rgba(245, 158, 11, 0.2)' : undefined,
                }}
              >
            {/* Header: Role, Company, Period */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-[#e2e8f0] dark:border-white/10">
              <div className="space-y-1">
                <div
                  className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border"
                  style={{
                    backgroundColor: activePreset.accentMutedHex,
                    color: activePreset.accentHex,
                    borderColor: `${activePreset.accentHex}33`,
                  }}
                >
                  <Building2 className="h-3 w-3" />
                  <span>BW Industrial Development JSC</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white pt-1">
                  {t.experience.role1}
                </h3>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                  <span>{t.experience.location1}</span>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="px-3 py-1 rounded-lg bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">
                  Oct 2025 — Apr 2026
                </span>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 font-semibold">
                  {t.experience.badge1}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {t.experience.desc1}
            </p>

            {/* 4 Clean High-Signal Engineering Accomplishments */}
            <div className="space-y-3 pt-1">
              <div
                className="text-xs font-sans font-semibold"
                style={{ color: activePreset.accentHex }}
              >
                {t.experience.deliverablesHeader}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-white/[0.02] border border-[#e2e8f0]/80 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white font-mono text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: activePreset.accentHex }} />
                    <span>Bank Statement Parsing (10+ Banks)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Built FastAPI REST parsers for Vietcombank, Techcombank, BIDV, ACB, MBBank, with Gemini OCR fallback for scanned receipts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-white/[0.02] border border-[#e2e8f0]/80 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white font-mono text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: activePreset.accentHex }} />
                    <span>Cash Report Automation (1 Day → 2 Hrs)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Engineered session-based reconciliation matching multi-file cash reports based on finance rule feedback, cutting processing time by 75%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-white/[0.02] border border-[#e2e8f0]/80 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white font-mono text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: activePreset.accentHex }} />
                    <span>Enterprise Security & Access Control</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Implemented secure single sign-on (SSO), encrypted session management, and granular permission controls for internal finance teams.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-white/[0.02] border border-[#e2e8f0]/80 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white font-mono text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: activePreset.accentHex }} />
                    <span>Real-time Status Tracking & Monitoring</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Built responsive user interface with live progress tracking for long-running workflows, automated notifications, and operational metrics.
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-2 border-t border-[#e2e8f0] dark:border-white/10 flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">TECH STACK:</span>
              {['FastAPI', 'Python', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Cloud Auth', 'Realtime SSE', 'AI Engine'].map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-md bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

            </div>

            {/* CAREER MILESTONE 02: Academic Computer Science Foundation */}
            <div className="relative space-y-3">
              {/* Timeline Node Marker 02 */}
              <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-1 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                    borderColor: activePreset.accentHex,
                    boxShadow: `0 0 10px ${activePreset.accentHex}40`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activePreset.accentHex }}
                  />
                </div>
              </div>

              {/* Milestone Header */}
              <div
                className="flex items-center gap-2 font-mono text-xs font-bold"
                style={{ color: activePreset.accentHex }}
              >
                <span>02</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>{isTerminal ? `edu_log.${t.experience.eduTag.toLowerCase()}` : t.experience.eduTag}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">{t.experience.eduPeriod}</span>
              </div>

              {/* Academic Foundation: Minimalist Clean Row */}
              <div
                className="p-6 rounded-2xl border border-[#e2e8f0] dark:border-white/10 bg-white dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono"
                style={{
                  backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
                }}
              >
            <div>
              <div
                className="text-xs font-semibold font-sans flex items-center gap-2"
                style={{ color: activePreset.accentHex }}
              >
                <Award className="h-3.5 w-3.5" />
                <span>Education</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-0.5 font-sans">
                {t.experience.eduSchool}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 pt-0.5">
                {t.experience.eduDegree} · Oct 2022 — Present (Final Year)
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold shrink-0 self-start sm:self-auto">
              Undergraduate
            </span>
          </div>
        </div>
      </div>
    </section>

        {/* ======================================================================= */}
        {/* SECTION 03: PROJECTS (SELECTED WORKS - CONTENT LEFT, STACK RIGHT)       */}
        {/* ======================================================================= */}
        <section id="works" className="space-y-16 pt-6">
          {/* Section Header (Dims slightly when scrolled past to create depth) */}
          <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
            activeIdx > 2 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}>
            <div>
              <span
                className="font-sans text-xs font-semibold block mb-1"
                style={{ color: activePreset.accentHex }}
              >
                {isTerminal ? `> ${t.works.eyebrow}` : isEditorial ? `PORTFOLIO · ${t.works.eyebrow}` : t.works.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                {t.works.title}
              </h2>
            </div>
          </div>

          {/* Sequential Project Stack with Interconnected Pipeline Spine */}
          <div className="relative pl-7 sm:pl-10 lg:pl-12 space-y-24 sm:space-y-32">
            {/* Continuous Vertical Architecture Spine */}
            <div 
              className="absolute left-[11px] sm:left-[15px] lg:left-[19px] top-2 bottom-8 w-[2px] pointer-events-none" 
              style={{ backgroundColor: `${activePreset.accentHex}33` }}
              aria-hidden="true"
            />

            {/* PROJECT 01: FlexiConnect Web */}
            <div 
              id="project-01" 
              className={`relative ${
                isSpotlight 
                  ? 'flex flex-col gap-8 w-full p-6 sm:p-8 rounded-3xl border border-white/[0.08] backdrop-blur-sm shadow-xl' 
                  : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch'
              }`}
              style={isSpotlight && theme === 'dark' ? { backgroundColor: activePreset.surfaceHex } : undefined}
            >
              {/* Spine Node Marker 01 */}
              <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-12 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                    borderColor: activePreset.accentHex,
                    boxShadow: `0 0 10px ${activePreset.accentHex}40`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activePreset.accentHex }}
                  />
                </div>
              </div>
              {/* LEFT: Content */}
              <div className={isSpotlight ? 'w-full space-y-5' : 'lg:col-span-7 flex flex-col justify-between space-y-5 h-full'}>
                {isTerminal && (
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                    <Terminal className="h-3.5 w-3.5 shrink-0" />
                    <span>$ git show project-01 --stat</span>
                  </div>
                )}
                {isEditorial && (
                  <div className="font-mono text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
                    Feature Story · Project 01
                  </div>
                )}
                <div
                  className="flex items-center gap-2 font-mono text-xs font-bold"
                  style={{ color: activePreset.accentHex }}
                >
                  <span>01</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span>{t.works.p1Tag}</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">2025</span>
                </div>

                <div className="space-y-1">
                  {/* DIRECT LINK ON PROJECT TITLE */}
                  <a
                    href="https://github.com/soodthin/FlexiConnect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/title inline-flex items-center gap-2.5 text-2xl sm:text-4xl font-black text-slate-950 dark:text-white hover:opacity-80 transition-opacity"
                  >
                    <span>FlexiConnect Web</span>
                    <ArrowUpRight
                      className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover/title:translate-x-1 group-hover/title:-translate-y-1"
                      style={{ color: activePreset.accentHex }}
                    />
                  </a>
                  <div className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                    {t.works.p1Role}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {t.works.p1Desc}
                </p>

                {/* Exactly 3 Key Highlights */}
                <div className="space-y-2 pt-1 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">{t.works.p1H1Title}</strong> {t.works.p1H1Text}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">{t.works.p1H2Title}</strong> {t.works.p1H2Text}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">{t.works.p1H3Title}</strong> {t.works.p1H3Text}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Tech Stack & Image Stack */}
              <div className={isSpotlight ? 'w-full max-w-4xl mx-auto space-y-4 pt-2' : 'lg:col-span-5 flex flex-col justify-between items-start h-full space-y-4'}>
                <div className="w-full space-y-3">
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-400">
                    <strong className="text-slate-950 dark:text-white font-semibold font-sans block mb-1">{t.works.techStackLabel}</strong>
                    <span>Spring Boot · ReactJS · Vite · Tailwind CSS · MySQL · Spring Security · JWT · Render</span>
                  </div>
                  <ProjectImageStack
                    images={project1Images}
                    title="FlexiConnect Web"
                  />
                </div>
              </div>
            </div>

            {/* PROJECT 02: Food Delivery & Restaurant App */}
            <div 
              id="project-02" 
              className={`relative ${
                isSpotlight 
                  ? 'flex flex-col gap-8 w-full p-6 sm:p-8 rounded-3xl border border-white/[0.08] backdrop-blur-sm shadow-xl' 
                  : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch'
              }`}
              style={isSpotlight && theme === 'dark' ? { backgroundColor: activePreset.surfaceHex } : undefined}
            >
              {/* Spine Node Marker 02 */}
              <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-12 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                    borderColor: activePreset.accentHex,
                    boxShadow: `0 0 10px ${activePreset.accentHex}40`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activePreset.accentHex }}
                  />
                </div>
              </div>
              {/* Content Column (In Editorial: alternates to right side) */}
              <div className={isSpotlight ? 'w-full space-y-5' : isEditorial ? 'lg:col-span-7 lg:order-2 flex flex-col justify-between space-y-5 h-full' : 'lg:col-span-7 flex flex-col justify-between space-y-5 h-full'}>
                {isTerminal && (
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                    <Terminal className="h-3.5 w-3.5 shrink-0" />
                    <span>$ git show project-02 --stat</span>
                  </div>
                )}
                {isEditorial && (
                  <div className="font-mono text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
                    Case Study · Project 02
                  </div>
                )}
                <div
                  className="flex items-center gap-2 font-mono text-xs font-bold"
                  style={{ color: activePreset.accentHex }}
                >
                  <span>02</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span>{t.works.p2Tag}</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">2025</span>
                </div>

                <div className="space-y-1">
                  {/* DIRECT LINK ON PROJECT TITLE */}
                  <a
                    href="https://github.com/soodthin/T-Restaurant-App"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/title inline-flex items-center gap-2.5 text-2xl sm:text-4xl font-black text-slate-950 dark:text-white hover:opacity-80 transition-opacity"
                  >
                    <span>Food Delivery & Restaurant App</span>
                    <ArrowUpRight
                      className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover/title:translate-x-1 group-hover/title:-translate-y-1"
                      style={{ color: activePreset.accentHex }}
                    />
                  </a>
                  <div className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                    {t.works.p2Role}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {t.works.p2Desc}
                </p>

                {/* Exactly 3 Key Highlights */}
                <div className="space-y-2 pt-1 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">Django REST Framework:</strong> Built complete REST APIs covering dynamic menus, table reservations, order lifecycle, and customer reviews.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">{t.works.p2H2Title}</strong> {t.works.p2H2Text}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">React Native & Expo:</strong> Built mobile interfaces with dual-role flows for customers and chefs, plus real-time in-app chat via Firebase.</span>
                  </div>
                </div>
              </div>

              {/* Media Column (In Editorial: alternates to left side) */}
              <div className={isSpotlight ? 'w-full max-w-4xl mx-auto space-y-4 pt-2' : isEditorial ? 'lg:col-span-5 lg:order-1 flex flex-col justify-between items-start h-full space-y-4' : 'lg:col-span-5 flex flex-col justify-between items-start h-full space-y-4'}>
                <div className="w-full space-y-3">
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-400">
                    <strong className="text-slate-950 dark:text-white font-semibold font-sans block mb-1">{t.works.techStackLabel}</strong>
                    <span>React Native · Expo · Django REST · MoMo · Stripe · Firebase · PostgreSQL</span>
                  </div>
                  <ProjectImageStack
                    images={project2Images}
                    title="Food Delivery & Restaurant App"
                  />
                </div>
              </div>
            </div>

            {/* PROJECT 03: Dev Portfolio Engine */}
            <div 
              id="project-03" 
              className={`relative ${
                isSpotlight 
                  ? 'flex flex-col gap-8 w-full p-6 sm:p-8 rounded-3xl border border-white/[0.08] backdrop-blur-sm shadow-xl' 
                  : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch'
              }`}
              style={isSpotlight && theme === 'dark' ? { backgroundColor: activePreset.surfaceHex } : undefined}
            >
              {/* Spine Node Marker 03 */}
              <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-12 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                    borderColor: activePreset.accentHex,
                    boxShadow: `0 0 10px ${activePreset.accentHex}40`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activePreset.accentHex }}
                  />
                </div>
              </div>
              {/* LEFT: Content */}
              <div className={isSpotlight ? 'w-full space-y-5' : 'lg:col-span-7 flex flex-col justify-between space-y-5 h-full'}>
                {isTerminal && (
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                    <Terminal className="h-3.5 w-3.5 shrink-0" />
                    <span>$ git show project-03 --stat</span>
                  </div>
                )}
                {isEditorial && (
                  <div className="font-mono text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
                    Architectural Monograph · Project 03
                  </div>
                )}
                <div
                  className="flex items-center gap-2 font-mono text-xs font-bold"
                  style={{ color: activePreset.accentHex }}
                >
                  <span>03</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span>Typographic Static Engine</span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">2026</span>
                </div>

                <div className="space-y-1">
                  {/* DIRECT LINK ON PROJECT TITLE */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://soodthin.github.io/dev-portfolio/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/title inline-flex items-center gap-2.5 text-2xl sm:text-4xl font-black text-slate-950 dark:text-white hover:opacity-80 transition-opacity"
                    >
                      <span>Dev Portfolio Engine</span>
                      <ArrowUpRight
                        className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover/title:translate-x-1 group-hover/title:-translate-y-1"
                        style={{ color: activePreset.accentHex }}
                      />
                    </a>
                    <a
                      href="https://github.com/soodthin/dev-portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border border-slate-300 dark:border-white/15 bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Code2 className="h-3.5 w-3.5" style={{ color: activePreset.accentHex }} />
                      <span>Source Code</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                    Creator & Frontend Architect · Next.js 16 + TypeScript
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {t.works.p3Desc}
                </p>

                {/* Exactly 3 Key Highlights */}
                <div className="space-y-2 pt-1 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">100% Static Export (SSG):</strong> Automated GitHub Actions pipeline building static assets with sub-50ms TTFB worldwide.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">Pure 2D Typographic Design:</strong> Flat-layered vector design system with zero icon or emoji dependencies.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                    <span><strong className="text-slate-950 dark:text-white">Strict TypeScript Safety:</strong> End-to-end typed data contracts ensuring resilience across all component hierarchies.</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Live Site Notice & Specs Card */}
              <div className={isSpotlight ? 'w-full max-w-4xl mx-auto space-y-4 pt-2' : 'lg:col-span-5 flex flex-col justify-between items-start h-full space-y-6'}>
                <div className="w-full space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
                      style={{
                        backgroundColor: activePreset.accentMutedHex,
                        color: activePreset.accentHex,
                        borderColor: `${activePreset.accentHex}33`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: activePreset.accentHex }}
                      />
                      <span>{t.works.p3LiveBadge}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Zap className="h-3 w-3" />
                      <span>100/100 Lighthouse</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-700 dark:text-slate-400">
                    <strong className="text-slate-950 dark:text-white font-semibold font-sans block mb-1">{t.works.techStackLabel}</strong>
                    <span>Next.js 16 · TypeScript · Tailwind CSS v4 · GitHub Pages · GitHub Actions CI/CD</span>
                  </div>

                  <div
                    className="p-4 rounded-xl border border-[#e2e8f0] dark:border-white/10 bg-[#ffffff] dark:bg-white/[0.02] space-y-2 text-xs font-mono text-slate-600 dark:text-slate-300"
                    style={{
                      backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
                    }}
                  >
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hosting:</span>
                      <span className="text-slate-950 dark:text-white font-semibold">GitHub Pages Edge CDN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deployment:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Automated CI/CD Pipeline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type Coverage:</span>
                      <span className="font-semibold" style={{ color: activePreset.accentHex }}>100% Strict TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 04: CAPABILITIES (WITH AMBIENT WATERMARK TECH SILHOUETTES)      */}
        {/* ======================================================================= */}
        <section id="skills" className="relative space-y-8 pt-6 overflow-hidden">
          {/* Section Header (Dims slightly when scrolled past to create depth) */}
          <div className={`relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
            activeIdx > 3 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}>
            <span
              className="font-sans text-xs font-semibold"
              style={{ color: activePreset.accentHex }}
            >
              {isTerminal ? '> capabilities.json' : isEditorial ? 'COMPENDIUM · Technical Capabilities' : 'Technical Capabilities'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white text-left sm:text-right">
              Skills & Tooling
            </h2>
          </div>

          {/* Categorized Flowing Rows with Ambient Depth */}
          <div className="relative z-10 space-y-6 font-mono text-sm">
            {/* Row 1: Languages */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-[#e2e8f0] dark:border-white/10 items-baseline backdrop-blur-[1px]">
              <div
                className="md:col-span-3 font-semibold text-xs font-sans flex items-center gap-2.5"
                style={{ color: activePreset.accentHex }}
              >
                <div
                  className="p-1 rounded-md border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activePreset.accentMutedHex,
                    borderColor: `${activePreset.accentHex}33`,
                    color: activePreset.accentHex,
                  }}
                >
                  <Code2 className="h-3.5 w-3.5" />
                </div>
                <span>{isTerminal ? '>_ Languages' : 'Languages'}</span>
              </div>
              <div className="md:col-span-9 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed flex flex-wrap items-center gap-y-2">
                {['JavaScript', 'TypeScript', 'Java', 'Python', 'C++'].map((skill, idx) => (
                  <React.Fragment key={skill}>
                    {idx > 0 && <span className="text-slate-400 dark:text-slate-600 px-1.5 select-none">·</span>}
                    <SkillWithContext name={skill} accentColor={activePreset.accentHex} />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Row 2: Frameworks */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-[#e2e8f0] dark:border-white/10 items-baseline backdrop-blur-[1px]">
              <div
                className="md:col-span-3 font-semibold text-xs font-sans flex items-center gap-2.5"
                style={{ color: activePreset.accentHex }}
              >
                <div
                  className="p-1 rounded-md border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activePreset.accentMutedHex,
                    borderColor: `${activePreset.accentHex}33`,
                    color: activePreset.accentHex,
                  }}
                >
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <span>{isTerminal ? '>_ Frameworks' : 'Frameworks & Libraries'}</span>
              </div>
              <div className="md:col-span-9 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed flex flex-wrap items-center gap-y-2">
                {['ReactJS', 'Next.js', 'Spring Boot', 'FastAPI', 'Django', 'Tailwind CSS', 'RESTful API'].map((skill, idx) => (
                  <React.Fragment key={skill}>
                    {idx > 0 && <span className="text-slate-400 dark:text-slate-600 px-1.5 select-none">·</span>}
                    <SkillWithContext name={skill} accentColor={activePreset.accentHex} />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Row 3: Data & Cloud DevOps */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-[#e2e8f0] dark:border-white/10 items-baseline backdrop-blur-[1px]">
              <div
                className="md:col-span-3 font-semibold text-xs font-sans flex items-center gap-2.5"
                style={{ color: activePreset.accentHex }}
              >
                <div
                  className="p-1 rounded-md border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activePreset.accentMutedHex,
                    borderColor: `${activePreset.accentHex}33`,
                    color: activePreset.accentHex,
                  }}
                >
                  <Database className="h-3.5 w-3.5" />
                </div>
                <span>{isTerminal ? '>_ Data & Ops' : 'Data & DevOps'}</span>
              </div>
              <div className="md:col-span-9 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed flex flex-wrap items-center gap-y-2">
                {['PostgreSQL', 'MySQL', 'Redis', 'Git', 'GitHub Actions', 'Postman', 'Render'].map((skill, idx) => (
                  <React.Fragment key={skill}>
                    {idx > 0 && <span className="text-slate-400 dark:text-slate-600 px-1.5 select-none">·</span>}
                    <SkillWithContext name={skill} accentColor={activePreset.accentHex} />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Row 4: AI Engineering */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-[#e2e8f0] dark:border-white/10 items-baseline backdrop-blur-[1px]">
              <div
                className="md:col-span-3 font-semibold text-xs font-sans flex items-center gap-2.5"
                style={{ color: activePreset.accentHex }}
              >
                <div
                  className="p-1 rounded-md border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activePreset.accentMutedHex,
                    borderColor: `${activePreset.accentHex}33`,
                    color: activePreset.accentHex,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>{isTerminal ? '>_ AI Systems' : 'AI Tooling'}</span>
              </div>
              <div className="md:col-span-9 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed flex flex-wrap items-center gap-y-2">
                {['Claude Code', 'Codex', 'Antigravity (IDE)', 'Prompt Engineering', 'Code Verification'].map((skill, idx) => (
                  <React.Fragment key={skill}>
                    {idx > 0 && <span className="text-slate-400 dark:text-slate-600 px-1.5 select-none">·</span>}
                    <SkillWithContext name={skill} accentColor={activePreset.accentHex} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 05: CONTACT (LUXURY METAL BUSINESS CARD & CALENDAR BOOKING)     */}
        {/* ======================================================================= */}
        <section id="contact" className="space-y-10 pt-6 pb-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10">
            <div>
              <span
                className="font-sans text-xs font-semibold block mb-1"
                style={{ color: activePreset.accentHex }}
              >
                {isTerminal ? '> contact --open' : isEditorial ? 'CORRESPONDENCE · Get in Touch' : 'Get in Touch'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                Let's Build Together.
              </h2>
            </div>
            {/* Live Clock & Response Commitment */}
            <div className="flex flex-wrap items-center gap-4">
              <SaigonLiveClock />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.contact.responseBadge}</span>
              </div>
            </div>
          </div>

          {/* Giant Copyable Email */}
          <div className="py-6 space-y-4">
            <div className="text-xs font-sans text-slate-500 dark:text-slate-400">
              {t.contact.copyPrompt}
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={copyEmail}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyEmail(); }}
              className="group inline-flex items-center gap-3 sm:gap-6 cursor-pointer select-none"
              title="Click to copy email address"
            >
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white group-hover:opacity-80 transition-opacity break-all">
                thinhthai963@gmail.com
              </span>
              <div
                className="p-3 rounded-2xl bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 transition-all shrink-0"
                style={{
                  color: activePreset.accentHex,
                }}
              >
                <Copy className="h-5 w-5 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            {copiedEmail && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in duration-200 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.contact.copiedToast}</span>
              </div>
            )}
          </div>

          {/* Quick Actions & Contact Channels (Clean Unboxed Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#e2e8f0] dark:border-white/10 font-mono text-xs">
            {/* Phone */}
            <a
              href="tel:0869922096"
              className="p-4 rounded-xl border border-[#e2e8f0] dark:border-white/10 bg-white transition-all flex items-center gap-3 group"
              style={{
                backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
              }}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: activePreset.accentMutedHex,
                  color: activePreset.accentHex,
                }}
              >
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">{t.contact.phoneLabel}</span>
                <span className="font-bold text-slate-900 dark:text-white group-hover:opacity-80">
                  (+84) 869 922 096
                </span>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/soodthin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[#e2e8f0] dark:border-white/10 bg-white transition-all flex items-center gap-3 group"
              style={{
                backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
              }}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: activePreset.accentMutedHex,
                  color: activePreset.accentHex,
                }}
              >
                <GithubIcon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">{t.contact.githubLabel}</span>
                <span className="font-bold text-slate-900 dark:text-white group-hover:opacity-80 flex items-center gap-1">
                  github.com/soodthin
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/thinh-thai-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[#e2e8f0] dark:border-white/10 bg-white transition-all flex items-center gap-3 group"
              style={{
                backgroundColor: theme === 'dark' ? activePreset.surfaceHex : undefined,
              }}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: activePreset.accentMutedHex,
                  color: activePreset.accentHex,
                }}
              >
                <LinkedinIcon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">{t.contact.linkedinLabel}</span>
                <span className="font-bold text-slate-900 dark:text-white group-hover:opacity-80 flex items-center gap-1">
                  thinh-thai-dev
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </a>

            {/* Resume / Curriculum Vitae */}
            <a
              href="https://soodthin.github.io/dev-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border transition-all flex items-center gap-3 group"
              style={{
                backgroundColor: activePreset.accentMutedHex,
                borderColor: `${activePreset.accentHex}40`,
              }}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: activePreset.accentMutedHex,
                  color: activePreset.accentHex,
                }}
              >
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs block font-sans font-semibold" style={{ color: activePreset.accentHex }}>{t.contact.cvLabel}</span>
                <span className="font-bold text-slate-900 dark:text-white group-hover:opacity-80 flex items-center gap-1">
                  {t.contact.cvAction}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-[#e2e8f0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            © 2026 Thai Do Thinh • Powered by SoodFolio Platform
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Ho Chi Minh City, Viet Nam</span>
          </div>
        </footer>
      </div>
      {/* Floating Back to Top Button (Bottom-Right) */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label={t.contact.backToTop}
        title={t.contact.backToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full backdrop-blur-md border border-[#e2e8f0] dark:border-white/10 shadow-lg hover:shadow-xl text-slate-700 dark:text-slate-200 transition-all duration-300 cursor-pointer group active:scale-95 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? `${activePreset.surfaceHex}e6` : 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <ArrowUp
          className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{ color: activePreset.accentHex }}
        />
      </button>
    </main>
  );
}

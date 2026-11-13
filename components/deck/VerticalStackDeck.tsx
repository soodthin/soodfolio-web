'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { PortfolioData, ProjectDto, ExperienceDto, SkillDto, EducationDto, SocialLinkDto } from '@/types/portfolio';
import { ProjectImageStack } from '@/components/deck/ProjectImageStack';
import { Locale, translations } from '@/lib/i18n';
import { getThemePreset, ThemePresetKey } from '@/lib/themePresets';
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
  Zap,
  Database,
  BookOpen,
  GraduationCap,
  Download,
  User,
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

export function sanitizeUrl(url?: string | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return '#';
}

interface VerticalStackDeckProps {
  data: PortfolioData;
  variant?: string | null;
}

export function VerticalStackDeck({ data, variant }: VerticalStackDeckProps) {
  const activePresetKey = (variant || data.themeConfig || 'classic-deck') as ThemePresetKey;
  const activePreset = getThemePreset(activePresetKey);
  const isSpotlight = activePresetKey === 'spotlight-focus';
  const isTerminal = activePresetKey === 'terminal-matrix';
  const isEditorial = activePresetKey === 'editorial-clean';

  const [activeIdx, setActiveIdx] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

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

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
      if (saved) return saved;
    }
    return data.themeMode?.toLowerCase() === 'light' ? 'light' : 'dark';
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lang, setLang] = useState<Locale>('en');

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

  useEffect(() => {
    setIsMuted(getMuteState());

    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const authorTheme = data.themeMode?.toLowerCase() === 'light' ? 'light' : 'dark';
    const effectiveTheme = savedTheme || authorTheme;
    setTheme(effectiveTheme);
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');

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
  }, [data.themeMode]);

  const toggleTheme = () => {
    playClickSound();
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('soodfolio-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Visibility Flags
  const showExperienceSection = data.showExperience !== false && ((data.experiences && data.experiences.length > 0) || (data.showEducation !== false && data.educations && data.educations.length > 0));
  const showProjectsSection = data.showProjects !== false && data.projects && data.projects.length > 0;
  const showSkillsSection = data.showSkills !== false && data.skills && data.skills.length > 0;
  const showContactSection = data.showContact !== false;

  const navItems = useMemo(() => {
    const items = [{ id: 'summary', label: t.nav.summary }];
    if (showExperienceSection) {
      items.push({ id: 'experience', label: t.nav.experience });
    }
    if (showProjectsSection) {
      items.push({ id: 'works', label: t.nav.works });
    }
    if (showSkillsSection) {
      items.push({ id: 'skills', label: t.nav.skills });
    }
    if (showContactSection) {
      items.push({ id: 'contact', label: t.nav.contact });
    }
    return items;
  }, [showExperienceSection, showProjectsSection, showSkillsSection, showContactSection, t.nav]);

  const scrollToSection = useCallback((id: string) => {
    playClickSound();
    const targetId = id === 'works' ? (data.projects?.[0] ? `project-01` : 'works') : id;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${targetId}`, { offset: -90, duration: 0.8 });
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.projects]);

  useEffect(() => {
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

      const sectionIds = navItems.map((n) => n.id);
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
  }, [navItems]);

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

  // Dynamic Email Resolution
  const directEmail = useMemo(() => {
    const emailLink = data.socialLinks?.find(
      (l) => l.platform?.toLowerCase() === 'email' || l.url?.startsWith('mailto:')
    );
    if (emailLink) {
      return emailLink.url.replace(/^mailto:/i, '').trim();
    }
    const genericLink = data.socialLinks?.find((l) => l.url?.includes('@'));
    if (genericLink) {
      return genericLink.url.replace(/^mailto:/i, '').trim();
    }
    return null;
  }, [data.socialLinks]);

  const copyEmail = () => {
    playClickSound();
    if (typeof window !== 'undefined' && directEmail) {
      navigator.clipboard.writeText(directEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  // Skills Grouped by Category
  const skillCategories = useMemo(() => {
    const groups: Record<string, SkillDto[]> = {};
    (data.skills || []).forEach((s) => {
      const cat = s.category?.trim() || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [data.skills]);

  return (
    <main
      data-theme-preset={activePresetKey}
      style={{
        fontFamily: activePreset.fontVar,
        backgroundColor: theme === 'dark' ? activePreset.bgHex : undefined,
        ['--accent-primary' as string]: activePreset.accentHex,
        ['--accent-muted' as string]: activePreset.accentMutedHex,
        ['--bg-canvas' as string]: activePreset.bgHex,
        ['--surface-card' as string]: activePreset.surfaceHex,
      }}
      className={`relative min-h-screen bg-[#f8fafc] text-slate-800 dark:text-slate-100 selection:bg-teal-500/30 selection:text-white antialiased transition-colors duration-200 ${
        isTerminal ? 'font-mono' : ''
      }`}
    >
      {/* Ambient Lighting Layer */}
      {isSpotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] overflow-hidden z-0"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(129, 140, 248, 0.22), transparent 75%)',
          }}
        />
      )}

      {/* Floating Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-12 py-3.5 flex items-center justify-between backdrop-blur-md bg-[#f8fafc]/90 border-b border-[#e2e8f0] dark:border-white/[0.07] transition-colors duration-200"
        style={{
          backgroundColor: theme === 'dark' ? `${activePreset.bgHex}e6` : undefined,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: activePreset.accentHex }}
          />
          <span className="font-sans text-xs text-slate-950 dark:text-white font-bold">
            {data.fullName || data.title}
          </span>
          <span className="hidden sm:inline-block text-slate-400 dark:text-slate-600 text-xs">·</span>
          <span className="hidden sm:inline-block font-sans text-xs text-slate-700 dark:text-slate-400 font-medium">
            {(data.tagline || 'Software Engineer').replace(/\s*\/\/\s*/g, ' · ')}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs font-bold"
            title={t.header.langTooltip}
          >
            <Globe className="h-3.5 w-3.5" style={{ color: activePreset.accentHex }} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
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

          {/* Share Deck */}
          <button
            type="button"
            onClick={shareDeck}
            className="p-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            title={t.header.shareTooltip}
          >
            {copiedShare ? (
              <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 stroke-[2.5]" />
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

          {/* Fullscreen Toggle */}
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
          {showContactSection && (
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
          )}
        </div>
      </header>

      {/* Preset Sub-Ribbons */}
      {isTerminal && (
        <div className="fixed top-[49px] left-0 right-0 z-30 px-4 sm:px-12 py-1 bg-black/90 border-b border-emerald-500/20 font-mono text-[11px] text-emerald-400/90 flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">SYS_HUD</span>
            <span>TTY: /dev/pts/0</span>
            <span className="text-emerald-500/40">·</span>
            <span>STATUS: 200 OK</span>
            <span className="text-emerald-500/40">·</span>
            <span>UPTIME: 99.98%</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-500/70">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>SESSION: ENCRYPTED (ED25519)</span>
          </div>
        </div>
      )}

      {isEditorial && (
        <div className="fixed top-[49px] left-0 right-0 z-30 px-4 sm:px-12 py-1 bg-[#121110]/95 border-b border-amber-500/20 font-mono text-[10px] text-amber-500/80 uppercase tracking-widest flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-400">THE MONOGRAPH</span>
            <span>·</span>
            <span>EDITION 2026</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <span>ARCHITECTURAL PORTFOLIO SPECIFICATION</span>
          </div>
        </div>
      )}

      {isSpotlight && (
        <div className="fixed top-[49px] left-0 right-0 z-30 px-4 sm:px-12 py-1 bg-[#0b0f19]/90 border-b border-indigo-500/20 font-sans text-[11px] text-indigo-300 flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
            <span className="font-semibold text-indigo-300">KEYNOTE SHOWCASE</span>
            <span className="text-indigo-400/50">·</span>
            <span>STAGE PRESENTATION MODE</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300/80 font-medium">
            <Zap className="h-3 w-3 text-indigo-400" />
            <span>BROADCAST READY</span>
          </div>
        </div>
      )}

      {/* Floating Right Section Tracker */}
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

      {/* Main Container */}
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-12 ${isTerminal || isEditorial || isSpotlight ? 'pt-36' : 'pt-28'} pb-20 space-y-32`}>
        {/* ======================================================================= */}
        {/* SECTION 01: HERO / COVER                                                */}
        {/* ======================================================================= */}
        <section
          id="summary"
          className={`w-full max-w-[1280px] mx-auto space-y-10 pt-4 pb-4 ${
            isSpotlight ? 'text-center' : ''
          }`}
          style={{ paddingInline: 'clamp(20px, 5vw, 72px)' }}
        >
          {/* Eyebrow Ribbon */}
          <div className={`flex flex-wrap items-center ${isSpotlight ? 'justify-center' : ''} gap-3 sm:gap-4 text-xs font-mono transition-opacity duration-500 ${
            activeIdx > 0 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}>
            <span
              className={`px-3 py-1 ${isTerminal ? 'rounded-none' : 'rounded-full'} border font-semibold flex items-center gap-1.5`}
              style={{
                backgroundColor: activePreset.accentMutedHex,
                color: activePreset.accentHex,
                borderColor: `${activePreset.accentHex}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: activePreset.accentHex }}
              />
              <span>
                {data.statusText
                  ? data.statusText.replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·')
                  : 'Available for collaboration'}
              </span>
            </span>

            <SaigonLiveClock />
          </div>

          {/* Hero Profile Block */}
          <div className={`flex flex-col ${isSpotlight ? 'items-center' : 'sm:flex-row sm:items-center'} gap-6 sm:gap-8`}>
            {/* Avatar Photo */}
            <div
              className={`relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 ${
                isTerminal ? 'rounded-none' : isSpotlight ? 'rounded-3xl' : 'rounded-2xl'
              } overflow-hidden border-2 shadow-xl bg-slate-900 flex items-center justify-center`}
              style={{
                borderColor: activePreset.accentHex,
              }}
            >
              {data.avatarUrl ? (
                <Image
                  src={data.avatarUrl}
                  alt={data.fullName || data.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <User className="h-14 w-14 text-slate-500" />
              )}
            </div>

            {/* Title & Tagline */}
            <div className={`space-y-2.5 ${isSpotlight ? 'text-center' : ''}`}>
              <div
                className="text-xs sm:text-sm font-sans font-bold tracking-wider uppercase"
                style={{ color: activePreset.accentHex }}
              >
                {(data.tagline || 'SOFTWARE ENGINEER').replace(/\s*\/\/\s*/g, ' · ')}
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-slate-950 dark:text-white uppercase">
                {data.fullName || data.title}
              </h1>
              {data.bio && (
                <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
                  {data.bio}
                </p>
              )}
            </div>
          </div>

          {/* CTAs and Social Links */}
          <div className={`flex flex-wrap items-center ${isSpotlight ? 'justify-center' : ''} gap-3 pt-2`}>
            {showContactSection && (
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                style={{
                  backgroundColor: activePreset.accentHex,
                  color: activePresetKey === 'editorial-clean' ? '#121110' : '#080d12',
                }}
                className="px-5 py-2.5 rounded-xl hover:opacity-90 font-sans font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {t.header.contactBtn}
              </button>
            )}

            {data.resumeUrl && (
              <a
                href={sanitizeUrl(data.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 font-sans font-semibold text-xs text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Xem CV / Resume</span>
              </a>
            )}

            {/* Social Icons */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5 pl-2">
                {data.socialLinks.map((link, idx) => {
                  const safeHref = sanitizeUrl(link.url);
                  const isGh = link.platform?.toLowerCase().includes('git');
                  const isLi = link.platform?.toLowerCase().includes('linkedin');
                  return (
                    <a
                      key={idx}
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                      title={link.label || link.platform}
                    >
                      {isGh ? (
                        <GithubIcon className="h-4 w-4" />
                      ) : isLi ? (
                        <LinkedinIcon className="h-4 w-4" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 02: EXPERIENCE & EDUCATION                                      */}
        {/* ======================================================================= */}
        {showExperienceSection && (
          <section id="experience" className="space-y-10 pt-6">
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
              activeIdx > 1 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
            }`}>
              <div>
                <span
                  className="font-sans text-xs block mb-1 font-semibold"
                  style={{ color: activePreset.accentHex }}
                >
                  {isTerminal ? '> /var/log/syslog --facility=career' : isEditorial ? 'CHRONICLE · Career Trajectory' : isSpotlight ? 'KEYNOTE ACT 02 · CAREER TRAJECTORY' : 'Career Trajectory'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {isEditorial ? 'Chronology of Practice' : t.experience.title}
                </h2>
              </div>
              {isTerminal && (
                <div className="font-mono text-xs text-emerald-400/80 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>KERN_LOG: AUDITED EVENTS</span>
                </div>
              )}
            </div>

            {/* Career Timeline Track */}
            <div className="relative pl-7 sm:pl-10 lg:pl-12 space-y-10 sm:space-y-12">
              <div 
                className="absolute left-[11px] sm:left-[15px] lg:left-[19px] top-3 bottom-6 w-[2px] pointer-events-none" 
                style={{ backgroundColor: `${activePreset.accentHex}33` }}
                aria-hidden="true"
              />

              {/* Dynamic Experiences */}
              {data.experiences && data.experiences.map((exp, idx) => {
                const milestoneNum = String(idx + 1).padStart(2, '0');
                return (
                  <div key={exp.id || idx} className="relative space-y-3">
                    {/* Node Marker */}
                    <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-1 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div
                        className={`w-5 h-5 ${isTerminal ? 'rounded-none' : 'rounded-full'} flex items-center justify-center border-2`}
                        style={{
                          backgroundColor: theme === 'dark' ? activePreset.surfaceHex : '#ffffff',
                          borderColor: activePreset.accentHex,
                        }}
                      >
                        <div
                          className={`w-1.5 h-1.5 ${isTerminal ? 'rounded-none' : 'rounded-full'} animate-pulse`}
                          style={{ backgroundColor: activePreset.accentHex }}
                        />
                      </div>
                    </div>

                    {/* Milestone Tag */}
                    <div
                      className="flex items-center gap-2 font-mono text-xs font-bold"
                      style={{ color: activePreset.accentHex }}
                    >
                      <span>{milestoneNum}</span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span>{exp.companyName}</span>
                      {exp.periodText && (
                        <>
                          <span className="text-slate-400 dark:text-slate-600">·</span>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">{exp.periodText}</span>
                        </>
                      )}
                    </div>

                    {/* Card Body */}
                    <div
                      className={`p-6 sm:p-8 ${
                        isTerminal ? 'rounded-none border-emerald-500/25 bg-black/75' : isEditorial ? 'rounded-2xl border-amber-500/20' : isSpotlight ? 'rounded-3xl border-indigo-500/25 bg-[#111827]/90 shadow-2xl' : 'rounded-2xl border-[#e2e8f0] dark:border-white/[0.07] bg-white/95'
                      } border dark:backdrop-blur-sm space-y-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:shadow-xl`}
                      style={{
                        backgroundColor: !isTerminal && !isSpotlight && theme === 'dark' ? activePreset.surfaceHex : undefined,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#e2e8f0] dark:border-white/10">
                        <div className="space-y-1">
                          <div
                            className={`inline-flex items-center gap-2 px-2.5 py-0.5 ${isTerminal ? 'rounded-none' : 'rounded-full'} text-xs font-mono font-semibold border`}
                            style={{
                              backgroundColor: activePreset.accentMutedHex,
                              color: activePreset.accentHex,
                              borderColor: `${activePreset.accentHex}33`,
                            }}
                          >
                            <Building2 className="h-3 w-3" />
                            {exp.companyUrl ? (
                              <a href={sanitizeUrl(exp.companyUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {exp.companyName}
                              </a>
                            ) : (
                              <span>{exp.companyName}</span>
                            )}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white pt-1">
                            {exp.roleTitle}
                          </h3>
                          {exp.location && (
                            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              {exp.location}
                            </div>
                          )}
                        </div>

                        {exp.periodText && (
                          <div className="sm:text-right shrink-0">
                            <span className={`px-3 py-1 ${isTerminal ? 'rounded-none' : 'rounded-lg'} bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold`}>
                              {exp.periodText}
                            </span>
                          </div>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {exp.description}
                        </p>
                      )}

                      {/* Highlights */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          <div
                            className="text-xs font-sans font-semibold uppercase tracking-wider"
                            style={{ color: activePreset.accentHex }}
                          >
                            Điểm nhấn thành tựu &amp; Kiến trúc
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs sm:text-sm">
                            {exp.highlights.map((hl, hIdx) => (
                              <div
                                key={hIdx}
                                className={`p-3.5 rounded-xl border border-[#e2e8f0]/80 dark:border-white/10 flex items-start gap-2.5 ${
                                  isTerminal ? 'bg-black/40' : 'bg-slate-50/50 dark:bg-white/[0.02]'
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: activePreset.accentHex }} />
                                <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{hl}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills Used */}
                      {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.skillsUsed.map((sk, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Education Milestones */}
              {data.showEducation !== false && data.educations && data.educations.map((edu, idx) => {
                return (
                  <div key={edu.id || idx} className="relative space-y-3">
                    <div className="absolute -left-[26px] sm:-left-[34px] lg:-left-[38px] top-1 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div
                        className={`w-5 h-5 ${isTerminal ? 'rounded-none' : 'rounded-full'} flex items-center justify-center border-2 border-slate-400 bg-white dark:bg-slate-900`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>ACADEMIC FOUNDATION</span>
                      {edu.periodText && (
                        <>
                          <span>·</span>
                          <span className="font-normal">{edu.periodText}</span>
                        </>
                      )}
                    </div>

                    <div
                      className="p-6 rounded-2xl border border-[#e2e8f0] dark:border-white/[0.07] bg-white/95 dark:bg-white/[0.02] space-y-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                        <GraduationCap className="h-4 w-4" style={{ color: activePreset.accentHex }} />
                        <span className="font-semibold text-slate-900 dark:text-white text-base">
                          {edu.institution}
                        </span>
                      </div>
                      {(edu.degree || edu.fieldOfStudy) && (
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                          {edu.degree} {edu.fieldOfStudy ? `· ${edu.fieldOfStudy}` : ''}
                        </div>
                      )}
                      {edu.highlights && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                          {edu.highlights}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* SECTION 03: WORKS / PROJECTS                                            */}
        {/* ======================================================================= */}
        {showProjectsSection && (
          <section id="works" className="space-y-16 pt-6">
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
              activeIdx > 2 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
            }`}>
              <div>
                <span
                  className="font-sans text-xs block mb-1 font-semibold"
                  style={{ color: activePreset.accentHex }}
                >
                  {isTerminal ? '> /usr/bin/deployments --manifest=production' : isEditorial ? 'EXHIBITION · Selected Production Systems' : isSpotlight ? 'KEYNOTE ACT 03 · PRODUCTION ARCHITECTURE' : 'Selected Works'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {isEditorial ? 'Monograph of Works' : t.works.title}
                </h2>
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {data.projects?.length || 0} DỰ ÁN TRỌNG ĐIỂM
              </div>
            </div>

            {/* Dynamic Projects Loop */}
            <div className="space-y-16">
              {data.projects.map((proj, idx) => {
                const projNum = String(idx + 1).padStart(2, '0');
                const safeLive = sanitizeUrl(proj.liveUrl);
                const safeGh = sanitizeUrl(proj.githubUrl);

                return (
                  <article
                    key={proj.id || idx}
                    id={`project-${projNum}`}
                    className={`p-6 sm:p-10 ${
                      isTerminal ? 'rounded-none border-emerald-500/25 bg-black/80' : isEditorial ? 'rounded-2xl border-amber-500/20' : isSpotlight ? 'rounded-3xl border-indigo-500/25 bg-[#111827]/90 shadow-2xl' : 'rounded-3xl border-[#e2e8f0] dark:border-white/[0.08] bg-white/95'
                    } border dark:backdrop-blur-sm space-y-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:shadow-2xl transition-all`}
                    style={{
                      backgroundColor: !isTerminal && !isSpotlight && theme === 'dark' ? activePreset.surfaceHex : undefined,
                    }}
                  >
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e2e8f0] dark:border-white/10">
                      <div className="space-y-1">
                        <div
                          className="font-mono text-xs font-bold"
                          style={{ color: activePreset.accentHex }}
                        >
                          PROJECT {projNum} {proj.role ? `· ${proj.role}` : ''}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                          {proj.title}
                        </h3>
                        {proj.subtitle && (
                          <p className="text-xs sm:text-sm font-sans font-medium text-slate-600 dark:text-slate-400">
                            {proj.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-2">
                        {safeGh !== '#' && (
                          <a
                            href={safeGh}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 font-sans font-medium text-xs transition-colors"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            <span>Mã nguồn</span>
                          </a>
                        )}

                        {safeLive !== '#' && (
                          <a
                            href={safeLive}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: activePreset.accentHex,
                              color: activePresetKey === 'editorial-clean' ? '#121110' : '#080d12',
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg hover:opacity-90 font-sans font-semibold text-xs transition-opacity cursor-pointer shadow-xs"
                          >
                            <span>Trực tiếp</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Image or Topology Preview */}
                    {proj.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-[#e2e8f0] dark:border-white/10">
                        <ProjectImageStack images={[proj.imageUrl]} title={proj.title} />
                      </div>
                    )}

                    {/* Description */}
                    {proj.description && (
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {proj.description}
                      </p>
                    )}

                    {/* Highlights */}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <div className="space-y-2">
                        <div
                          className="text-xs font-sans font-semibold uppercase tracking-wider"
                          style={{ color: activePreset.accentHex }}
                        >
                          Điểm nhấn kỹ thuật &amp; Kết quả
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-sans">
                          {proj.highlights.map((hl, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                              <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-teal-500 stroke-[2.5]" style={{ color: activePreset.accentHex }} />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e2e8f0] dark:border-white/10">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* SECTION 04: SKILLS                                                      */}
        {/* ======================================================================= */}
        {showSkillsSection && (
          <section id="skills" className="relative space-y-8 pt-6 overflow-hidden">
            <div className={`relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-[#e2e8f0] dark:border-white/10 transition-opacity duration-500 ${
              activeIdx > 3 ? 'opacity-40 hover:opacity-100' : 'opacity-100'
            }`}>
              <span
                className="font-sans text-xs font-semibold"
                style={{ color: activePreset.accentHex }}
              >
                {isTerminal ? '> sys.stat: /proc/sys/competencies.matrix' : isEditorial ? 'COMPENDIUM · Technical Capabilities' : isSpotlight ? 'KEYNOTE ACT 04 · FOCAL COMPETENCIES' : 'Technical Capabilities'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white text-left sm:text-right">
                {isEditorial ? 'Index of Proficiencies' : isTerminal ? 'System Resource Matrix' : 'Skills & Tooling'}
              </h2>
            </div>

            {/* Dynamic Categorized Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {Object.entries(skillCategories).map(([cat, skills]) => {
                return (
                  <div
                    key={cat}
                    className={`p-6 ${
                      isTerminal ? 'rounded-none border-emerald-500/30 bg-black/80' : isEditorial ? 'rounded-2xl border-amber-500/20' : isSpotlight ? 'rounded-3xl border-indigo-500/20 bg-indigo-950/20' : 'rounded-2xl border-[#e2e8f0] dark:border-white/10 bg-white/95'
                    } border dark:backdrop-blur-sm space-y-4 shadow-sm`}
                    style={{
                      backgroundColor: !isTerminal && !isSpotlight && theme === 'dark' ? activePreset.surfaceHex : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider" style={{ color: activePreset.accentHex }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activePreset.accentHex }} />
                      <span>{cat}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((sk) => (
                        <span
                          key={sk.id || sk.name}
                          className={`px-3 py-1.5 ${isTerminal ? 'rounded-none font-mono' : 'rounded-lg font-sans'} text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 hover:border-teal-500/50 transition-colors`}
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* SECTION 05: CONTACT                                                     */}
        {/* ======================================================================= */}
        {showContactSection && (
          <section id="contact" className="space-y-10 pt-6 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-white/10">
              <div>
                <span
                  className="font-sans text-xs block mb-1 font-semibold"
                  style={{ color: activePreset.accentHex }}
                >
                  {isTerminal ? '> /net/socket: connect()' : isEditorial ? 'CORRESPONDENCE · Direct Channels' : isSpotlight ? 'KEYNOTE ACT 05 · COLLABORATION CHANNELS' : 'Direct Channels'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {t.contact.title}
                </h2>
              </div>
            </div>

            <div
              className={`p-8 sm:p-12 ${
                isTerminal ? 'rounded-none border-emerald-500/25 bg-black/80' : isEditorial ? 'rounded-3xl border-amber-500/20' : isSpotlight ? 'rounded-3xl border-indigo-500/25 bg-[#111827]/90 shadow-2xl' : 'rounded-3xl border-[#e2e8f0] dark:border-white/[0.08] bg-white/95'
              } border dark:backdrop-blur-sm space-y-8 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:shadow-2xl`}
              style={{
                backgroundColor: !isTerminal && !isSpotlight && theme === 'dark' ? activePreset.surfaceHex : undefined,
              }}
            >
              <div className="space-y-2">
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: activePreset.accentHex }}
                >
                  {t.contact.eyebrow}
                </div>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-xl font-sans">
                  {data.statusText || 'Sẵn sàng hợp tác các dự án công nghệ, tư vấn kiến trúc hệ thống hoặc vai trò kỹ thuật chuyên sâu.'}
                </p>
              </div>

              {/* Direct Email Click & Copy Box */}
              {directEmail && (
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20"
                      style={{ color: activePreset.accentHex }}
                    >
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">EMAIL LIÊN HỆ TRỰC TIẾP</div>
                      <a
                        href={`mailto:${directEmail}`}
                        className="text-lg sm:text-xl font-sans font-bold text-slate-900 dark:text-white hover:underline"
                      >
                        {directEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-sans font-medium text-xs transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${directEmail}`}
                      style={{
                        backgroundColor: activePreset.accentHex,
                        color: activePresetKey === 'editorial-clean' ? '#121110' : '#080d12',
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <span>Gửi email</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Social Channels List */}
              {data.socialLinks && data.socialLinks.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Các kênh kết nối khác
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.socialLinks.map((link, idx) => {
                      const safeHref = sanitizeUrl(link.url);
                      const isGh = link.platform?.toLowerCase().includes('git');
                      const isLi = link.platform?.toLowerCase().includes('linkedin');

                      return (
                        <a
                          key={idx}
                          href={safeHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isGh ? (
                              <GithubIcon className="h-4 w-4 shrink-0 text-slate-900 dark:text-white" />
                            ) : isLi ? (
                              <LinkedinIcon className="h-4 w-4 shrink-0 text-blue-500" />
                            ) : (
                              <Globe className="h-4 w-4 shrink-0" style={{ color: activePreset.accentHex }} />
                            )}
                            <span className="font-sans font-medium text-xs truncate">
                              {link.label || link.platform}
                            </span>
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Resume Download Action */}
              {data.resumeUrl && (
                <div className="pt-4 border-t border-[#e2e8f0] dark:border-white/10 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Hồ sơ kỹ thuật chi tiết (PDF Document)
                  </div>
                  <a
                    href={sanitizeUrl(data.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 font-sans font-semibold text-xs text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải về CV</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          style={{
            backgroundColor: activePreset.accentHex,
            color: activePresetKey === 'editorial-clean' ? '#121110' : '#080d12',
          }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer active:scale-95 animate-in fade-in"
          title="Cuộn lên đầu trang"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </main>
  );
}

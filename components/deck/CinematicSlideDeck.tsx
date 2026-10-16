'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData } from '@/types/portfolio';
import { GrainCanvas } from './GrainCanvas';
import { playSlideSwitchSound, playClickSound, toggleMuteSound, getMuteState } from '@/lib/sound';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Briefcase,
  Cpu,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  Globe,
  CornerDownRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CinematicSlideDeckProps {
  data: PortfolioData;
}

export function CinematicSlideDeck({ data }: CinematicSlideDeckProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Compute slide list dynamically
  const slides = useMemo(() => {
    const list: {
      id: string;
      label: string;
      category: string;
      render: () => React.ReactNode;
    }[] = [];

    // 1. Hero / Manifesto
    list.push({
      id: 'manifesto',
      label: 'SUMMARY',
      category: 'IDENTITY',
      render: () => (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Big Editorial Typography */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-teal-400/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-semibold tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {data.statusText || 'AVAILABLE FOR WORK'}
              </span>
              <span className="text-slate-400 font-mono text-xs tracking-wider uppercase">
                // ARCHITECT DECK
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase font-sans">
                {data.title}
              </h1>
              <p className="text-lg sm:text-2xl font-mono text-teal-400/90 tracking-tight font-medium">
                {data.tagline || 'SENIOR FULLSTACK ARCHITECT'}
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              {data.bio}
            </p>

            {/* Quick Metrics / Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-xl font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#141622] border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">PROJECTS</div>
                <div className="text-base font-bold text-white">{data.projects?.length || 0} PROD</div>
              </div>
              <div className="p-3 rounded-xl bg-[#141622] border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">CORE STACK</div>
                <div className="text-base font-bold text-teal-400">{data.skills?.length || 0} TECHS</div>
              </div>
              <div className="p-3 rounded-xl bg-[#141622] border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">EXPERIENCE</div>
                <div className="text-base font-bold text-emerald-400">
                  {data.experiences?.[0]?.periodText || '5+ YEARS'}
                </div>
              </div>
            </div>

            {/* Navigation Prompt */}
            <div className="flex items-center gap-4 pt-2 text-slate-400 font-mono text-xs">
              <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <span>Use [ → ] or [ Space ] to navigate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Right Column: High-Craft Monogram Badge & Identity Art */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group p-4">
              <div className="absolute inset-0 rounded-3xl bg-teal-500/10 blur-2xl group-hover:bg-teal-500/20 transition-all duration-500" />
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-3xl bg-[#121520] border-2 border-white/10 border-t-teal-400/40 border-b-black/80 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="h-24 w-24 rounded-2xl bg-[#1a1d2e] border border-white/15 flex items-center justify-center text-3xl font-bold font-mono text-teal-400 shadow-inner">
                  {data.title
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-xs text-white tracking-widest uppercase font-semibold">
                    @{data.username}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    VERIFIED DEVELOPER
                  </div>
                </div>
                <div className="w-full pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-slate-400 font-mono text-[10px]">
                  <Terminal className="h-3 w-3 text-teal-400" />
                  <span>Next.js 16 • Spring Boot 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    });

    // 2. Project Slides
    if (data.showProjects && data.projects) {
      data.projects.forEach((proj, pIdx) => {
        list.push({
          id: `project-${proj.id || pIdx}`,
          label: proj.title,
          category: `PROJECT 0${pIdx + 1}`,
          render: () => (
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Project Narrative */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-teal-400/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-bold">
                    WORK 0{pIdx + 1} // {String(data.projects.length).padStart(2, '0')}
                  </span>
                  {proj.periodText && (
                    <span className="text-slate-400 font-mono text-xs tracking-wider">
                      YEAR: {proj.periodText}
                    </span>
                  )}
                  {proj.role && (
                    <span className="text-slate-400 font-mono text-xs">
                      • {proj.role}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
                    {proj.title}
                  </h2>
                  {proj.subtitle && (
                    <p className="text-sm sm:text-base font-mono text-slate-300">
                      {proj.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                  {proj.description}
                </p>

                {/* Highlights List */}
                {proj.highlights && proj.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-slate-400 font-mono text-xs tracking-wider uppercase block">
                      Architectural Highlights:
                    </span>
                    <div className="space-y-2">
                      {proj.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-mono">
                          <CornerDownRight className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Pills */}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="pt-3 flex flex-wrap gap-2">
                    {proj.techStack.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-[#141622] border border-white/10 hover:border-teal-500/40 text-teal-400 font-mono text-xs font-medium transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#090a0f] font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition-all shadow-lg shadow-teal-500/10 active:scale-95 cursor-pointer"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-xl bg-[#141622] hover:bg-[#1a1d2e] border border-white/10 hover:border-white/20 text-white font-medium text-xs sm:text-sm font-mono flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <Code2 className="h-4 w-4 text-slate-300" />
                      <span>View Source Code</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Visual Stage Showcase Card */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="w-full rounded-2xl bg-[#121520] border-2 border-white/10 border-t-white/20 p-6 space-y-5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-teal-400" />
                      <span>SHOWCASE STAGE</span>
                    </span>
                    <span>{proj.periodText || 'PROD RELEASE'}</span>
                  </div>

                  <div className="h-56 rounded-xl bg-[#090a0f] border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3 relative group-hover:border-teal-500/30 transition-colors">
                    <div className="h-14 w-14 rounded-2xl bg-[#161927] border border-white/15 flex items-center justify-center text-teal-400">
                      <Layers className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white font-sans">{proj.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">Autonomous Production System</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded-lg bg-[#161927] border border-white/5 space-y-0.5">
                      <span className="text-slate-400 text-[10px]">STANDARD</span>
                      <p className="text-slate-200 font-semibold">Clean Architecture</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#161927] border border-white/5 space-y-0.5">
                      <span className="text-slate-400 text-[10px]">AVAILABILITY</span>
                      <p className="text-emerald-400 font-semibold">99.9% Production Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      });
    }

    // 3. Experience Slide
    if (data.showExperience && data.experiences && data.experiences.length > 0) {
      list.push({
        id: 'experience',
        label: 'EXPERIENCE',
        category: 'TRAJECTORY',
        render: () => (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <span className="px-3 py-1 rounded-full bg-teal-400/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-semibold tracking-wider">
                PROFESSIONAL TIMELINE
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
                Engineering Trajectory
              </h2>
              <p className="text-slate-400 font-mono text-xs sm:text-sm">
                Production track record across distributed systems and modern web platforms.
              </p>
            </div>

            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 sm:p-8 rounded-2xl bg-[#121520] border border-white/10 border-t-white/20 hover:border-teal-500/30 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-sans">
                        {exp.roleTitle} <span className="text-teal-400">@ {exp.companyName}</span>
                      </h3>
                      {exp.location && (
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{exp.location}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#1a1d2e] border border-white/10 text-xs font-mono font-bold text-teal-300 self-start sm:self-center">
                      {exp.periodText}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">{exp.description}</p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {exp.skillsUsed.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-[#161927] border border-white/10 text-slate-400 font-mono text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // 4. Skills Slide
    if (data.showSkills && data.skills && data.skills.length > 0) {
      list.push({
        id: 'skills',
        label: 'SKILLS',
        category: 'COMPETENCIES',
        render: () => (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <span className="px-3 py-1 rounded-full bg-teal-400/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-semibold tracking-wider">
                CORE COMPETENCIES
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
                Technical Stack & Matrix
              </h2>
              <p className="text-slate-400 font-mono text-xs sm:text-sm">
                Core languages, platforms, and architectures refined through production systems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.skills.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-[#121520] border border-white/10 hover:border-teal-500/40 transition-all space-y-2 shadow-lg group"
                >
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] tracking-wider uppercase">
                    <span>{s.category}</span>
                    <Cpu className="h-3.5 w-3.5 text-teal-400 group-hover:rotate-45 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-teal-300 transition-colors">
                    {s.name}
                  </h3>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                    <div className="w-4/5 h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // 5. Contact Slide
    if (data.showContact) {
      list.push({
        id: 'contact',
        label: 'TRANSMIT',
        category: 'CONNECT',
        render: () => (
          <div className="w-full max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                INITIATE TRANSMISSION
              </span>

              <h2 className="text-3xl sm:text-6xl font-bold tracking-tight text-white uppercase font-sans">
                Let's Build Something Exceptional.
              </h2>

              <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-sans leading-relaxed">
                Open for Software Engineer and Full-Stack Developer opportunities, production web systems, and high-impact teams.
              </p>
            </div>

            {/* Email Contact Box */}
            <div className="p-6 rounded-2xl bg-[#121520] border-2 border-white/10 max-w-lg mx-auto space-y-4 shadow-2xl">
              <div className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                DIRECT COMMUNICATION
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090a0f] border border-white/10 font-mono text-sm text-teal-300">
                <span className="truncate">alex@soodfolio.com</span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    navigator.clipboard.writeText('alex@soodfolio.com');
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#181b28] hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Links */}
              {data.socialLinks && data.socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {data.socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#161927] hover:bg-[#1f2338] border border-white/10 hover:border-teal-500/40 text-slate-200 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Globe className="h-3.5 w-3.5 text-teal-400" />
                      <span>{s.label || s.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="font-mono text-xs text-slate-400 pt-4">
              SOODFOLIO // THE INDEPENDENT DEVELOPER PRESENTATION PLATFORM
            </div>
          </div>
        ),
      });
    }

    return list;
  }, [data, copiedEmail]);

  const totalSlides = slides.length;

  const goToSlide = useCallback(
    (nextIdx: number, newDir: number) => {
      if (nextIdx < 0 || nextIdx >= totalSlides) return;
      playSlideSwitchSound(newDir);
      setDirection(newDir);
      setCurrentIdx(nextIdx);
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (currentIdx < totalSlides - 1) {
      goToSlide(currentIdx + 1, 1);
    }
  }, [currentIdx, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentIdx > 0) {
      goToSlide(currentIdx - 1, -1);
    }
  }, [currentIdx, goToSlide]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Wheel navigation with debounce
  useEffect(() => {
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < 600) return; // Debounce 600ms

      if (e.deltaY > 35 || e.deltaX > 35) {
        lastWheelTime = now;
        nextSlide();
      } else if (e.deltaY < -35 || e.deltaX < -35) {
        lastWheelTime = now;
        prevSlide();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSlide, prevSlide]);

  const currentSlide = slides[currentIdx];

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#090a0f] text-slate-200 select-none flex flex-col justify-between">
      {/* Interactive Grain & Ambient Gold Shader */}
      <GrainCanvas />

      {/* Top Deck Navigation Bar */}
      <header className="relative z-30 w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.06] bg-[#090a0f]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#141624] border border-white/10 flex items-center justify-center text-teal-400 shadow-inner">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white text-sm font-sans">SOODFOLIO</span>
            <span className="font-mono text-[9px] text-teal-400/90 tracking-widest uppercase">
              CINEMATIC DECK PRO
            </span>
          </div>
        </div>

        {/* Current Slide Category Title */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-xs text-slate-300">
          <span className="text-teal-400 font-bold">{currentSlide?.category}</span>
          <span>//</span>
          <span className="text-white font-medium">{currentSlide?.label}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const muted = toggleMuteSound();
              setIsMuted(muted);
            }}
            className="h-8 w-8 rounded-lg bg-[#121420] hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-teal-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="h-8 w-8 rounded-lg bg-[#121420] hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main Presentation Stage (Horizontal Spring Physics) */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide?.id}
            custom={direction}
            initial={{ x: direction > 0 ? 100 : -100, opacity: 0, filter: 'blur(10px)' }}
            animate={{
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              x: direction > 0 ? -100 : 100,
              opacity: 0,
              filter: 'blur(10px)',
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            className="w-full flex items-center justify-center"
          >
            {currentSlide?.render()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Timeline Navigation & Indicator */}
      <footer className="relative z-30 w-full px-6 py-4 border-t border-white/[0.06] bg-[#090a0f]/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Slide Counter */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm tracking-wider">
            {String(currentIdx + 1).padStart(2, '0')}{' '}
            <span className="text-slate-400 font-normal">/ {String(totalSlides).padStart(2, '0')}</span>
          </span>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>[ KEYNOTE PRO ]</span>
          </div>
        </div>

        {/* Interactive Timeline Dots */}
        <div className="flex items-center gap-2 max-w-xl overflow-x-auto pb-1 sm:pb-0">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSlide(idx, idx > currentIdx ? 1 : -1)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIdx
                  ? 'w-10 bg-teal-400 shadow-[0_0_12px_rgba(45, 212, 191, 0.6)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={s.label}
            />
          ))}
        </div>

        {/* Arrow Controls & Keyboard Prompts */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={prevSlide}
            className="h-8 px-3 rounded-lg bg-[#121420] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">PREV</span>
          </button>

          <button
            type="button"
            disabled={currentIdx === totalSlides - 1}
            onClick={nextSlide}
            className="h-8 px-3 rounded-lg bg-teal-400 hover:bg-teal-300 disabled:opacity-30 disabled:cursor-not-allowed text-[#090a0f] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-[11px]">NEXT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

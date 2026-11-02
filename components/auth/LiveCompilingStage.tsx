'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Code2, Compass, Check, Layers } from 'lucide-react';
import { ThemePresetKey } from '@/lib/themePresets';

export interface LiveCompilingStageProps {
  fullName?: string;
  username?: string;
  activeTheme?: ThemePresetKey;
  onThemeChange?: (theme: ThemePresetKey) => void;
}

interface TastingPreset {
  id: ThemePresetKey;
  keyNum: string;
  label: string;
  tagline: string;
  accent: string;
  borderAccent: string;
  badgeBg: string;
  badgeText: string;
}

const TASTING_PRESETS: TastingPreset[] = [
  {
    id: 'classic-deck',
    keyNum: '1',
    label: 'Classic',
    tagline: 'Dark Onyx + Ruza Teal + Inter',
    accent: '#2DD4BF',
    borderAccent: 'border-teal-500/30',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-400',
  },
  {
    id: 'spotlight-focus',
    keyNum: '2',
    label: 'Spotlight',
    tagline: 'Deep Navy + Electric Indigo + Outfit',
    accent: '#818CF8',
    borderAccent: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400',
  },
  {
    id: 'terminal-matrix',
    keyNum: '3',
    label: 'Terminal',
    tagline: 'Obsidian Black + Emerald + JetBrains',
    accent: '#34D399',
    borderAccent: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
  },
  {
    id: 'editorial-clean',
    keyNum: '4',
    label: 'Editorial',
    tagline: 'Warm Charcoal + Amber Copper + Inter',
    accent: '#F59E0B',
    borderAccent: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
  },
];

export function LiveCompilingStage({
  fullName = '',
  username = '',
  activeTheme: controlledTheme,
  onThemeChange,
}: LiveCompilingStageProps) {
  const [internalTheme, setInternalTheme] = useState<ThemePresetKey>('classic-deck');
  const currentTheme = controlledTheme || internalTheme;

  const handleSelectTheme = (presetId: ThemePresetKey) => {
    if (onThemeChange) {
      onThemeChange(presetId);
    } else {
      setInternalTheme(presetId);
    }
  };

  // Keyboard navigation for 1, 2, 3, 4 theme tasting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable);
      if (isInput) return;

      if (e.key === '1') handleSelectTheme('classic-deck');
      else if (e.key === '2') handleSelectTheme('spotlight-focus');
      else if (e.key === '3') handleSelectTheme('terminal-matrix');
      else if (e.key === '4') handleSelectTheme('editorial-clean');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time typography bindings with tasteful fallbacks
  const displayName = fullName.trim() || 'Elena Vance';
  const displayUsername = username.trim().toLowerCase() || 'elena_vance';
  const watermarkUrl = `soodfolio.com/${displayUsername}`;

  const currentPreset =
    TASTING_PRESETS.find((p) => p.id === currentTheme) || TASTING_PRESETS[0];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative select-none">
      {/* Background Architectural Blueprint Dot-Grid & Hairline Coordinate Guides */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]"
        aria-hidden="true"
      />

      {/* Blueprint Corner Crosshairs '+' */}
      <div className="absolute top-4 left-4 text-white/20 font-mono text-xs select-none pointer-events-none" aria-hidden="true">
        + 00°00&apos;N
      </div>
      <div className="absolute top-4 right-4 text-white/20 font-mono text-xs select-none pointer-events-none" aria-hidden="true">
        + 16:9 VIEW
      </div>
      <div className="absolute bottom-4 left-4 text-white/20 font-mono text-xs select-none pointer-events-none" aria-hidden="true">
        + STAGE.SPEC.V2
      </div>
      <div className="absolute bottom-4 right-4 text-white/20 font-mono text-xs select-none pointer-events-none" aria-hidden="true">
        + 100% SCALE
      </div>

      {/* Stage Wrapper */}
      <div className="w-full max-w-[620px] relative z-10 flex flex-col items-center">
        {/* Top HUD Telemetry Bar */}
        <div className="w-full flex items-center justify-between mb-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sans font-medium text-xs text-slate-300">Live Compiling Stage</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500 font-mono text-[11px]">SLIDE 01</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>16:9 ASPECT</span>
            <span className="text-slate-600">·</span>
            <span className="text-teal-400 font-sans font-medium">{currentPreset.label}</span>
          </div>
        </div>

        {/* The 16:9 Presentation Canvas */}
        <div
          data-theme-preset={currentTheme}
          className={`w-full aspect-video rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-5 sm:p-7 shadow-2xl backdrop-blur-md ${
            currentTheme === 'classic-deck'
              ? 'bg-[#080D12] border-teal-500/30'
              : currentTheme === 'spotlight-focus'
              ? 'bg-[#0B0F19] border-indigo-500/30'
              : currentTheme === 'terminal-matrix'
              ? 'bg-[#05080A] border-emerald-500/30'
              : 'bg-[#121110] border-amber-500/30'
          }`}
        >
          {/* Spotlight theme radial light accent */}
          {currentTheme === 'spotlight-focus' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 30%, rgba(129, 140, 248, 0.22), transparent 70%)',
              }}
              aria-hidden="true"
            />
          )}

          {/* Slide 01: Top Header Row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium border ${currentPreset.badgeBg} ${currentPreset.badgeText} ${currentPreset.borderAccent}`}
              >
                <Layers className="w-3 h-3" />
                <span>SLIDE 01 · IDENTITY & HERO COVER</span>
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
              {watermarkUrl}
            </div>
          </div>

          {/* Slide 01: Center Identity Content (Varies gracefully by theme) */}
          <div className="relative z-10 my-auto py-2">
            {currentTheme === 'terminal-matrix' ? (
              // Terminal Matrix Flavor
              <div className="space-y-2 font-mono">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>INIT // SYS.IDENTITY.STAGE</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="text-emerald-400">&gt;</span>
                    <span className="text-emerald-300 font-mono">{displayName}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Staff Infrastructure &amp; Systems Engineer · Distributed Kernels
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    @{displayUsername}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400">STATUS: READY FOR PRODUCTION</span>
                </div>
              </div>
            ) : currentTheme === 'spotlight-focus' ? (
              // Spotlight Focus Flavor (Centered dramatic showcase)
              <div className="text-center space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-sans font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>@{displayUsername}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto line-clamp-1 font-sans">
                  Principal Distributed Systems Architect · Real-time Telemetry
                </p>
              </div>
            ) : currentTheme === 'editorial-clean' ? (
              // Editorial Clean Flavor (Asymmetric elegant typography)
              <div className="space-y-2.5 border-l-2 border-amber-500/50 pl-4 py-1">
                <div className="text-[10px] font-sans uppercase tracking-widest text-amber-400 font-semibold">
                  01 · Technical Dossier
                </div>
                <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-white font-medium">
                  {displayName}
                </h2>
                <p className="text-xs text-slate-300 max-w-sm line-clamp-2 leading-relaxed">
                  Designing resilient high-concurrency protocols and mission-critical cloud native platforms.
                </p>
              </div>
            ) : (
              // Classic Deck Flavor (Dark Onyx + Ruza Teal + Inter)
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans font-medium text-teal-400">
                    @{displayUsername}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-[11px] font-sans text-slate-400">Exhibition Ready</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans line-clamp-1">
                  Principal Distributed Systems Engineer · High-Throughput Architect
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    Distributed Consensus
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    Zero-Downtime Migration
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    eBPF &amp; Rust
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Slide 01: Bottom Telemetry & Watermark Footer */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>99.999% SLA ARCHITECTURE</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span>LATENCY: 14MS</span>
              <span className="text-slate-600">·</span>
              <span>12 PATENTS</span>
            </div>
          </div>
        </div>

        {/* Interactive Theme Tasting Controls (Directly below 16:9 Canvas) */}
        <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] font-sans font-medium text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Nếm thử giao diện:</span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            {TASTING_PRESETS.map((preset) => {
              const isActive = currentTheme === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectTheme(preset.id)}
                  aria-pressed={isActive}
                  aria-label={`${preset.keyNum} · ${preset.label}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                  title={`${preset.keyNum} · ${preset.label} (${preset.tagline})`}
                >
                  <kbd className="px-1 py-0.2 rounded text-[10px] font-mono bg-black/40 text-slate-300 border border-white/10">
                    {preset.keyNum}
                  </kbd>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

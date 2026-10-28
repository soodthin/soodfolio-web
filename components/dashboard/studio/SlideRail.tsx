'use client';

import React from 'react';
import { StudioSlideKey, STUDIO_SLIDES } from './types';
import { PortfolioData } from '@/types/portfolio';
import {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SlideRailProps {
  activeSlide: StudioSlideKey;
  onSelectSlide: (slide: StudioSlideKey) => void;
  orientation?: 'vertical' | 'horizontal';
  portfolio?: PortfolioData | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
};

export const SlideRail: React.FC<SlideRailProps> = ({
  activeSlide,
  onSelectSlide,
  orientation = 'vertical',
  portfolio,
}) => {
  // Calculate profile completion percentage and tip
  const getCompletionStats = () => {
    let score = 0;
    const tips: string[] = [];

    if (portfolio?.fullName && portfolio?.tagline) {
      score += 25;
    } else {
      tips.push('Cập nhật tên và chức danh');
    }

    if (portfolio?.avatarUrl) {
      score += 15;
    } else {
      tips.push('Thêm ảnh đại diện avatar');
    }

    if (portfolio?.bio && portfolio.bio.length > 20) {
      score += 15;
    } else {
      tips.push('Viết đoạn bio ấn tượng');
    }

    if (portfolio?.socialLinks && portfolio.socialLinks.length > 0) {
      score += 15;
    } else {
      tips.push('Thêm liên kết GitHub/LinkedIn');
    }

    if (portfolio?.projects && portfolio.projects.length > 0) {
      score += 15;
    } else {
      tips.push('Thêm ít nhất 1 dự án');
    }

    if (portfolio?.experiences && portfolio.experiences.length > 0) {
      score += 15;
    } else {
      tips.push('Thêm 1 mốc kinh nghiệm');
    }

    const nextTip = tips[0] || 'Hồ sơ đã sẵn sàng để ứng tuyển!';
    return { score: Math.min(score, 100), nextTip };
  };

  const { score, nextTip } = getCompletionStats();

  if (orientation === 'horizontal') {
    return (
      <nav
        aria-label="Mobile Slide Navigation"
        className="flex items-center justify-around gap-1 p-1 bg-white/95 dark:bg-[#0c131a]/95 border-t border-slate-200 dark:border-white/[0.08] backdrop-blur-md"
      >
        {STUDIO_SLIDES.map((slide) => {
          const Icon = ICON_MAP[slide.iconName] || User;
          const isActive = activeSlide === slide.key;

          return (
            <button
              key={slide.key}
              type="button"
              onClick={() => onSelectSlide(slide.key)}
              className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-sans font-bold tabular-nums">{slide.number}</span>
              <Icon className="h-3.5 w-3.5 my-0.5" />
              <span className="text-xs tracking-tight">{slide.shortLabel}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-teal-500" />
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <aside
      aria-label="Slide Deck Rail"
      className="w-52 lg:w-56 h-full flex-shrink-0 flex flex-col justify-between border-r border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#080d12] transition-colors select-none min-h-0"
    >
      {/* Rail Top Title */}
      <div className="px-3.5 py-3 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-sans font-semibold text-slate-800 dark:text-slate-200">
            Dải slide deck
          </span>
        </div>
        <span className="text-xs font-sans font-medium text-slate-400 bg-slate-100 dark:bg-white/[0.05] px-1.5 py-0.5 rounded tabular-nums">
          5 slides
        </span>
      </div>

      {/* Slide Thumbnails List (Pitch.com style) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 custom-scrollbar min-h-0">
        {STUDIO_SLIDES.map((slide) => {
          const Icon = ICON_MAP[slide.iconName] || User;
          const isActive = activeSlide === slide.key;

          return (
            <button
              key={slide.key}
              type="button"
              onClick={() => onSelectSlide(slide.key)}
              title={`${slide.number} - ${slide.title} · Phím tắt ${slide.shortcut}`}
              className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border group relative ${
                isActive
                  ? 'bg-teal-500/[0.07] dark:bg-teal-400/[0.06] border-teal-500/50 shadow-sm shadow-teal-500/10 ring-1 ring-teal-500/20'
                  : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              {/* Header inside thumbnail: Single number + Shortcut + Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-sans font-bold tabular-nums px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 font-extrabold'
                        : 'bg-slate-200/80 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {slide.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {slide.title}
                  </span>
                </div>

                <kbd className="text-xs font-sans px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-400 border border-slate-200 dark:border-white/10 group-hover:text-teal-500 transition-colors">
                  {slide.shortcut}
                </kbd>
              </div>

              {/* 16:9 Realistic Mini Thumbnail Mockup */}
              <div
                className={`w-full aspect-[16/9] rounded-lg border p-1.5 flex flex-col justify-between overflow-hidden transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-[#0c141d] border-teal-500/30'
                    : 'bg-white/80 dark:bg-black/40 border-slate-200 dark:border-white/[0.04]'
                }`}
              >
                {/* Visual Mini Mockup tailored per slide */}
                {slide.key === 'cover' && (
                  <div className="h-full flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-md bg-teal-500/20 border border-teal-500/40 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div className="h-1 w-10 rounded-full bg-teal-500/50" />
                      <div className="h-1 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                )}

                {slide.key === 'projects' && (
                  <div className="h-full grid grid-cols-2 gap-1 items-center">
                    <div className="h-full rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.04] p-1 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-teal-500/60 rounded" />
                      <div className="h-1 w-8 bg-slate-300 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="h-full rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.04] p-1 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-teal-500/60 rounded" />
                      <div className="h-1 w-8 bg-slate-300 dark:bg-slate-600 rounded" />
                    </div>
                  </div>
                )}

                {slide.key === 'experience' && (
                  <div className="h-full flex flex-col justify-center gap-1.5 px-1">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <div className="h-1 w-16 bg-slate-300 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <div className="h-1 w-12 bg-slate-300 dark:bg-slate-600 rounded" />
                    </div>
                  </div>
                )}

                {slide.key === 'skills' && (
                  <div className="h-full flex flex-wrap gap-1 content-center p-0.5">
                    <div className="h-2 w-6 bg-teal-500/30 rounded border border-teal-500/40" />
                    <div className="h-2 w-7 bg-slate-200 dark:bg-white/10 rounded" />
                    <div className="h-2 w-5 bg-slate-200 dark:bg-white/10 rounded" />
                    <div className="h-2 w-8 bg-teal-500/30 rounded border border-teal-500/40" />
                  </div>
                )}

                {slide.key === 'settings' && (
                  <div className="h-full flex flex-col justify-center gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="h-1 w-10 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-1.5 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-1 w-8 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-1.5 w-3 rounded-full bg-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitle / summary */}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                {slide.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Rail Bottom: Profile Completion Meter */}
      <div className="p-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#0c131a]/60 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Độ hoàn thiện
          </span>
          <span className="font-sans font-bold tabular-nums text-teal-600 dark:text-teal-400">
            {score}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Actionable Tip */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
          <span className="truncate">{nextTip}</span>
        </p>
      </div>
    </aside>
  );
};

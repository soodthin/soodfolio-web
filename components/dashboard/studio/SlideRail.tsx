'use client';

import React from 'react';
import { StudioSlideKey, STUDIO_SLIDES } from './types';
import { PortfolioData } from '@/types/portfolio';
import {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Mail,
  Sliders,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SlideRailProps {
  activeSlide: StudioSlideKey;
  onSelectSlide: (slide: StudioSlideKey) => void;
  orientation?: 'vertical' | 'horizontal';
  portfolio?: PortfolioData | null;
  onToggleVisibility?: (field: 'showProjects' | 'showExperience' | 'showSkills' | 'showContact') => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Mail,
  Sliders,
};

export const SlideRail: React.FC<SlideRailProps> = ({
  activeSlide,
  onSelectSlide,
  orientation = 'vertical',
  portfolio,
  onToggleVisibility,
}) => {
  // Helper to map slide to its visibility toggle field
  const getVisibilityField = (key: StudioSlideKey): 'showProjects' | 'showExperience' | 'showSkills' | 'showContact' | null => {
    switch (key) {
      case 'projects':
        return 'showProjects';
      case 'experience':
        return 'showExperience';
      case 'skills':
        return 'showSkills';
      case 'contact':
        return 'showContact';
      default:
        return null;
    }
  };

  const isSlideVisible = (key: StudioSlideKey): boolean => {
    if (!portfolio) return true;
    switch (key) {
      case 'projects':
        return portfolio.showProjects ?? true;
      case 'experience':
        return portfolio.showExperience ?? true;
      case 'skills':
        return portfolio.showSkills ?? true;
      case 'contact':
        return portfolio.showContact ?? true;
      default:
        return true;
    }
  };

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
        className="flex items-center justify-around gap-1 p-1 bg-white/95 dark:bg-[#080d12]/95 border-t border-slate-200 dark:border-white/[0.08] backdrop-blur-md"
      >
        {STUDIO_SLIDES.map((slide) => {
          const Icon = ICON_MAP[slide.iconName] || User;
          const isActive = activeSlide === slide.key;

          return (
            <button
              key={slide.key}
              type="button"
              onClick={() => onSelectSlide(slide.key)}
              className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-[11px] font-sans font-bold tabular-nums">{slide.number}</span>
              <Icon className="h-3.5 w-3.5 my-0.5" />
              <span className="text-[10px] tracking-tight truncate max-w-[60px]">{slide.shortLabel}</span>
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
      className="w-[220px] h-full flex-shrink-0 flex flex-col justify-between border-r border-[#d6d0c2] dark:border-white/[0.07] bg-[#f4f1ea] dark:bg-[#080d12] transition-colors select-none min-h-0"
    >
      {/* Rail Top Title */}
      <div className="px-3.5 py-3 border-b border-[#d6d0c2] dark:border-white/[0.05] flex items-center justify-between flex-shrink-0 bg-[#ede8dd] dark:bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-sans font-semibold text-stone-800 dark:text-slate-200">
            Storyboard Spine
          </span>
        </div>
        <span className="text-[11px] font-sans font-medium text-stone-700 dark:text-slate-400 bg-[#e2dcd0] dark:bg-white/[0.05] px-1.5 py-0.5 rounded tabular-nums">
          5 slides
        </span>
      </div>

      {/* Slide Thumbnails Filmstrip (Linear/Pitch style) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar min-h-0">
        {STUDIO_SLIDES.map((slide) => {
          const isActive = activeSlide === slide.key;
          const visField = getVisibilityField(slide.key);
          const visible = isSlideVisible(slide.key);

          return (
            <div
              key={slide.key}
              onClick={() => onSelectSlide(slide.key)}
              title={`${slide.number} - ${slide.title} · Phím tắt ${slide.shortcut}`}
              className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer border group relative ${
                isActive
                  ? 'bg-[#fbfaf7] dark:bg-teal-400/[0.07] border-teal-600 dark:border-teal-400/50 shadow-xs ring-1 ring-teal-500/30'
                  : 'bg-[#ede8dd]/70 dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.06] hover:bg-[#ede8dd] hover:border-stone-400 dark:hover:border-white/20'
              } ${!visible ? 'opacity-50' : ''}`}
            >
              {/* Header inside thumbnail: Number + Title + Visibility Toggle + Shortcut */}
              <div className="flex items-center justify-between mb-1.5 gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[11px] font-sans font-bold tabular-nums px-1.5 py-0.5 rounded flex-shrink-0 ${
                      isActive
                        ? 'bg-teal-600 text-white font-extrabold'
                        : 'bg-[#e2dcd0] dark:bg-white/[0.08] text-stone-700 dark:text-slate-300'
                    }`}
                  >
                    {slide.number}
                  </span>
                  <span className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                    {slide.title.replace(/^\d+\s*/, '')}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {visField && onToggleVisibility && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(visField);
                      }}
                      title={visible ? 'Slide đang hiển thị (Click để ẩn)' : 'Slide đang ẩn (Click để hiện)'}
                      className={`p-1 rounded hover:bg-stone-300/60 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                        visible ? 'text-stone-400 hover:text-teal-600' : 'text-amber-500 dark:text-amber-400'
                      }`}
                    >
                      {visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </button>
                  )}
                  <kbd className="text-[10px] font-sans px-1 py-0.5 rounded bg-[#e2dcd0] dark:bg-white/[0.06] text-stone-600 dark:text-slate-400 border border-[#d6d0c2] dark:border-white/10 group-hover:text-teal-600 transition-colors">
                    {slide.shortcut}
                  </kbd>
                </div>
              </div>

              {/* 16:9 Realistic Mini Thumbnail Mockup */}
              <div
                className={`w-full aspect-[16/9] rounded-lg border p-1.5 flex flex-col justify-between overflow-hidden transition-colors ${
                  isActive
                    ? 'bg-[#fbfaf7] dark:bg-[#0c141d] border-teal-500/40'
                    : 'bg-[#ede8dd] dark:bg-[#080d12] border-[#d6d0c2] dark:border-white/[0.04]'
                }`}
              >
                {/* Visual Mini Mockup tailored per slide */}
                {slide.key === 'cover' && (
                  <div className="h-full flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-md bg-teal-500/20 border border-teal-500/40 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-12 rounded-full bg-stone-300 dark:bg-slate-600" />
                      <div className="h-1 w-8 rounded-full bg-teal-500/50" />
                      <div className="h-1 w-14 rounded-full bg-stone-300 dark:bg-slate-700" />
                    </div>
                  </div>
                )}

                {slide.key === 'projects' && (
                  <div className="h-full grid grid-cols-2 gap-1 items-center">
                    <div className="h-full rounded bg-[#f4f1ea] dark:bg-white/[0.05] border border-[#d6d0c2] dark:border-white/[0.04] p-1 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-teal-500/60 rounded" />
                      <div className="h-1 w-8 bg-stone-300 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="h-full rounded bg-[#f4f1ea] dark:bg-white/[0.05] border border-[#d6d0c2] dark:border-white/[0.04] p-1 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-teal-500/60 rounded" />
                      <div className="h-1 w-8 bg-stone-300 dark:bg-slate-600 rounded" />
                    </div>
                  </div>
                )}

                {slide.key === 'experience' && (
                  <div className="h-full flex flex-col justify-center gap-1.5 px-1">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <div className="h-1 w-14 bg-stone-300 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                      <div className="h-1 w-10 bg-stone-300 dark:bg-slate-600 rounded" />
                    </div>
                  </div>
                )}

                {slide.key === 'skills' && (
                  <div className="h-full flex flex-wrap gap-1 content-center p-0.5">
                    <div className="h-2 w-5 bg-teal-500/30 rounded border border-teal-500/40" />
                    <div className="h-2 w-6 bg-[#f4f1ea] dark:bg-white/10 rounded" />
                    <div className="h-2 w-4 bg-[#f4f1ea] dark:bg-white/10 rounded" />
                    <div className="h-2 w-7 bg-teal-500/30 rounded border border-teal-500/40" />
                  </div>
                )}

                {(slide.key === 'contact' || slide.key === 'settings') && (
                  <div className="h-full flex flex-col justify-between p-1">
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-8 bg-teal-500/40 rounded" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-2 rounded bg-[#f4f1ea] dark:bg-white/10" />
                      <div className="h-2 rounded bg-teal-500/20 border border-teal-500/30" />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitle / summary */}
              <div className="text-[11px] text-stone-600 dark:text-slate-400 mt-1 truncate">
                {slide.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rail Bottom: Profile Completion Meter */}
      <div className="p-3 pb-8 border-t border-[#d6d0c2] dark:border-white/[0.06] bg-[#ede8dd]/80 dark:bg-[#0c131a]/60 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="font-semibold text-stone-700 dark:text-slate-300">
            Độ hoàn thiện
          </span>
          <span className="font-sans font-bold tabular-nums text-teal-700 dark:text-teal-400">
            {score}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-stone-300 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Actionable Tip */}
        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-2 truncate flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
          <span className="truncate">{nextTip}</span>
        </p>
      </div>
    </aside>
  );
};

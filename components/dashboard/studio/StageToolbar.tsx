'use client';

import React from 'react';
import { StudioSlideKey, STUDIO_SLIDES, StageZoom, StageViewportMode } from './types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
} from 'lucide-react';

interface StageToolbarProps {
  activeSlide: StudioSlideKey;
  onSelectSlide: (slide: StudioSlideKey) => void;
  zoom: StageZoom;
  onSetZoom: (zoom: StageZoom) => void;
  stageTheme: 'dark' | 'light';
  onToggleStageTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  viewportMode: StageViewportMode;
  onSetViewportMode: (mode: StageViewportMode) => void;
}

export const StageToolbar: React.FC<StageToolbarProps> = ({
  activeSlide,
  onSelectSlide,
  zoom,
  onSetZoom,
  stageTheme,
  onToggleStageTheme,
  isFullscreen,
  onToggleFullscreen,
  viewportMode,
  onSetViewportMode,
}) => {
  const currentIndex = STUDIO_SLIDES.findIndex((s) => s.key === activeSlide);
  const currentSlide = STUDIO_SLIDES[currentIndex] || STUDIO_SLIDES[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectSlide(STUDIO_SLIDES[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (currentIndex < STUDIO_SLIDES.length - 1) {
      onSelectSlide(STUDIO_SLIDES[currentIndex + 1].key);
    }
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full border border-[#d6d0c2] dark:border-white/10 bg-[#fbfaf7]/95 dark:bg-[#0c131a]/90 backdrop-blur-xl shadow-xl shadow-stone-900/10 flex items-center justify-between gap-2.5 text-xs select-none max-w-[95%]">
      {/* Left: Viewport Mode Switchers */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-[#ede8dd] dark:bg-white/[0.05] border border-[#d6d0c2] dark:border-white/10">
          <button
            type="button"
            onClick={() => onSetViewportMode('16:9')}
            title="Sân khấu chuẩn 16:9 Desktop"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              viewportMode === '16:9'
                ? 'bg-[#fbfaf7] dark:bg-[#111a24] text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewportMode('tablet')}
            title="Khung nhìn Tablet"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-[#fbfaf7] dark:bg-[#111a24] text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewportMode('mobile')}
            title="Khung nhìn Mobile (9:16)"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-[#fbfaf7] dark:bg-[#111a24] text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Zoom Selector */}
        <select
          value={zoom}
          onChange={(e) => onSetZoom(e.target.value as StageZoom)}
          className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#ede8dd] dark:bg-white/[0.05] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-300 font-sans text-[11px] cursor-pointer"
        >
          <option value="fit">Fit 100%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
          <option value="125%">125%</option>
        </select>
      </div>

      {/* Middle: Slide Navigation Arrows */}
      <div className="flex items-center gap-1 font-sans text-xs">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Slide trước (Phím ←)"
          aria-label="Slide trước"
          className="p-1 rounded-full hover:bg-[#ede8dd] dark:hover:bg-white/[0.08] text-stone-600 dark:text-slate-400 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <span className="px-2 py-0.5 rounded-full bg-[#ede8dd] dark:bg-white/[0.04] text-stone-800 dark:text-slate-200 font-semibold text-[11px] tabular-nums">
          SLIDE {currentSlide.number} · 0{STUDIO_SLIDES.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === STUDIO_SLIDES.length - 1}
          title="Slide kế tiếp (Phím →)"
          aria-label="Slide kế tiếp"
          className="p-1 rounded-full hover:bg-[#ede8dd] dark:hover:bg-white/[0.08] text-stone-600 dark:text-slate-400 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right: Theme Toggle & Fullscreen */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onToggleStageTheme}
          title={stageTheme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          aria-label="Chuyển đổi giao diện Sáng / Tối của sân khấu"
          className="p-1 rounded-full text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#ede8dd] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {stageTheme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-stone-700 dark:text-slate-300" />}
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Thu nhỏ (F5)' : 'Toàn màn hình Sân khấu (F5)'}
          aria-label="Chuyển đổi chế độ toàn màn hình"
          className="p-1 rounded-full text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#ede8dd] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

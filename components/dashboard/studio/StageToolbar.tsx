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
    <div className="h-11 px-3 sm:px-4 border-b border-slate-200/80 dark:border-white/[0.07] bg-white/80 dark:bg-[#0c131a]/80 backdrop-blur-md flex items-center justify-between gap-2 text-xs flex-shrink-0 select-none">
      {/* Left: Viewport Mode Switchers */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => onSetViewportMode('16:9')}
            title="Sân khấu chuẩn 16:9 Desktop"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              viewportMode === '16:9'
                ? 'bg-white dark:bg-[#111a24] text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewportMode('tablet')}
            title="Khung nhìn Tablet"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-white dark:bg-[#111a24] text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewportMode('mobile')}
            title="Khung nhìn Mobile (9:16)"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white dark:bg-[#111a24] text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Zoom Selector */}
        <select
          value={zoom}
          onChange={(e) => onSetZoom(e.target.value as StageZoom)}
          className="hidden sm:inline-block px-2 py-1 rounded-md bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-sans text-[11px] cursor-pointer"
        >
          <option value="fit">Fit 100%</option>
          <option value="75%">Zoom 75%</option>
          <option value="100%">Zoom 100%</option>
          <option value="125%">Zoom 125%</option>
        </select>
      </div>

      {/* Middle: Slide Navigation Arrows */}
      <div className="flex items-center gap-1.5 font-sans text-xs">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Slide trước (Phím ←)"
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
          SLIDE {currentSlide.number} · 0{STUDIO_SLIDES.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === STUDIO_SLIDES.length - 1}
          title="Slide kế tiếp (Phím →)"
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Right: Theme Toggle & Fullscreen */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleStageTheme}
          title={`Xem trước giao diện: ${stageTheme === 'dark' ? 'Dark' : 'Light'}`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {stageTheme === 'dark' ? <Moon className="h-3.5 w-3.5 text-teal-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Thu nhỏ (F5)' : 'Toàn màn hình Sân khấu (F5)'}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

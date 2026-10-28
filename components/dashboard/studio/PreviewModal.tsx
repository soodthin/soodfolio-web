'use client';

import React, { useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import {
  StudioSlideKey,
  STUDIO_SLIDES,
  StageZoom,
  StageViewportMode,
} from './types';
import { PresentationStage } from './PresentationStage';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  ZoomIn,
} from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData | null;
  activeSlide: StudioSlideKey;
  onSelectSlide: (slide: StudioSlideKey) => void;
  stageTheme: 'dark' | 'light';
  onToggleStageTheme: () => void;
  zoom: StageZoom;
  onSetZoom: (zoom: StageZoom) => void;
  viewportMode: StageViewportMode;
  onSetViewportMode: (mode: StageViewportMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onFieldClick?: (fieldId: string) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  activeSlide,
  onSelectSlide,
  stageTheme,
  onToggleStageTheme,
  zoom,
  onSetZoom,
  viewportMode,
  onSetViewportMode,
  isFullscreen,
  onToggleFullscreen,
  onFieldClick,
}) => {
  // Current slide index
  const currentIndex = STUDIO_SLIDES.findIndex((s) => s.key === activeSlide);
  const currentSlideMeta = STUDIO_SLIDES[currentIndex] || STUDIO_SLIDES[0];

  // Handle keyboard navigation within modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          onSelectSlide(STUDIO_SLIDES[currentIndex - 1].key);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < STUDIO_SLIDES.length - 1) {
          onSelectSlide(STUDIO_SLIDES[currentIndex + 1].key);
        }
      } else if (e.key === 'F5' || e.key === 'f') {
        // Toggle fullscreen
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          onToggleFullscreen();
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const target = STUDIO_SLIDES[parseInt(e.key, 10) - 1];
        if (target) onSelectSlide(target.key);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, onClose, onSelectSlide, onToggleFullscreen]);

  if (!isOpen) return null;

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      onSelectSlide(STUDIO_SLIDES[currentIndex - 1].key);
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < STUDIO_SLIDES.length - 1) {
      onSelectSlide(STUDIO_SLIDES[currentIndex + 1].key);
    }
  };

  const handleStageFieldClick = (fieldId: string) => {
    onClose();
    if (onFieldClick) {
      onFieldClick(fieldId);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-stage-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#080d12]/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-200 select-none text-slate-100"
    >
      {/* Top Controls Bar */}
      <header className="h-14 px-4 sm:px-6 border-b border-white/[0.08] bg-[#0c131a]/90 flex items-center justify-between gap-3 flex-shrink-0 z-20">
        {/* Left: Indicator, Slide Navigator `< 01 / 05 >` and Current Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Eye className="h-4 w-4" />
            </div>
            <span
              id="preview-stage-title"
              className="text-xs font-sans font-semibold text-slate-300 hidden sm:inline"
            >
              Xem Preview
            </span>
          </div>

          <span className="text-white/20 text-xs hidden sm:inline">·</span>

          {/* Stepper `< 01/05 >` */}
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={currentIndex === 0}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer transition-colors"
              title="Slide trước (Phím ←)"
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="text-xs font-sans font-medium px-2 tabular-nums text-slate-200">
              {currentSlideMeta.number} / 0{STUDIO_SLIDES.length}
            </span>

            <button
              type="button"
              onClick={handleNextSlide}
              disabled={currentIndex === STUDIO_SLIDES.length - 1}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer transition-colors"
              title="Slide kế tiếp (Phím →)"
              aria-label="Slide kế tiếp"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="font-semibold text-xs text-slate-200 truncate hidden md:inline">
            {currentSlideMeta.title}
          </span>
        </div>

        {/* Middle: Horizontal Jump Pills (Desktop) */}
        <nav
          aria-label="Điều hướng slide preview nhanh"
          className="hidden lg:flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/10"
        >
          {STUDIO_SLIDES.map((slide) => {
            const isActive = activeSlide === slide.key;
            return (
              <button
                key={slide.key}
                type="button"
                onClick={() => onSelectSlide(slide.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{slide.number}</span>
                <span className="ml-1">{slide.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Stage Toolbar Controls & Close X Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Viewport Mode Switcher (16:9, Tablet, Mobile) */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10">
            <button
              type="button"
              onClick={() => onSetViewportMode('16:9')}
              title="Chế độ Màn ảnh rộng 16:9 Desktop"
              aria-label="Xem tỷ lệ 16:9 Desktop"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === '16:9' ? 'bg-white/10 text-teal-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSetViewportMode('tablet')}
              title="Chế độ Tablet"
              aria-label="Xem tỷ lệ Tablet"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'tablet' ? 'bg-white/10 text-teal-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSetViewportMode('mobile')}
              title="Chế độ Điện thoại"
              aria-label="Xem tỷ lệ Điện thoại"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'mobile' ? 'bg-white/10 text-teal-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Zoom Selector */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-sans text-slate-300">
            <ZoomIn className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={zoom}
              onChange={(e) => onSetZoom(e.target.value as StageZoom)}
              aria-label="Tỷ lệ thu phóng sân khấu"
              className="bg-transparent text-slate-300 outline-none cursor-pointer text-xs"
            >
              <option value="fit" className="bg-[#0c131a]">Fit</option>
              <option value="75%" className="bg-[#0c131a]">75%</option>
              <option value="100%" className="bg-[#0c131a]">100%</option>
              <option value="125%" className="bg-[#0c131a]">125%</option>
            </select>
          </div>

          {/* Stage Theme Toggle */}
          <button
            type="button"
            onClick={onToggleStageTheme}
            aria-label="Chuyển đổi giao diện Sáng / Tối của sân khấu"
            title="Đổi theme xem trước Sáng / Tối"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {stageTheme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-teal-300" />}
          </button>

          {/* Fullscreen F5 Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label="Phóng to toàn màn hình"
            title="Phóng to toàn màn hình (F5)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <span className="h-4 w-px bg-white/10 mx-1" />

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bản xem trước Preview"
            title="Đóng bản xem trước (Phím Escape)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Đóng</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Presentation View */}
      <div className="flex-1 overflow-hidden min-h-0 relative flex flex-col">
        <PresentationStage
          portfolio={portfolio}
          activeSlide={activeSlide}
          zoom={zoom}
          stageTheme={stageTheme}
          viewportMode={viewportMode}
          isFullscreen={isFullscreen}
          onFieldClick={handleStageFieldClick}
          variant={portfolio?.themeConfig}
        />
      </div>
    </div>
  );
};

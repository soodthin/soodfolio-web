'use client';

import { useEffect } from 'react';
import { StudioSlideKey, STUDIO_SLIDES } from './types';

interface UseStudioShortcutsProps {
  activeSlide: StudioSlideKey;
  onSelectSlide: (slide: StudioSlideKey) => void;
  onToggleJsonMode?: () => void;
  onToggleFullscreen?: () => void;
  onToggleCommandPalette?: () => void;
}

export function useStudioShortcuts({
  activeSlide,
  onSelectSlide,
  onToggleJsonMode,
  onToggleFullscreen,
  onToggleCommandPalette,
}: UseStudioShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K: Toggle Command Palette (always allowed)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onToggleCommandPalette?.();
        return;
      }

      // Ignore if user is currently typing inside an input, textarea or contenteditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      // Cmd+J or Ctrl+J: Toggle Form ↔ JSON Mode
      if ((e.metaKey || e.ctrlKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        onToggleJsonMode?.();
        return;
      }

      // F5 or 'f' (when no modifier): Toggle Fullscreen
      if (e.key === 'F5' || (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey)) {
        e.preventDefault();
        onToggleFullscreen?.();
        return;
      }

      // Keys 1 to 5: Select slide directly
      const slideIndex = parseInt(e.key, 10);
      if (!isNaN(slideIndex) && slideIndex >= 1 && slideIndex <= STUDIO_SLIDES.length) {
        e.preventDefault();
        const targetSlide = STUDIO_SLIDES[slideIndex - 1];
        if (targetSlide) {
          onSelectSlide(targetSlide.key);
        }
        return;
      }

      // Left / Right arrow navigation
      const currentIndex = STUDIO_SLIDES.findIndex((s) => s.key === activeSlide);
      if (e.key === 'ArrowRight' && currentIndex < STUDIO_SLIDES.length - 1) {
        e.preventDefault();
        onSelectSlide(STUDIO_SLIDES[currentIndex + 1].key);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onSelectSlide(STUDIO_SLIDES[currentIndex - 1].key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide, onSelectSlide, onToggleJsonMode, onToggleFullscreen, onToggleCommandPalette]);
}

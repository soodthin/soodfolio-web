'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  className?: string;
}

export function ScrollToTop({ className = '' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className={`fixed bottom-6 right-6 z-40 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center bg-[#0C131A] text-slate-300 border-white/10 hover:text-teal-400 hover:border-teal-500/40 hover:bg-[#111A24] dark:bg-[#0C131A] dark:border-white/10 dark:text-slate-300 dark:hover:text-teal-400 dark:hover:border-teal-500/40 ${className}`}
    >
      <ArrowUp className="w-4 h-4 stroke-[2.2]" />
    </button>
  );
}

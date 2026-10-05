'use client';

import { useState, useEffect, useRef } from 'react';

export interface SlideInfo {
  id: string;
  number: string;
  title: string;
  parentTitle?: string;
}

interface SlideNavProps {
  slides: SlideInfo[];
  activeIndex: number;
  onSelectSlide: (index: number) => void;
}

export function SlideNav({ slides, activeIndex, onSelectSlide }: SlideNavProps) {
  const [isAwake, setIsAwake] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [hoveredSubIndex, setHoveredSubIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerWake = () => {
    setIsAwake(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsAwake(false);
    }, 2400);
  };

  useEffect(() => {
    triggerWake();
  }, [activeIndex]);

  useEffect(() => {
    const handleActivity = () => {
      triggerWake();
    };

    window.addEventListener('wheel', handleActivity, { passive: true });
    window.addEventListener('touchmove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener('wheel', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const isExpanded = isPinnedOpen || isHovered || isAwake;

  const projectSlides = slides
    .map((s, idx) => ({ ...s, globalIndex: idx }))
    .filter((s) => s.parentTitle === 'PROJECTS');

  const firstProjectIndex = projectSlides.length > 0 ? projectSlides[0].globalIndex : -1;
  const lastProjectIndex = projectSlides.length > 0 ? projectSlides[projectSlides.length - 1].globalIndex : -1;
  const isAnyProjectActive = firstProjectIndex !== -1 && activeIndex >= firstProjectIndex && activeIndex <= lastProjectIndex;

  const nonProjectSlidesBefore = slides
    .map((s, idx) => ({ ...s, globalIndex: idx }))
    .filter((s) => s.parentTitle !== 'PROJECTS' && (firstProjectIndex === -1 || s.globalIndex < firstProjectIndex));

  const nonProjectSlidesAfter = slides
    .map((s, idx) => ({ ...s, globalIndex: idx }))
    .filter((s) => s.parentTitle !== 'PROJECTS' && (firstProjectIndex !== -1 && s.globalIndex > lastProjectIndex));

  return (
    <nav
      aria-label="Slide navigation"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredSubIndex(null);
      }}
    >
      <div className="relative flex flex-col items-end gap-3 py-3">
        {/* Render slides before projects */}
        {nonProjectSlidesBefore.map((slide) => {
          const isActive = activeIndex === slide.globalIndex;
          return (
            <button
              key={slide.id}
              onClick={() => onSelectSlide(slide.globalIndex)}
              className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
              aria-label={`Go to ${slide.title} slide`}
            >
              <span
                className={`font-mono text-[11px] font-bold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#f8c076] opacity-100 translate-x-0'
                    : isExpanded
                    ? 'text-[#8cb0fd] opacity-80 translate-x-0 group-hover:text-white group-hover:opacity-100'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                {slide.title}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 bg-[#f8c076] shadow-[0_0_10px_rgba(248,192,118,0.6)]'
                    : 'w-2 h-2 bg-[#2d3f75] group-hover:bg-[#8cb0fd] group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}

        {/* Render projects group if projects exist */}
        {projectSlides.length > 0 && (
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => onSelectSlide(firstProjectIndex)}
              className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
              aria-label="Go to Projects slide"
            >
              <span
                className={`font-mono text-[11px] font-bold tracking-wider transition-all duration-300 ${
                  isAnyProjectActive
                    ? 'text-[#f8c076] opacity-100 translate-x-0'
                    : isExpanded
                    ? 'text-[#8cb0fd] opacity-80 translate-x-0 group-hover:text-white group-hover:opacity-100'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                PROJECTS
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isAnyProjectActive
                    ? 'w-2.5 h-6 bg-[#f8c076] shadow-[0_0_10px_rgba(248,192,118,0.6)]'
                    : 'w-2 h-2 bg-[#2d3f75] group-hover:bg-[#8cb0fd] group-hover:scale-125'
                }`}
              />
            </button>

            {/* Sub-dots for individual projects when expanded or active */}
            {isExpanded && (
              <div className="flex flex-col items-end gap-1 pr-0.5 border-r border-[#202f5c] my-0.5">
                {projectSlides.map((p, pIdx) => {
                  const isProjectActive = activeIndex === p.globalIndex;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectSlide(p.globalIndex)}
                      className="group flex items-center gap-2 cursor-pointer focus:outline-none pr-1.5"
                      aria-label={`Go to ${p.title}`}
                    >
                      <span
                        className={`font-mono text-[9px] transition-all ${
                          isProjectActive ? 'text-[#f8c076] font-bold' : 'text-[#6c82b5] group-hover:text-white'
                        }`}
                      >
                        {p.title}
                      </span>
                      <span
                        className={`block rounded-full transition-all ${
                          isProjectActive
                            ? 'w-1.5 h-1.5 bg-[#f8c076]'
                            : 'w-1 h-1 bg-[#233564] group-hover:bg-[#8cb0fd]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render slides after projects */}
        {nonProjectSlidesAfter.map((slide) => {
          const isActive = activeIndex === slide.globalIndex;
          return (
            <button
              key={slide.id}
              onClick={() => onSelectSlide(slide.globalIndex)}
              className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
              aria-label={`Go to ${slide.title} slide`}
            >
              <span
                className={`font-mono text-[11px] font-bold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#f8c076] opacity-100 translate-x-0'
                    : isExpanded
                    ? 'text-[#8cb0fd] opacity-80 translate-x-0 group-hover:text-white group-hover:opacity-100'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                {slide.title}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 bg-[#f8c076] shadow-[0_0_10px_rgba(248,192,118,0.6)]'
                    : 'w-2 h-2 bg-[#2d3f75] group-hover:bg-[#8cb0fd] group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

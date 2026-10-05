'use client';

import { useState, useRef } from 'react';
import { ExperienceDto } from '@/types/portfolio';

interface ExperienceProps {
  experiences: ExperienceDto[];
  slideNumber?: string;
}

function TechPopover({ tags }: { tags: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button
        type="button"
        aria-label="View all technologies"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-2.5 py-0.5 rounded-full text-xs font-mono border transition-all cursor-pointer font-bold inline-flex items-center ${
          isOpen
            ? 'bg-[#f8c076] text-[#0b1124] border-[#f8c076] shadow-[0_0_12px_rgba(248,192,118,0.4)]'
            : 'bg-[#15234d] text-[#f8c076] border-[#3a5294] hover:border-[#f8c076]'
        }`}
      >
        <span>+${tags.length} more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 z-50 w-72 p-3 rounded-xl border border-[#3b5496] bg-[#0c142b]/95 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-mono text-[#8cb0fd] mb-2 font-semibold uppercase tracking-wider">
            All Technologies Used
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {tags.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#14224a] border border-[#2b417e] text-[#ddd7ff]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Experience({ experiences, slideNumber = '02' }: ExperienceProps) {
  const [selectedExpIdx, setSelectedExpIdx] = useState(0);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const exp = experiences[selectedExpIdx] || experiences[0];
  const allSkills = exp.skillsUsed || [];
  const primarySkills = allSkills.slice(0, 4);
  const remainingSkills = allSkills.slice(4);

  return (
    <section id="experience" className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#f8c076] tracking-wider">{slideNumber}</span>
          <h2 className="text-lg sm:text-2xl font-sans font-bold uppercase tracking-wider text-[#f1edff]">
            Work Experience
          </h2>
        </div>

        {/* Tab switcher if multiple companies */}
        {experiences.length > 1 && (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {experiences.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedExpIdx(idx)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  idx === selectedExpIdx
                    ? 'border-[#f8c076] bg-[#1a2850] text-[#f8c076] font-bold shadow-sm'
                    : 'border-[#263768] bg-[#0c142b] text-[#8cb0fd] hover:text-white'
                }`}
              >
                {item.companyName}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#2f4684] bg-[#0e183a] p-4 sm:p-7 shadow-[0_22px_55px_rgba(8,14,35,0.95)] flex flex-col justify-between space-y-4">
        {/* Top: Role, Company, Period */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <span className="text-xs font-mono tracking-wider text-[#f8c076] font-semibold uppercase">
                {exp.periodText}
              </span>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-white mt-0.5">
                {exp.roleTitle}
              </h3>
              <div className="text-xs sm:text-sm font-sans text-[#8cb0fd] mt-0.5 flex items-center gap-2">
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#f8c076] transition-colors hover:underline font-mono"
                  >
                    {exp.companyName} ↗
                  </a>
                ) : (
                  <span>{exp.companyName}</span>
                )}
                <span>•</span>
                <span className="text-[#a6bde8]">{exp.location}</span>
              </div>
            </div>

            <div className="font-mono text-xs">
              <span className="px-3 py-1 rounded-full border border-[#344d8b] bg-[#121d3e] text-[#ddd7ff]">
                {String(selectedExpIdx + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-sans text-[#c5d5f6] leading-relaxed">
            {exp.description}
          </p>

          <div className="border-b border-[#213364]" />

          {/* Highlights Grid */}
          {exp.highlights && exp.highlights.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono tracking-wider text-[#8cb0fd] font-semibold uppercase">
                Key Contributions &amp; Architectural Impact
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {exp.highlights.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className="group relative pl-4 pr-3 py-2.5 sm:py-3 border-l-2 border-[#2b417e] hover:border-[#f8c076] bg-[#111c3d]/40 hover:bg-[#16244f]/60 rounded-r-xl transition-all duration-300 flex flex-col justify-start"
                  >
                    <div className="text-[#f8c076] font-mono text-xs font-bold mb-1 tracking-wide">
                      [{String(hIdx + 1).padStart(2, '0')}]
                    </div>
                    <p className="text-[#c5d5f6] font-sans text-xs leading-relaxed group-hover:text-[#e2edff] transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack footer */}
        {allSkills.length > 0 && (
          <div className="pt-3 border-t border-[#213364] flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#7a90c5] mr-1 uppercase">Skills Used:</span>
            {primarySkills.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#132047] border border-[#2b417e] text-[#ddd7ff]"
              >
                {tech}
              </span>
            ))}
            {remainingSkills.length > 0 && <TechPopover tags={remainingSkills} />}
          </div>
        )}
      </div>
    </section>
  );
}

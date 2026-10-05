'use client';

import { useState, useRef } from 'react';
import { ProjectDto } from '@/types/portfolio';

interface ProjectSlideProps {
  project: ProjectDto;
  slideNumber: string;
  projectIndex: number;
  totalProjects: number;
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
        aria-label="View all project tags"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-2.5 py-0.5 rounded-full text-xs font-mono border transition-all cursor-pointer font-bold inline-flex items-center ${
          isOpen
            ? 'border-[#f8c076] bg-[#f8c076] text-[#060a14]'
            : 'border-[#f8c076]/50 bg-[#172552] text-[#f8c076] hover:bg-[#f8c076] hover:text-[#060a14]'
        }`}
      >
        [ +{tags.length} ]
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full pt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-3rem)]"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div className="p-3 rounded-xl border border-[#324982] bg-[#0c142b] shadow-[0_16px_40px_rgba(0,0,0,0.95)]">
            <div className="text-[10px] font-mono tracking-wider text-[#8cb0fd] mb-2 pb-1.5 border-b border-[#1f2f5c] flex items-center justify-between">
              <span>All Technologies ({tags.length})</span>
              <span className="text-[#f8c076] font-semibold">Stack</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-[#2f4684] bg-[#132047] text-[#ddd7ff]"
                >
                  [ {tag} ]
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectSlide({
  project,
  slideNumber,
  projectIndex,
  totalProjects,
}: ProjectSlideProps) {
  const mainUrl = project.liveUrl || project.githubUrl;
  const tags = project.techStack || [];
  const primaryTags = tags.slice(0, 4);
  const remainingTags = tags.slice(4);

  return (
    <section
      id={`project-${project.id || projectIndex + 1}`}
      className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs text-[#f8c076] tracking-wider">{slideNumber}</span>
          <h2 className="text-lg sm:text-2xl font-sans font-bold uppercase tracking-wider text-[#f1edff]">
            Projects
          </h2>
          <span className="text-[#3b5087] font-mono text-sm hidden sm:inline">/</span>
          <span className="font-mono text-xs text-[#8cb0fd] tracking-widest hidden sm:inline uppercase">
            {project.role || 'SHOWCASE'}
          </span>
        </div>

        <div className="font-mono text-xs flex items-center gap-2">
          <span className="px-3 py-1 rounded-full border border-[#2f447d] bg-[#0d1633] text-[#f8c076] font-bold">
            {String(projectIndex + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-[#283e7a] bg-[#0c142e]/95 backdrop-blur-md p-4 sm:p-7 shadow-[0_20px_50px_rgba(8,14,35,0.95)] flex flex-col space-y-4">
        {/* Subheader: Tech Tags & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f2f5c]">
          <div className="flex flex-wrap items-center gap-1.5">
            {primaryTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-[#2b417e] bg-[#132047]/80 text-[#8cb0fd]"
              >
                [ {tag} ]
              </span>
            ))}
            {remainingTags.length > 0 && <TechPopover tags={remainingTags} />}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg border border-[#f8c076]/60 bg-[#f8c076]/10 text-[#f8c076] hover:bg-[#f8c076] hover:text-[#060a14] transition-all font-semibold inline-flex items-center gap-1.5"
              >
                <span>Live Demo</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg border border-[#304886] bg-[#14234d] text-[#8cb0fd] hover:border-[#8cb0fd] hover:text-white transition-all font-semibold inline-flex items-center gap-1.5"
              >
                <span>GitHub Repo</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3.5">
          <h3 className="text-2xl sm:text-3xl font-sans font-bold uppercase tracking-tight text-white shrink-0">
            {mainUrl ? (
              <a
                href={mainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f8c076] transition-colors inline-flex items-center gap-2 group"
              >
                <span>{project.title}</span>
                <span className="text-[#f8c076] text-xl font-normal group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </a>
            ) : (
              project.title
            )}
          </h3>

          {project.subtitle && (
            <p className="text-xs sm:text-sm font-sans text-[#95abdc]">
              {project.subtitle}
            </p>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#c5d5f6] font-sans leading-relaxed max-w-4xl">
          {project.description}
        </p>

        {/* Highlights Section */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono tracking-wider text-[#8cb0fd] font-semibold uppercase">
                What I Built &amp; Key Features
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#213364] to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#213467] bg-[#0a1129]/80 p-3 hover:border-[#3d599e] transition-colors flex items-start gap-2.5"
                >
                  <span className="text-[#f8c076] font-mono text-xs font-bold shrink-0 mt-0.5">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <p className="text-xs font-sans text-[#d0deff] leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

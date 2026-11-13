'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import {
  Printer,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon,
  Check,
  Copy,
  Layers,
  FileText
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface MinimalistPaperDocProps {
  portfolio: PortfolioData;
  companyName?: string;
  onSwitchLayout?: () => void;
  activeLayout?: 'CINEMATIC_DECK' | 'MINIMALIST_DOC';
  onActiveSlideChange?: (slideKey: string) => void;
}

const SECTIONS = [
  { id: 'overview', slideKey: 'hero', label: '01. Giới thiệu', icon: Sparkles },
  { id: 'experience', slideKey: 'experience', label: '02. Kinh nghiệm', icon: Briefcase },
  { id: 'projects', slideKey: 'projects', label: '03. Dự án tiêu biểu', icon: FolderGit2 },
  { id: 'skills', slideKey: 'skills', label: '04. Năng lực & Công nghệ', icon: Cpu },
  { id: 'education', slideKey: 'education', label: '05. Học vấn & Chứng chỉ', icon: GraduationCap },
  { id: 'contact', slideKey: 'contact', label: '06. Kênh liên hệ', icon: Mail },
];

export function MinimalistPaperDoc({
  portfolio,
  companyName,
  onSwitchLayout,
  activeLayout = 'MINIMALIST_DOC',
  onActiveSlideChange,
}: MinimalistPaperDocProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Default to clean paper light for document view
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Scroll spy with IntersectionObserver for TOC and telemetry tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = document.querySelectorAll<HTMLElement>('[data-slide-key]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideKey = entry.target.getAttribute('data-slide-key');
            if (slideKey) {
              const matchedSection = SECTIONS.find((s) => s.slideKey === slideKey || s.id === slideKey);
              if (matchedSection) {
                setActiveSection(matchedSection.id);
              }
              onActiveSlideChange?.(slideKey);
            }
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.05,
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [onActiveSlideChange]);

  const fullName = portfolio.fullName || portfolio.title || 'Ứng viên SoodFolio';
  const tagline = portfolio.tagline || 'Chuyên gia Kỹ thuật & Thiết kế';
  const emailLink = portfolio.socialLinks?.find((s) => s.platform.toLowerCase() === 'email' || s.url.startsWith('mailto:'));
  const emailAddress = emailLink ? emailLink.url.replace(/^mailto:/, '') : null;

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#090d14] text-slate-800 dark:text-slate-100 font-sans selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors">
      
      {/* Top Floating Control Bar (Hidden when printing) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#0c121c]/95 backdrop-blur-md transition-colors print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left Brand & Candidate info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {fullName}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs hidden sm:inline">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline truncate">
                Dossier Tài Liệu Chuẩn A4
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Target Company Badge (if provided) */}
            {companyName && (
              <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-800 dark:text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>Mục tiêu: {companyName}</span>
              </div>
            )}

            {/* Layout Switcher (Switch between Slide and Paper Doc) */}
            {onSwitchLayout && (
              <button
                type="button"
                onClick={onSwitchLayout}
                aria-label="Chuyển sang giao diện Slide Trình Chiếu"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                title="Chuyển sang dạng Slide tương tác"
              >
                <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Dạng Slide</span>
              </button>
            )}

            {/* Print Button (Ctrl + P) */}
            <button
              type="button"
              onClick={handlePrint}
              aria-label="In hoặc xuất PDF khổ A4"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-xs"
              title="In ra giấy hoặc lưu thành tệp PDF chuẩn A4 (Ctrl + P)"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In / Lưu PDF</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-teal-400" /> : <Moon className="h-3.5 w-3.5 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex gap-10">
        
        {/* Left Sticky Table of Contents (Hidden on print & mobile) */}
        <aside className="hidden lg:block w-56 flex-shrink-0 print:hidden">
          <div className="sticky top-24 space-y-4">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Mục lục hồ sơ
            </div>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{sec.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Print Tip */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"><Sparkles className="h-3 w-3 text-teal-500" /> Mẹo in ấn:</span> Nhấn phím <kbd className="font-mono bg-white dark:bg-white/10 px-1 py-0.5 rounded border border-slate-300 dark:border-white/20">Ctrl + P</kbd> để tải bản PDF chuẩn mực ATS.
            </div>
          </div>
        </aside>

        {/* Right Clean Paper Sheet (Swiss Document Layout) */}
        <main className="flex-1 max-w-4xl bg-white dark:bg-[#0c121c] border border-slate-200 dark:border-white/[0.08] shadow-sm rounded-2xl p-8 sm:p-14 print:p-0 print:border-none print:shadow-none print:bg-transparent space-y-12 transition-colors">
          
          {/* SECTION 1: IDENTITY & OVERVIEW */}
          <section id="overview" data-slide-key="hero" className="space-y-6 pb-8 border-b border-slate-200/80 dark:border-white/[0.08] break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3 flex-1 min-w-0">
                {companyName && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20">
                    ỨNG TUYỂN DÀNH RIÊNG CHO: {companyName.toUpperCase()}
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {fullName}
                </h1>
                <p className="text-base sm:text-lg font-medium text-teal-700 dark:text-teal-400">
                  {tagline}
                </p>
                {portfolio.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl pt-1">
                    {portfolio.bio}
                  </p>
                )}
              </div>

              {/* Monogram / Avatar with Swiss geometry */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border-2 border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-100 text-2xl font-black shadow-sm overflow-hidden flex-shrink-0">
                {portfolio.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portfolio.avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <span>{fullName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>

            {/* Quick Metadata & Contact Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400 pt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{portfolio.statusText || 'Sẵn sàng nhận cơ hội mới'}</span>
              </div>
              {emailAddress && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${emailAddress}`} className="hover:text-teal-600 dark:hover:text-teal-400 underline">
                    {emailAddress}
                  </a>
                </div>
              )}
              {portfolio.resumeUrl && (
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <a href={portfolio.resumeUrl} target="_blank" rel="noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 underline">
                    Hồ sơ CV đính kèm
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 2: WORK EXPERIENCE */}
          {portfolio.showExperience && portfolio.experiences && portfolio.experiences.length > 0 && (
            <section id="experience" data-slide-key="experience" className="space-y-6 pb-8 border-b border-slate-200/80 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  02. Quá trình công tác & Kinh nghiệm thực thi
                </h2>
              </div>

              <div className="space-y-8">
                {portfolio.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-2.5 break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {exp.roleTitle}
                        </h3>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
                          @ {exp.companyName}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {exp.periodText || 'Hiện tại'} {exp.location ? `· ${exp.location}` : ''}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-1">
                        {exp.highlights.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.skillsUsed.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: SELECTED PROJECTS */}
          {portfolio.showProjects && portfolio.projects && portfolio.projects.length > 0 && (
            <section id="projects" data-slide-key="projects" className="space-y-6 pb-8 border-b border-slate-200/80 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  03. Dự án tiêu biểu & Hệ thống sản phẩm
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-3 flex flex-col justify-between break-inside-avoid"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span>{proj.role || 'Case Study'}</span>
                        <span>{proj.periodText || ''}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {proj.title}
                      </h3>
                      {proj.subtitle && (
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                          {proj.subtitle}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {proj.description || 'Giải pháp phần mềm tối ưu trải nghiệm và hiệu năng hệ thống.'}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1 text-xs print:hidden">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            <span>Trực tiếp</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            <span>Mã nguồn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: CORE COMPETENCIES / SKILLS */}
          {portfolio.showSkills && portfolio.skills && portfolio.skills.length > 0 && (
            <section id="skills" data-slide-key="skills" className="space-y-6 pb-8 border-b border-slate-200/80 dark:border-white/[0.08] break-inside-avoid">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  04. Ma trận năng lực & Công nghệ
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from(new Set(portfolio.skills.map((s) => s.category))).map((cat) => {
                  const skillsInCat = portfolio.skills.filter((s) => s.category === cat);
                  return (
                    <div
                      key={cat}
                      className="p-4 rounded-xl bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-2"
                    >
                      <div className="text-[11px] font-mono font-bold uppercase text-teal-700 dark:text-teal-400">
                        {cat}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsInCat.map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-1 rounded text-xs font-medium bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION 5: EDUCATION & CERTIFICATIONS */}
          {portfolio.showEducation && portfolio.educations && portfolio.educations.length > 0 && (
            <section id="education" data-slide-key="education" className="space-y-6 pb-8 border-b border-slate-200/80 dark:border-white/[0.08] break-inside-avoid">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  05. Học vấn & Nền tảng đào tạo
                </h2>
              </div>

              <div className="space-y-4">
                {portfolio.educations.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {edu.institution}
                      </h3>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {edu.periodText || ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {edu.degree ? `${edu.degree} · ` : ''}{edu.fieldOfStudy || ''}
                    </p>
                    {edu.highlights && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-0.5">
                        {edu.highlights}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 6: CONTACT & VERIFICATION */}
          <section id="contact" data-slide-key="contact" className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                06. Kênh kết nối & Trao đổi trực tiếp
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              {emailAddress && (
                <button
                  type="button"
                  onClick={() => handleCopyEmail(emailAddress)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{emailAddress}</span>
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-500 ml-1" /> : <Copy className="h-3.5 w-3.5 text-slate-400 ml-1" />}
                </button>
              )}

              {portfolio.socialLinks?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 transition-colors"
                >
                  {link.platform.toLowerCase().includes('github') && <GithubIcon className="h-3.5 w-3.5" />}
                  {link.platform.toLowerCase().includes('linkedin') && <LinkedinIcon className="h-3.5 w-3.5 text-blue-500" />}
                  <span>{link.label || link.platform}</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400" />
                </a>
              ))}
            </div>

            {/* Document Signature Footnote */}
            <div className="pt-8 border-t border-slate-100 dark:border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span>SoodFolio Verified Dossier · Confidential Application</span>
              <span>Được tạo tự động từ nền tảng SoodFolio</span>
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}

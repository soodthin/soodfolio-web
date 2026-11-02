'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { StudioSlideKey, STUDIO_SLIDES, StageZoom, StageViewportMode } from './types';
import {
  ExternalLink,
  Globe,
  Sparkles,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Sliders,
  CheckCircle2,
  FileText,
  Mail,
  ChevronRight,
  Share2,
  Terminal,
  Activity,
  HardDrive,
  BookOpen,
  Award,
  Zap,
  GitCommit,
} from 'lucide-react';
import { getThemePreset } from '@/lib/themePresets';

interface PresentationStageProps {
  portfolio: PortfolioData | null;
  activeSlide: StudioSlideKey;
  zoom: StageZoom;
  stageTheme: 'dark' | 'light';
  viewportMode: StageViewportMode;
  isFullscreen: boolean;
  focusedField?: string | null;
  onFieldClick?: (fieldId: string) => void;
  variant?: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGES: 'Languages & Core',
  FRAMEWORKS: 'Frameworks & Libs',
  DATABASES: 'Databases & Storage',
  DEVOPS: 'DevOps & Cloud',
  AI_ENGINEERING: 'AI & Data Eng',
  TOOLS: 'Workflows & Tools',
};

// Helper to format clean social link display (no "GitHub: GitHub")
function formatSocialLink(platform: string, url: string, label?: string | null) {
  let cleanDomain = url;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    cleanDomain = parsed.hostname.replace(/^www\./, '') + parsed.pathname;
    if (cleanDomain.endsWith('/')) cleanDomain = cleanDomain.slice(0, -1);
  } catch {
    cleanDomain = url;
  }

  // If label is distinct from platform and url, use label
  if (label && label.toLowerCase() !== platform.toLowerCase()) {
    return { display: label, url: url.startsWith('http') ? url : `https://${url}` };
  }

  return { display: cleanDomain, url: url.startsWith('http') ? url : `https://${url}` };
}

export const PresentationStage: React.FC<PresentationStageProps> = ({
  portfolio,
  activeSlide,
  zoom,
  stageTheme,
  viewportMode,
  isFullscreen,
  focusedField,
  onFieldClick,
  variant,
}) => {
  if (!portfolio) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-400 font-mono text-xs">
        Đang nạp sân khấu trình chiếu...
      </div>
    );
  }

  const activePresetKey = variant || portfolio?.themeConfig || 'classic-deck';
  const activePreset = getThemePreset(activePresetKey);
  const isSpotlight = activePresetKey === 'spotlight-focus';
  const isTerminal = activePresetKey === 'terminal-matrix';
  const isEditorial = activePresetKey === 'editorial-clean';

  const currentSlideMeta = STUDIO_SLIDES.find((s) => s.key === activeSlide) || STUDIO_SLIDES[0];

  // Container width based on viewport mode
  const getViewportDimensions = () => {
    if (viewportMode === 'mobile') {
      return 'w-[375px] max-w-full aspect-[9/16] min-h-[580px]';
    }
    if (viewportMode === 'tablet') {
      return 'w-[768px] max-w-full aspect-[4/3] min-h-[500px]';
    }
    // 16:9 standard desktop
    return 'w-full max-w-[1080px] aspect-[16/9] min-h-[480px]';
  };

  // Zoom scale style
  const getZoomStyle = () => {
    if (zoom === '75%') return { transform: 'scale(0.75)', transformOrigin: 'top center' };
    if (zoom === '125%') return { transform: 'scale(1.25)', transformOrigin: 'top center' };
    return {};
  };

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden select-none">
      {/* Scrollable Stage Viewport Area (transparent so blueprint dot-grid workspace shows through) */}
      <div
        className={`flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start transition-colors custom-scrollbar min-h-0 ${
          stageTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        }`}
        style={stageTheme === 'dark' ? { backgroundColor: activePreset.bgHex } : undefined}
      >
        {/* 16:9 Stage Canvas Frame with Click-to-Edit cues */}
        <div
          data-theme-preset={activePresetKey}
          style={{
            ...getZoomStyle(),
            fontFamily: activePreset.fontVar,
            ...(stageTheme === 'dark' ? { backgroundColor: activePreset.surfaceHex } : {}),
            ['--accent-primary' as any]: activePreset.accentHex,
            ['--accent-muted' as any]: activePreset.accentMutedHex,
            ['--bg-canvas' as any]: activePreset.bgHex,
            ['--surface-card' as any]: activePreset.surfaceHex,
          }}
          className={`${getViewportDimensions()} rounded-2xl shadow-2xl transition-all duration-200 border flex flex-col overflow-hidden relative flex-shrink-0 ${
            stageTheme === 'dark'
              ? 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-slate-100'
              : 'bg-[#fbfaf7] border-[#d6d0c2] shadow-2xl shadow-stone-900/12 text-[#202124]'
          }`}
        >
          {/* Slide Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between">
            {/* SLIDE 01: COVER & HERO */}
            {activeSlide === 'cover' && (
              <div className="flex-1 flex flex-col justify-center space-y-5 max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                {isTerminal && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-1.5 rounded bg-black/60 border border-emerald-500/20 font-mono text-[10px] text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-emerald-400" />
                        [SYS_STAT] TTY: /dev/pts/0 · SOOD_OS v4.19
                      </span>
                      <span className="text-emerald-500/70 font-mono">UPTIME: 99.98%</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-950/20 font-mono text-[11px] text-emerald-400 w-fit">
                      <span>&gt; sys.env: production · profile: {portfolio.username}</span>
                    </div>
                  </div>
                )}
                {isEditorial && (
                  <div className="border-b border-amber-500/30 pb-2 mb-1 flex items-center justify-between text-[10px] font-mono tracking-widest text-amber-500/90 uppercase">
                    <span>The Monograph · Issue № 04 / 2026</span>
                    <span>Plate 01 · Studio Monograph</span>
                  </div>
                )}
                <div className={`flex flex-col ${isSpotlight ? 'items-center text-center' : 'sm:flex-row items-start sm:items-center'} gap-5`}>
                  {/* Click-to-Edit Avatar */}
                  <div
                    onClick={() => onFieldClick?.('avatarUrl')}
                    style={{
                      borderColor: focusedField === 'avatarUrl' ? activePreset.accentHex : `${activePreset.accentHex}66`,
                      backgroundColor: activePreset.accentMutedHex,
                      color: activePreset.accentHex,
                    }}
                    className={`h-20 w-20 sm:h-24 sm:w-24 ${isTerminal ? 'rounded-none border-dashed' : 'rounded-2xl'} border-2 overflow-hidden flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg cursor-pointer transition-all ${
                      isSpotlight ? 'ring-4 ring-indigo-500/30 shadow-[0_0_30px_rgba(129,140,248,0.25)]' : ''
                    } ${
                      focusedField === 'avatarUrl'
                        ? 'ring-4 scale-105'
                        : 'hover:scale-102'
                    }`}
                    title="Bấm để chỉnh sửa ảnh đại diện"
                  >
                    {portfolio.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={portfolio.avatarUrl} alt={portfolio.fullName || 'User'} className="h-full w-full object-cover" />
                    ) : (
                      <span>{(portfolio.fullName || 'User').slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className={`space-y-1.5 flex-1 min-w-0 ${isSpotlight ? 'text-center' : ''}`}>
                    {/* Click-to-Edit Status Pill */}
                    <div
                      onClick={() => onFieldClick?.('statusText')}
                      style={{
                        borderColor: focusedField === 'statusText' ? activePreset.accentHex : `${activePreset.accentHex}40`,
                        backgroundColor: activePreset.accentMutedHex,
                        color: activePreset.accentHex,
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 ${isTerminal ? 'rounded-none font-mono text-[11px]' : 'rounded-full font-sans text-xs'} font-medium border cursor-pointer transition-all ${
                        focusedField === 'statusText'
                          ? 'ring-2'
                          : 'hover:opacity-90'
                      }`}
                      title="Bấm để chỉnh sửa trạng thái"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: activePreset.accentHex }}
                      />
                      <span>{(portfolio.statusText || 'Sẵn sàng hợp tác · tư vấn').replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·')}</span>
                    </div>

                    {/* Click-to-Edit Full Name */}
                    <h1
                      onClick={() => onFieldClick?.('fullName')}
                      style={focusedField === 'fullName' ? { color: activePreset.accentHex, backgroundColor: activePreset.accentMutedHex } : undefined}
                      className={`text-2xl sm:text-4xl font-extrabold tracking-tight cursor-pointer rounded-lg transition-all ${
                        stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'
                      } ${
                        isEditorial ? 'font-serif' : ''
                      } ${
                        focusedField === 'fullName'
                          ? 'ring-2 px-2 -mx-2'
                          : 'hover:opacity-90'
                      }`}
                      title="Bấm để sửa họ và tên"
                    >
                      {portfolio.fullName || 'Chuyên gia Sáng tạo'}
                    </h1>

                    {/* Click-to-Edit Tagline */}
                    <p
                      onClick={() => onFieldClick?.('tagline')}
                      style={{ color: activePreset.accentHex }}
                      className={`text-sm sm:text-base font-semibold cursor-pointer rounded-lg transition-all ${
                        focusedField === 'tagline'
                          ? 'ring-2 px-2 -mx-2'
                          : 'hover:underline'
                      }`}
                      title="Bấm để sửa định vị chuyên môn"
                    >
                      {portfolio.tagline || portfolio.title || 'Full-Stack Engineer & Product Builder'}
                    </p>
                  </div>
                </div>

                {/* Click-to-Edit Bio Statement */}
                <p
                  onClick={() => onFieldClick?.('bio')}
                  className={`text-xs sm:text-sm ${stageTheme === 'dark' ? 'text-slate-300' : 'text-stone-700'} leading-relaxed font-sans max-w-2xl cursor-pointer rounded-lg transition-all ${
                    isSpotlight ? 'text-center mx-auto' : ''
                  } ${
                    focusedField === 'bio'
                      ? 'ring-2 p-2 -m-2'
                      : 'hover:bg-white/[0.04] p-1 -m-1'
                  }`}
                  title="Bấm để sửa đoạn bio giới thiệu"
                >
                  {portfolio.bio ||
                    'Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng.'}
                </p>

                {/* Spotlight Keynote Badges */}
                {isSpotlight && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Keynote Spotlight · WWDC Edition
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-white/[0.04] border border-white/10 text-slate-300">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      Full-Stack Architecture
                    </span>
                  </div>
                )}

                {/* Validated & Formatted Social Links */}
                {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
                  <div className={`flex flex-wrap items-center gap-2 pt-1 ${isSpotlight ? 'justify-center' : ''}`}>
                    {portfolio.socialLinks.map((link, idx) => {
                      const { display, url } = formatSocialLink(link.platform, link.url, link.label);
                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-2.5 py-1 text-xs ${
                            isTerminal
                              ? 'rounded-none font-mono bg-black/60 border border-emerald-500/20 text-emerald-300 hover:border-emerald-500/50'
                              : 'rounded-md font-sans bg-[#ede8dd] hover:bg-[#e2dcd0] dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-300'
                          } flex items-center gap-1.5 transition-colors group`}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: activePreset.accentHex }}
                          >
                            {link.platform}
                          </span>
                          <span className="text-stone-400">·</span>
                          <span className="truncate max-w-[140px] text-stone-800 dark:text-slate-200">
                            {display}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 text-stone-400 group-hover:opacity-80" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 02: SELECTED PROJECTS */}
            {activeSlide === 'projects' && (
              <div className="flex-1 flex flex-col justify-center space-y-4 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-slate-200/80 dark:border-white/10 pb-2 flex items-center justify-between">
                  <div>
                    <span
                      className="text-xs font-sans font-semibold"
                      style={{ color: activePreset.accentHex }}
                    >
                      {isTerminal ? '> projects --selected' : isEditorial ? 'CURATED WORKS · Projects' : 'Dự án chọn lọc'}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-bold ${stageTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dự án &amp; Kiến trúc Tiêu biểu</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {portfolio.projects.length} Case Studies
                  </span>
                </div>

                {portfolio.projects.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('projects')}
                    className="py-8 px-4 text-center rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer space-y-1"
                  >
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Chưa có case study dự án được chọn
                    </p>
                    <span className="text-[11px] font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Bấm để thêm dự án từ Inspector bên phải →
                    </span>
                  </div>
                ) : (
                  <div className={`grid ${isSpotlight ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-3.5 pt-1`}>
                    {portfolio.projects.slice(0, 4).map((proj, idx) => (
                      <div
                        key={proj.id}
                        onClick={() => onFieldClick?.('projects')}
                        className={`p-4 border space-y-2 cursor-pointer transition-all hover:shadow-md ${
                          isTerminal
                            ? 'bg-black/50 border-white/10 font-mono hover:border-emerald-500/40 rounded-none'
                            : isSpotlight
                            ? 'bg-gradient-to-b from-indigo-950/20 to-black/40 border-indigo-500/20 hover:border-indigo-500/40 rounded-xl'
                            : isEditorial
                            ? 'bg-amber-950/[0.04] border-amber-500/20 hover:border-amber-500/40 rounded-none'
                            : 'bg-[#f4f1ea] dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.07] hover:border-stone-400 dark:hover:border-white/20 rounded-xl'
                        }`}
                        title="Bấm để chỉnh sửa dự án này trong Inspector"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono text-xs font-bold"
                            style={{ color: activePreset.accentHex }}
                          >
                            {isTerminal ? `> proj_0${idx + 1}` : `PROJ_0${idx + 1}`}
                          </span>
                          {proj.role && (
                            <span className="text-xs font-sans text-stone-600 dark:text-slate-400 font-medium">
                              {proj.role}
                            </span>
                          )}
                        </div>

                        <h3 className={`font-bold text-sm sm:text-base leading-tight ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'} ${isEditorial ? 'font-serif' : ''}`}>{proj.title}</h3>
                        {proj.subtitle && (
                          <p
                            className="text-xs font-medium"
                            style={{ color: activePreset.accentHex }}
                          >
                            {proj.subtitle}
                          </p>
                        )}

                        {proj.description && (
                          <p className="text-xs text-stone-700 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>
                        )}

                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.techStack.slice(0, 4).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className={`px-1.5 py-0.5 text-xs ${
                                  isTerminal
                                    ? 'rounded-none font-mono bg-emerald-950/30 border border-emerald-500/20 text-emerald-300'
                                    : 'rounded font-sans bg-[#ede8dd] dark:bg-white/[0.05] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-300 shadow-xs'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Terminal diff & commit markers */}
                        {isTerminal && (
                          <div className="pt-2 border-t border-emerald-500/15 text-[10px] text-emerald-400/80 font-mono flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <GitCommit className="w-3 h-3 text-emerald-400" />
                              ├── 2 files changed, 480 insertions(+)
                            </span>
                            <span className="text-emerald-500/60 font-mono">commit 0x9f{idx + 1}a</span>
                          </div>
                        )}

                        {/* Editorial Plate labels */}
                        {isEditorial && (
                          <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-500/80 uppercase tracking-widest flex items-center justify-between">
                            <span>Fig. {idx + 1}.0 · Architectural Monograph</span>
                            <span>Plate 0{idx + 1}</span>
                          </div>
                        )}

                        {/* Spotlight Stage Showcase indicator */}
                        {isSpotlight && (
                          <div className="pt-2 border-t border-indigo-500/20 text-[10px] font-sans text-indigo-300 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-400" />
                              Stage Showcase 0{idx + 1} · Keynote Highlight
                            </span>
                            <span className="font-mono text-indigo-400/80 text-[10px]">WWDC-STD</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 03: CAREER & EXPERIENCE */}
            {activeSlide === 'experience' && (
              <div className="flex-1 flex flex-col justify-center space-y-4 max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-slate-200/80 dark:border-white/10 pb-2 flex items-center justify-between">
                  <div>
                    <span
                      className="text-xs font-sans font-semibold"
                      style={{ color: activePreset.accentHex }}
                    >
                      {isTerminal ? '> timeline --history' : isEditorial ? 'CHRONOLOGY · Career' : 'Dòng thời gian sự nghiệp'}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-bold ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'}`}>Lịch sử &amp; Cột mốc Sự nghiệp</h2>
                  </div>
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
                    {portfolio.experiences.length} Vị trí
                  </span>
                </div>

                {portfolio.experiences.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('experience')}
                    className="py-8 px-4 text-center rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer space-y-1"
                  >
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Chưa có mốc sự nghiệp nào được ghi nhận
                    </p>
                    <span className="text-[11px] font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Bấm để thêm kinh nghiệm từ Inspector bên phải →
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {portfolio.experiences.slice(0, 3).map((exp, idx) => (
                      <div
                        key={exp.id}
                        onClick={() => onFieldClick?.('experience')}
                        className={`p-3.5 border flex items-start justify-between gap-4 cursor-pointer transition-all ${
                          isTerminal
                            ? 'bg-black/50 border-emerald-500/20 font-mono hover:border-emerald-500/40 rounded-none'
                            : isSpotlight
                            ? 'bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40 rounded-xl'
                            : isEditorial
                            ? 'bg-amber-950/[0.04] border-amber-500/20 hover:border-amber-500/40 rounded-none'
                            : 'bg-[#f4f1ea] dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.07] hover:border-stone-400 dark:hover:border-white/20 rounded-xl'
                        }`}
                        title="Bấm để chỉnh sửa kinh nghiệm này"
                      >
                        <div className="space-y-1 min-w-0">
                          {isTerminal && (
                            <div className="text-[10px] text-emerald-500/70 font-mono">
                              [EXEC_TRACE 2025-2026] LOAD_MODULE · [AUDIT_PASS: 0x00_OK]
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full flex-shrink-0 ${
                                isSpotlight ? 'h-2.5 w-2.5 ring-4 ring-indigo-500/30' : 'h-1.5 w-1.5'
                              }`}
                              style={{ backgroundColor: activePreset.accentHex }}
                            />
                            <h3 className={`font-bold text-sm ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'} truncate ${isEditorial ? 'font-serif' : ''}`}>
                              {exp.roleTitle}
                            </h3>
                            {isSpotlight && (
                              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                Keynote Act 02
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: activePreset.accentHex }}
                          >
                            {exp.companyName} {isEditorial ? '— Practicing Architect' : ''}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-stone-700 dark:text-slate-400 line-clamp-2">
                              {exp.description}
                            </p>
                          )}
                        </div>

                        {exp.periodText && (
                          <span className={`text-xs ${
                            isTerminal ? 'font-mono text-emerald-400/80 bg-emerald-950/30 border-emerald-500/20' : 'font-sans text-stone-800 bg-[#ede8dd] dark:bg-white/[0.05] border-[#d6d0c2] dark:border-white/10'
                          } px-2 py-0.5 rounded border flex-shrink-0`}>
                            {exp.periodText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 04: SKILLS & COMPETENCY MATRIX */}
            {activeSlide === 'skills' && (
              <div className="flex-1 flex flex-col justify-center space-y-4 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-slate-200/80 dark:border-white/10 pb-2 flex items-center justify-between">
                  <div>
                    <span
                      className="text-xs font-sans font-semibold"
                      style={{ color: activePreset.accentHex }}
                    >
                      {isTerminal ? '> competency --matrix' : isEditorial ? 'COMPENDIUM · Core Skills' : 'Ma trận năng lực'}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-bold ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'}`}>Năng lực Cốt lõi &amp; Công nghệ</h2>
                  </div>
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
                    {portfolio.skills.length} Kỹ năng
                  </span>
                </div>

                {portfolio.skills.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('skills')}
                    className="py-8 px-4 text-center rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer space-y-1"
                  >
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Chưa có kỹ năng nào trong ma trận
                    </p>
                    <span className="text-[11px] font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Bấm để thêm kỹ năng từ Inspector bên phải →
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel], cIdx) => {
                      const skills = portfolio.skills.filter((s) => s.category === catKey);
                      if (skills.length === 0) return null;

                      return (
                        <div
                          key={catKey}
                          onClick={() => onFieldClick?.('skills')}
                          className={`p-3 border space-y-2 cursor-pointer transition-all ${
                            isTerminal
                              ? 'bg-black/50 border-emerald-500/20 font-mono hover:border-emerald-500/40 rounded-none'
                              : isSpotlight
                              ? 'bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40 rounded-xl'
                              : isEditorial
                              ? 'bg-amber-950/[0.04] border-amber-500/20 hover:border-amber-500/40 rounded-none'
                              : 'bg-[#f4f1ea] dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.07] hover:border-stone-400 dark:hover:border-white/20 rounded-xl'
                          }`}
                        >
                          {isTerminal && (
                            <div className="flex items-center justify-between text-[10px] text-emerald-500/70 font-mono pb-0.5 border-b border-emerald-500/15">
                              <span>[SYS_RES: {catKey}]</span>
                              <span>[████████░░]</span>
                            </div>
                          )}

                          {isEditorial && (
                            <div className="flex items-center justify-between text-[10px] font-mono text-amber-500/80 uppercase pb-0.5 border-b border-amber-500/20">
                              <span>Section 0{cIdx + 1}</span>
                              <span>p. 0{cIdx + 1}2</span>
                            </div>
                          )}

                          <div
                            className={`text-xs font-semibold ${isTerminal ? 'font-mono text-emerald-400' : isEditorial ? 'font-serif text-amber-400' : 'font-sans'}`}
                            style={!isTerminal && !isEditorial ? { color: activePreset.accentHex } : undefined}
                          >
                            {isTerminal ? `>_ ${catLabel}` : catLabel}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill) => (
                              <span
                                key={skill.id}
                                className={`px-1.5 py-0.5 text-xs ${
                                  isTerminal
                                    ? 'font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 rounded-none'
                                    : isSpotlight
                                    ? 'font-sans bg-indigo-500/10 border border-indigo-500/25 text-indigo-200 rounded'
                                    : isEditorial
                                    ? 'font-mono text-stone-300 bg-amber-950/20 border border-amber-500/20 rounded-none'
                                    : 'font-sans bg-[#ede8dd] dark:bg-white/[0.06] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-200 rounded shadow-xs'
                                }`}
                              >
                                {isTerminal ? `> ${skill.name}` : skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 05: CONTACT & CONNECT (KEYNOTE STAGE) */}
            {(activeSlide === 'contact' || activeSlide === 'settings') && (
              <div className="flex-1 flex flex-col justify-center space-y-5 max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                {/* Slide 05 Header */}
                <div className="border-b border-slate-200/80 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs ${
                        isTerminal
                          ? 'font-mono text-emerald-400'
                          : isEditorial
                          ? 'font-mono text-amber-500 uppercase tracking-widest'
                          : 'font-sans font-semibold'
                      }`}
                      style={!isTerminal && !isEditorial ? { color: activePreset.accentHex } : undefined}
                    >
                      {isTerminal
                        ? '> sysctl --load /etc/soodfolio/config.conf'
                        : isEditorial
                        ? 'COLOPHON · 05 Communication & Reach'
                        : isSpotlight
                        ? 'Spotlight · 05 Connect & Network'
                        : '05 · Liên hệ & Hợp tác'}
                    </span>
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'} ${isEditorial ? 'font-serif' : ''}`}>
                    {isTerminal
                      ? 'Establish Direct Channel'
                      : isEditorial
                      ? 'Correspondence & Professional Network'
                      : 'Liên hệ & Mạng lưới Kết nối'}
                  </h2>
                </div>

                {/* Status & Work Availability Callout Card */}
                <div
                  onClick={() => onFieldClick?.('statusText')}
                  className={`p-4 border transition-all cursor-pointer ${
                    isTerminal
                      ? 'rounded-none bg-black/60 border-emerald-500/20 font-mono hover:border-emerald-500/40'
                      : isSpotlight
                      ? 'rounded-xl bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40'
                      : isEditorial
                      ? 'rounded-none bg-amber-950/[0.04] border-amber-500/20 hover:border-amber-500/40'
                      : 'rounded-xl bg-[#f4f1ea] dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.06] hover:border-stone-400'
                  } ${focusedField === 'statusText' ? 'ring-2 ring-teal-500' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Trạng thái hợp tác (Work Signal)
                      </span>
                      <p className={`text-sm sm:text-base font-bold ${stageTheme === 'dark' ? 'text-white' : 'text-[#202124]'}`}>
                        {(portfolio.statusText || 'Available for collaboration').replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {portfolio.resumeUrl && (
                        <a
                          href={portfolio.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isTerminal
                              ? 'rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono hover:bg-emerald-500/20'
                              : 'rounded-lg bg-[#ede8dd] hover:bg-[#e2dcd0] dark:bg-white/[0.05] dark:hover:bg-white/10 text-stone-800 dark:text-slate-200 border border-[#d6d0c2] dark:border-white/10 shadow-xs'
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Xem CV</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links & Reach Channels Matrix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span>HỒ SƠ MẠNG XÃ HỘI &amp; KÊNH TRUYỀN THÔNG</span>
                    <span
                      onClick={() => onFieldClick?.('contact')}
                      className="cursor-pointer hover:underline text-teal-700 dark:text-teal-400 font-semibold"
                    >
                      Sửa kênh liên hệ
                    </span>
                  </div>

                  {portfolio.socialLinks && portfolio.socialLinks.length > 0 ? (
                    <div
                      onClick={() => onFieldClick?.('contact')}
                      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 cursor-pointer ${
                        focusedField === 'contact' ? 'ring-2 ring-teal-500 rounded-xl p-1' : ''
                      }`}
                    >
                      {portfolio.socialLinks.map((link, idx) => {
                        const { display, url } = formatSocialLink(link.platform, link.url, link.label);
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 border transition-all hover:shadow-xs group flex items-center justify-between gap-2 ${
                              isTerminal
                                ? 'rounded-none bg-black/40 border-emerald-500/20 font-mono hover:border-emerald-500/40'
                                : isSpotlight
                                ? 'rounded-xl bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40'
                                : isEditorial
                                ? 'rounded-none bg-amber-950/[0.03] border-amber-500/20 hover:border-amber-500/40'
                                : 'rounded-xl bg-[#f4f1ea] dark:bg-white/[0.02] border-[#d6d0c2] dark:border-white/[0.06] hover:border-stone-400'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block truncate">
                                {link.platform}
                              </span>
                              <span className="text-xs font-bold text-stone-900 dark:text-white truncate block group-hover:text-teal-600 transition-colors">
                                {display}
                              </span>
                            </div>
                            <span
                              className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                              style={{ color: activePreset.accentHex }}
                            >
                              ↗
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      onClick={() => onFieldClick?.('contact')}
                      className="py-8 px-4 text-center rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer space-y-1"
                    >
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Chưa thiết lập kênh liên lạc hoặc mạng xã hội
                      </p>
                      <span className="text-[11px] font-sans font-semibold text-teal-600 dark:text-teal-400">
                        Bấm để cấu hình Email, GitHub, LinkedIn từ Inspector bên phải →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

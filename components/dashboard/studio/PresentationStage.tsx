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
  MousePointerClick,
  Share2,
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
      {/* Scrollable Stage Viewport Area */}
      <div
        className={`flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start transition-colors custom-scrollbar min-h-0 ${
          stageTheme === 'dark'
            ? 'bg-[#080d12] text-slate-100'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        {/* 16:9 Stage Canvas Frame with Click-to-Edit cues */}
        <div
          data-theme-preset={activePresetKey}
          style={{
            ...getZoomStyle(),
            fontFamily: activePreset.fontVar,
            ...(stageTheme === 'dark' ? { backgroundColor: activePreset.surfaceHex } : {}),
          }}
          className={`${getViewportDimensions()} rounded-2xl shadow-2xl transition-all duration-200 border flex flex-col overflow-hidden relative flex-shrink-0 ${
            stageTheme === 'dark'
              ? 'bg-[#0c131a] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
              : 'bg-white border-slate-200/90 shadow-xl'
          }`}
        >
          {/* Stage Internal Micro Header */}
          <div
            className={`h-9 px-4 border-b flex items-center justify-between text-[11px] font-mono flex-shrink-0 ${
              stageTheme === 'dark'
                ? 'border-white/[0.06] bg-black/30 text-slate-400'
                : 'border-slate-100 bg-slate-50/70 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                Slide {currentSlideMeta.number} • {currentSlideMeta.title}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-sans">
              <span className="hidden sm:inline text-slate-500">
                Bấm vào văn bản để sửa trực tiếp
              </span>
              <span className="text-teal-500 font-semibold">{portfolio.username}.soodfolio.com</span>
            </div>
          </div>

          {/* Slide Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between">
            {/* SLIDE 01: COVER & HERO */}
            {activeSlide === 'cover' && (
              <div className="flex-1 flex flex-col justify-center space-y-6 max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                <div className={`flex flex-col ${isSpotlight ? 'items-center text-center' : 'sm:flex-row items-start sm:items-center'} gap-5`}>
                  {/* Click-to-Edit Avatar */}
                  <div
                    onClick={() => onFieldClick?.('avatarUrl')}
                    className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-teal-500/10 border-2 overflow-hidden flex items-center justify-center font-bold text-teal-500 text-2xl flex-shrink-0 shadow-lg cursor-pointer transition-all ${
                      focusedField === 'avatarUrl'
                        ? 'border-teal-400 ring-4 ring-teal-400/20 scale-105'
                        : 'border-teal-500/40 hover:border-teal-400 hover:scale-102'
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
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 cursor-pointer transition-all ${
                        focusedField === 'statusText'
                          ? 'ring-2 ring-teal-400 bg-teal-500/20'
                          : 'hover:border-teal-400'
                      }`}
                      title="Bấm để chỉnh sửa trạng thái"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                      <span>{portfolio.statusText || 'Sẵn sàng hợp tác & tư vấn'}</span>
                    </div>

                    {/* Click-to-Edit Full Name */}
                    <h1
                      onClick={() => onFieldClick?.('fullName')}
                      className={`text-2xl sm:text-4xl font-extrabold tracking-tight cursor-pointer rounded-lg transition-all ${
                        focusedField === 'fullName'
                          ? 'text-teal-400 ring-2 ring-teal-400/50 bg-teal-500/10 px-2 -mx-2'
                          : 'hover:text-teal-400'
                      }`}
                      title="Bấm để sửa họ và tên"
                    >
                      {portfolio.fullName || 'Chuyên gia Sáng tạo'}
                    </h1>

                    {/* Click-to-Edit Tagline */}
                    <p
                      onClick={() => onFieldClick?.('tagline')}
                      className={`text-sm sm:text-base font-semibold text-teal-600 dark:text-teal-400 cursor-pointer rounded-lg transition-all ${
                        focusedField === 'tagline'
                          ? 'ring-2 ring-teal-400/50 bg-teal-500/10 px-2 -mx-2'
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
                  className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl cursor-pointer rounded-lg transition-all ${
                    isSpotlight ? 'text-center mx-auto' : ''
                  } ${
                    focusedField === 'bio'
                      ? 'ring-2 ring-teal-400/50 bg-teal-500/10 p-2 -m-2'
                      : 'hover:bg-teal-500/5 p-1 -m-1'
                  }`}
                  title="Bấm để sửa đoạn bio giới thiệu"
                >
                  {portfolio.bio ||
                    'Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng.'}
                </p>

                {/* Validated & Formatted Social Links (Zero duplicate platform labels!) */}
                {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {portfolio.socialLinks.map((link, idx) => {
                      const { display, url } = formatSocialLink(link.platform, link.url, link.label);
                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-md text-xs font-sans bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors group"
                        >
                          <span className="font-semibold text-teal-600 dark:text-teal-400">
                            {link.platform}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="truncate max-w-[140px] text-slate-800 dark:text-slate-200">
                            {display}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 text-slate-400 group-hover:text-teal-500" />
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
                    <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Dự án chọn lọc
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold">Dự án & Kiến trúc Tiêu biểu</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {portfolio.projects.length} Case Studies
                  </span>
                </div>

                {portfolio.projects.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('projects')}
                    className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-white/10 rounded-xl cursor-pointer hover:border-teal-500 transition-colors"
                  >
                    Chưa có dự án nào. Bấm vào đây để thêm dự án mới ngay.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {portfolio.projects.slice(0, 4).map((proj, idx) => (
                      <div
                        key={proj.id}
                        onClick={() => onFieldClick?.('projects')}
                        className="p-4 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.07] space-y-2 hover:border-teal-500/50 cursor-pointer transition-all hover:shadow-md"
                        title="Bấm để chỉnh sửa dự án này trong Inspector"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                            PROJ_0{idx + 1}
                          </span>
                          {proj.role && (
                            <span className="text-xs font-sans text-slate-400">
                              {proj.role}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm sm:text-base leading-tight">{proj.title}</h3>
                        {proj.subtitle && (
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{proj.subtitle}</p>
                        )}

                        {proj.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>
                        )}

                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.techStack.slice(0, 4).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-1.5 py-0.5 rounded text-xs font-sans bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
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
                    <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Dòng thời gian sự nghiệp
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold">Lịch sử & Cột mốc Sự nghiệp</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {portfolio.experiences.length} Vị trí
                  </span>
                </div>

                {portfolio.experiences.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('experience')}
                    className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-white/10 rounded-xl cursor-pointer hover:border-teal-500 transition-colors"
                  >
                    Chưa có kinh nghiệm nào. Bấm vào đây để thêm mốc sự nghiệp đầu tiên.
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {portfolio.experiences.slice(0, 3).map((exp, idx) => (
                      <div
                        key={exp.id}
                        onClick={() => onFieldClick?.('experience')}
                        className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.07] hover:border-teal-500/50 cursor-pointer transition-all flex items-start justify-between gap-4"
                        title="Bấm để chỉnh sửa kinh nghiệm này"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {exp.roleTitle}
                            </h3>
                          </div>
                          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                            {exp.companyName}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {exp.description}
                            </p>
                          )}
                        </div>

                        {exp.periodText && (
                          <span className="text-xs font-sans px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 flex-shrink-0">
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
                    <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                      Ma trận năng lực
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold">Năng lực Cốt lõi & Công nghệ</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {portfolio.skills.length} Kỹ năng
                  </span>
                </div>

                {portfolio.skills.length === 0 ? (
                  <div
                    onClick={() => onFieldClick?.('skills')}
                    className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-white/10 rounded-xl cursor-pointer hover:border-teal-500 transition-colors"
                  >
                    Chưa có kỹ năng nào. Bấm vào đây để thêm kỹ năng vào ma trận.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                      const skills = portfolio.skills.filter((s) => s.category === catKey);
                      if (skills.length === 0) return null;

                      return (
                        <div
                          key={catKey}
                          onClick={() => onFieldClick?.('skills')}
                          className={`p-3 rounded-xl border space-y-1.5 cursor-pointer transition-all ${
                            isTerminal
                              ? 'bg-black/50 border-emerald-500/20 font-mono hover:border-emerald-500/40'
                              : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.07] hover:border-teal-500/50'
                          }`}
                        >
                          <div className={`text-xs font-semibold ${isTerminal ? 'font-mono text-emerald-400' : 'font-sans text-teal-600 dark:text-teal-400'}`}>
                            {isTerminal ? `>_ ${catLabel}` : catLabel}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill) => (
                              <span
                                key={skill.id}
                                className={`px-1.5 py-0.5 rounded text-xs ${
                                  isTerminal
                                    ? 'font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20'
                                    : 'font-sans bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'
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

            {/* SLIDE 05: PRESENTATION SETTINGS & PUBLIC LINK */}
            {activeSlide === 'settings' && (
              <div className="flex-1 flex flex-col justify-center space-y-4 max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-slate-200/80 dark:border-white/10 pb-2">
                  <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                    Cấu hình trình chiếu
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">Cấu hình Slide & Trình chiếu</h2>
                </div>

                <div className="space-y-2.5">
                  {/* Active Theme Preset Indicator */}
                  <div className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">Template Giao diện Đang chọn</div>
                      <div className="text-xs text-slate-400">{activePreset.tagline}</div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-sans font-semibold border flex items-center gap-1.5"
                      style={{
                        borderColor: `${activePreset.accentHex}40`,
                        backgroundColor: activePreset.accentMutedHex,
                        color: activePreset.accentHex,
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activePreset.accentHex }}
                      />
                      {activePreset.name}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">Trạng thái phát hành Live</div>
                      <div className="text-xs text-slate-400">Cho phép công chúng truy cập xem slide deck</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-sans font-semibold ${portfolio.isPublished ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600'}`}>
                      {portfolio.isPublished ? 'Đang live' : 'Bản nháp'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">Hiển thị Slide Dự án</div>
                      <div className="text-xs text-slate-400">Trình diễn các case studies tiêu biểu</div>
                    </div>
                    <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                      {portfolio.showProjects ? 'Bật' : 'Ẩn'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">Hiển thị Slide Kinh nghiệm</div>
                      <div className="text-xs text-slate-400">Dòng thời gian sự nghiệp</div>
                    </div>
                    <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                      {portfolio.showExperience ? 'Bật' : 'Ẩn'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stage Bottom Footer */}
          <div
            className={`h-8 px-4 border-t flex items-center justify-between text-xs font-sans flex-shrink-0 ${
              stageTheme === 'dark'
                ? 'border-white/[0.06] bg-black/40 text-slate-500'
                : 'border-slate-100 bg-slate-50/80 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 text-teal-500">
              <MousePointerClick className="h-3 w-3" />
              <span>Bấm vào văn bản để sửa trực tiếp</span>
            </div>
            <span className="text-slate-400 font-medium">Khung trình chiếu 16:9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

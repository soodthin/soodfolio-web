'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Sliders, Eye, EyeOff, Palette, Globe, ShieldCheck, Moon, Sun, Check, Sparkles, Loader2 } from 'lucide-react';
import { THEME_PRESETS, ThemePresetKey } from '@/lib/themePresets';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';

const mapTemplateToPreset = (rawId?: string): ThemePresetKey => {
  if (!rawId) return 'classic-deck';
  const clean = rawId.toLowerCase().trim();
  if (clean.includes('spotlight')) return 'spotlight-focus';
  if (clean.includes('terminal')) return 'terminal-matrix';
  if (clean.includes('editorial')) return 'editorial-clean';
  return 'classic-deck';
};

interface SettingsInspectorProps {
  portfolio: PortfolioData | null;
  onToggleSection: (
    field: 'showExperience' | 'showProjects' | 'showSkills' | 'showEducation' | 'showContact'
  ) => Promise<void>;
  onUpdateField: (field: keyof PortfolioData, value: any) => void;
  onSaveProfile: (updated: Partial<PortfolioData>) => Promise<void>;
  isSaving: boolean;
}

export const SettingsInspector: React.FC<SettingsInspectorProps> = ({
  portfolio,
  onToggleSection,
  onUpdateField,
  onSaveProfile,
  isSaving,
}) => {
  if (!portfolio) return null;

  const [aiRecommendation, setAiRecommendation] = useState<{
    presetId: ThemePresetKey;
    reason: string;
  } | null>(null);
  const [isLoadingAiTheme, setIsLoadingAiTheme] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchAiSuggestion() {
      if (!portfolio) return;
      setIsLoadingAiTheme(true);

      try {
        const payload = {
          title: portfolio.title || '',
          bio: portfolio.bio || '',
          skills: (portfolio.skills || []).map((s) => s.name),
        };

        const res = await fetchWithAuth(`${API_BASE}/ai/suggest-theme`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // Graceful fallback: keep existing cards functioning normally
          return;
        }

        const data = await res.json();
        if (!isCancelled && data?.recommendedTemplateId) {
          setAiRecommendation({
            presetId: mapTemplateToPreset(data.recommendedTemplateId),
            reason: data.reason || 'Phong cách tối ưu nhất cho cấu trúc năng lực và định vị nghề nghiệp của bạn.',
          });
        }
      } catch {
        // Graceful fallback: keep existing cards functioning normally
      } finally {
        if (!isCancelled) {
          setIsLoadingAiTheme(false);
        }
      }
    }

    fetchAiSuggestion();

    return () => {
      isCancelled = true;
    };
  }, [portfolio?.id]);

  const sections = [
    {
      field: 'showProjects' as const,
      label: 'Slide 02 · Dự án Tiêu biểu (Selected Projects)',
      desc: 'Trình chiếu các Case study kỹ thuật, demo tương tác và liên kết GitHub.',
    },
    {
      field: 'showExperience' as const,
      label: 'Slide 03 · Kinh nghiệm Làm việc (Professional Timeline)',
      desc: 'Cột mốc sự nghiệp, chức danh và các thành tựu định lượng chuẩn Google X-Y-Z.',
    },
    {
      field: 'showSkills' as const,
      label: 'Slide 04 · Ma trận Kỹ năng (Competency Matrix)',
      desc: 'Bản đồ năng lực phân loại theo 6 cụm chuyên môn công nghệ.',
    },
    {
      field: 'showContact' as const,
      label: 'Slide 05 · Liên hệ & Đặt lịch (Contact & Connect)',
      desc: 'Nút gửi email trực tiếp, liên kết mạng xã hội và kênh đối thoại nhanh.',
    },
  ];

  return (
    <div className="w-full space-y-4 font-sans text-xs select-none">
      {/* Compact Section Header */}
      <div className="pb-3 border-b border-slate-300 dark:border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Slide 05 · Settings & Themes
          </span>
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Cài đặt & Tuỳ biến Deck
          </div>
        </div>

        {isLoadingAiTheme && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-500/10 text-[10px] font-mono text-teal-400 border border-teal-500/20">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI Đang đề xuất...</span>
          </div>
        )}
      </div>

      {/* Main Single Column Stack */}
      <div className="space-y-4">
        {/* Theme Presets */}
        <div className="rounded-xl bg-[#fbfaf7] dark:bg-[#0c131a] border border-[#d6d0c2] dark:border-white/[0.07] p-3.5 shadow-xs space-y-3">
          <div>
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">
              Bộ chọn Template Trình chiếu
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
              4 phong cách thẩm mỹ và bố cục chuẩn mực:
            </p>
          </div>

          <div className="space-y-2">
            {(Object.values(THEME_PRESETS) as Array<typeof THEME_PRESETS[ThemePresetKey]>).map((preset) => {
              const isSelected = (portfolio.themeConfig || 'classic-deck') === preset.id;
              const isAiRecommended = aiRecommendation?.presetId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={async () => {
                    onUpdateField('themeConfig', preset.id);
                    await onSaveProfile({ themeConfig: preset.id });
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer relative font-sans flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/50 shadow-xs ring-1 ring-teal-500/30'
                      : isAiRecommended
                      ? 'bg-teal-500/[0.03] border-teal-500/40 hover:border-teal-500/60 ring-1 ring-teal-500/20'
                      : 'bg-[#ede8dd]/60 dark:bg-white/[0.03] border-[#d6d0c2] dark:border-white/10 hover:border-stone-400 dark:hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {/* Visual Palette Preview Dots */}
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-xs flex items-center justify-center shrink-0"
                          style={{ backgroundColor: preset.bgHex }}
                          title={`Canvas: ${preset.bgHex}`}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: preset.accentHex }}
                          />
                        </span>
                        {/* Font Tag */}
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-300">
                          {preset.fontName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isAiRecommended && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>AI Đề xuất</span>
                          </span>
                        )}
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-teal-400 stroke-[2.5]" />
                        )}
                      </div>
                    </div>

                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {preset.name}
                    </div>
                    <div
                      className="text-[10px] font-medium"
                      style={{ color: preset.accentHex }}
                    >
                      {preset.tagline}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                      {preset.layoutDescription}
                    </div>

                    {isAiRecommended && (
                      <div className="mt-2 pt-1.5 border-t border-teal-500/20 text-[10px] text-teal-300 font-medium flex items-start gap-1 leading-snug">
                        <Sparkles className="h-3 w-3 text-teal-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{aiRecommendation.reason}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Contrast Mode Selector */}
          <div className="pt-2 border-t border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between gap-2">
            <span className="text-xs text-stone-700 dark:text-slate-400 font-medium">Chế độ tương phản</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={async () => {
                  onUpdateField('themeMode', 'DARK');
                  await onSaveProfile({ themeMode: 'DARK' });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  portfolio.themeMode === 'DARK' || !portfolio.themeMode
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Moon className="h-3 w-3" />
                <span>Tối</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  onUpdateField('themeMode', 'LIGHT');
                  await onSaveProfile({ themeMode: 'LIGHT' });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  portfolio.themeMode === 'LIGHT'
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Sun className="h-3 w-3" />
                <span>Sáng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slide Visibility Switches */}
        <div className="rounded-xl bg-[#fbfaf7] dark:bg-[#0c131a] border border-[#d6d0c2] dark:border-white/[0.07] p-3.5 shadow-xs space-y-3">
          <div>
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">
              Hiển thị các Slide Thành phần
            </h3>
            <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">
              Bật hoặc tắt từng slide trong bài trình chiếu.
            </p>
          </div>

          <div className="divide-y divide-[#d6d0c2] dark:divide-white/[0.05]">
            {sections.map(({ field, label, desc }) => {
              const isVisible = portfolio[field] ?? true;

              return (
                <div
                  key={field}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                      {label}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {desc}
                    </p>
                  </div>

                  {/* iOS/macOS-style Smooth Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isVisible}
                    onClick={() => onToggleSection(field)}
                    aria-label={`Bật tắt hiển thị ${label}`}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVisible
                        ? 'bg-teal-600 dark:bg-teal-500'
                        : 'bg-slate-200 dark:bg-white/15'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isVisible ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Public Link Card */}
        <div className="rounded-xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] p-3.5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Tên miền Trình chiếu Trực tuyến
            </h3>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-teal-700 dark:text-teal-400 font-semibold truncate">
              soodfolio.com/{portfolio.username}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Live
            </span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            Slide deck cập nhật theo thời gian thực mỗi khi lưu thông tin trong Studio.
          </p>
        </div>
      </div>
    </div>
  );
};

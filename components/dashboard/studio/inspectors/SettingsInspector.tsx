'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Sliders, Eye, EyeOff, Palette, Globe, ShieldCheck, Moon, Sun, Check, Sparkles } from 'lucide-react';
import { THEME_PRESETS, ThemePresetKey } from '@/lib/themePresets';

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
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
            <span>Slide 05</span>
            <span>·</span>
            <span>Studio Configuration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Cấu hình Trình chiếu & Tuỳ biến Deck
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kiểm soát khả năng hiển thị các slide thành phần, giao diện thẩm mỹ và liên kết công khai.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Slide Visibility Switches */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hiển thị các Slide Thành phần
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bật hoặc tắt từng slide trong bài thuyết trình trình chiếu của bạn.
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {sections.map(({ field, label, desc }) => {
                const isVisible = portfolio[field] ?? true;

                return (
                  <div
                    key={field}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                        {label}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
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
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                        isVisible
                          ? 'bg-teal-600 dark:bg-teal-500'
                          : 'bg-slate-200 dark:bg-white/15'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Theme Aesthetic & Public Domain */}
        <div className="lg:col-span-5 space-y-4">
          {/* Theme Presets */}
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] p-6 shadow-xs space-y-3.5">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Bộ chọn Template Trình chiếu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chọn 1 trong 4 phong cách thẩm mỹ và bố cục chuẩn mực cho slide deck của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(Object.values(THEME_PRESETS) as Array<typeof THEME_PRESETS[ThemePresetKey]>).map((preset) => {
                const isSelected = (portfolio.themeConfig || 'classic-deck') === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={async () => {
                      onUpdateField('themeConfig', preset.id);
                      await onSaveProfile({ themeConfig: preset.id });
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative font-sans flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500/50 shadow-xs ring-1 ring-teal-500/30'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          {/* Visual Palette Preview Dots */}
                          <span
                            className="h-4 w-4 rounded-full border border-white/20 shadow-xs flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: preset.bgHex }}
                            title={`Canvas: ${preset.bgHex}`}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: preset.accentHex }}
                            />
                          </span>
                          {/* Font Tag */}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                            {preset.fontName}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
                        )}
                      </div>

                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {preset.name}
                      </div>
                      <div
                        className="text-[10px] font-medium mt-0.5"
                        style={{ color: preset.accentHex }}
                      >
                        {preset.tagline}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {preset.layoutDescription}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contrast Mode Selector */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Chế độ tương phản</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={async () => {
                    onUpdateField('themeMode', 'DARK');
                    await onSaveProfile({ themeMode: 'DARK' });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    portfolio.themeMode === 'DARK' || !portfolio.themeMode
                      ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
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
                      ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Sáng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Public Link Card */}
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] p-6 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Tên miền Trình chiếu Trực tuyến
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-sans font-medium text-teal-700 dark:text-teal-400 truncate">
                soodfolio.com/{portfolio.username}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-sans font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                Live URL
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Slide deck sẽ luôn cập nhật theo thời gian thực mỗi khi bạn lưu thông tin trong Studio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

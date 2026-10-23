'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Sliders, Eye, EyeOff, Palette, Globe, ShieldCheck } from 'lucide-react';

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
    { field: 'showProjects' as const, label: 'Slide Dự án Tiêu biểu (Projects)', desc: 'Trình chiếu các Case study kỹ thuật và demo tương tác' },
    { field: 'showExperience' as const, label: 'Slide Kinh nghiệm Làm việc (Experience)', desc: 'Timeline các mốc sự nghiệp và thành tựu Google X-Y-Z' },
    { field: 'showSkills' as const, label: 'Slide Ma trận Kỹ năng (Tech Stack)', desc: 'Bản đồ năng lực phân loại theo 6 nhóm công nghệ' },
    { field: 'showContact' as const, label: 'Slide Liên hệ & Đặt lịch (Contact)', desc: 'Nút gửi email trực tiếp và form kết nối nhanh' },
  ];

  return (
    <div className="space-y-5 text-xs">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
          SLIDE 05 // CONFIG & VISIBILITY
        </span>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
          Cấu hình Trình chiếu & Tuỳ biến Deck
        </h2>
      </div>

      {/* Section Visibility Switches */}
      <div className="space-y-2">
        <label className="block font-semibold text-slate-700 dark:text-slate-300">
          Hiển thị các Slide thành phần
        </label>

        <div className="space-y-2">
          {sections.map(({ field, label, desc }) => {
            const isVisible = portfolio[field] ?? true;

            return (
              <div
                key={field}
                className="p-3 rounded-xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSection(field)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                    isVisible
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/30'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-400 border border-transparent'
                  }`}
                >
                  {isVisible ? (
                    <>
                      <Eye className="h-3 w-3 text-teal-500" />
                      <span>ON</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 text-slate-400" />
                      <span>OFF</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Presets */}
      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
        <label className="block font-semibold text-slate-700 dark:text-slate-300">
          Phong cách Thẩm mỹ Trình chiếu Mặc định (Theme Mode)
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={async () => {
              onUpdateField('themeMode', 'DARK');
              await onSaveProfile({ themeMode: 'DARK' });
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              portfolio.themeMode === 'DARK' || !portfolio.themeMode
                ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'bg-white dark:bg-[#0c131a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="font-bold text-xs">CYBER DARK</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Onyx slate & Ruza teal glow</div>
          </button>

          <button
            type="button"
            onClick={async () => {
              onUpdateField('themeMode', 'LIGHT');
              await onSaveProfile({ themeMode: 'LIGHT' });
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              portfolio.themeMode === 'LIGHT'
                ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'bg-white dark:bg-[#0c131a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="font-bold text-xs">EDITORIAL LIGHT</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Quiet luxury & Minimalist paper</div>
          </button>
        </div>
      </div>

      {/* Domain & Hosting Preview */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
          <Globe className="h-3.5 w-3.5 text-teal-500" />
          <span>Tên miền công khai</span>
        </div>
        <div className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
          https://soodfolio.com/{portfolio.username}
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Tên miền tùy biến (Pro Domain) sắp ra mắt ở Phase 4 theo lộ trình SaaS.
        </p>
      </div>
    </div>
  );
};

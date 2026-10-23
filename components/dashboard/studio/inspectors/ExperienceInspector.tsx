'use client';

import React, { useState } from 'react';
import { ExperienceDto } from '@/types/portfolio';
import {
  Briefcase,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Building2,
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';

interface ExperienceInspectorProps {
  experiences: ExperienceDto[];
  onAddExperience: (exp: Omit<ExperienceDto, 'id'>) => Promise<void>;
  onUpdateExperience: (id: string, updated: Partial<ExperienceDto>) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
  onMoveExperience: (index: number, direction: 'up' | 'down') => Promise<void>;
  isSaving: boolean;
}

export const ExperienceInspector: React.FC<ExperienceInspectorProps> = ({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onMoveExperience,
  isSaving,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New experience draft state
  const [draftRole, setDraftRole] = useState('');
  const [draftCompany, setDraftCompany] = useState('');
  const [draftPeriod, setDraftPeriod] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftHighlights, setDraftHighlights] = useState('');
  const [draftSkills, setDraftSkills] = useState('');

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftRole.trim() || !draftCompany.trim()) return;

    const highlightsArray = draftHighlights
      .split('\n')
      .map((h) => h.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    const skillsArray = draftSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await onAddExperience({
      roleTitle: draftRole.trim(),
      companyName: draftCompany.trim(),
      periodText: draftPeriod.trim() || undefined,
      location: draftLocation.trim() || undefined,
      description: draftDescription.trim() || undefined,
      highlights: highlightsArray,
      skillsUsed: skillsArray,
    });

    // Reset form
    setDraftRole('');
    setDraftCompany('');
    setDraftPeriod('');
    setDraftLocation('');
    setDraftDescription('');
    setDraftHighlights('');
    setDraftSkills('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
            SLIDE 03 // PROFESSIONAL EXPERIENCE
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            Kinh nghiệm Kỹ thuật & Chức danh ({experiences.length})
          </h2>
        </div>

        {!isAddingNew && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(true);
              setExpandedId(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm shadow-teal-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm Kinh Nghiệm</span>
          </button>
        )}
      </div>

      {/* Inline Form: Add New Experience */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateNew}
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-teal-500/40 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-white/10">
            <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
              // THÊM KINH NGHIỆM MỚI
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chức danh / Vai trò <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={draftRole}
                onChange={(e) => setDraftRole(e.target.value)}
                placeholder="VD: Staff Software Engineer"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Công ty / Tổ chức <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={draftCompany}
                onChange={(e) => setDraftCompany(e.target.value)}
                placeholder="VD: Shopee / Sea Group"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Thời gian làm việc</label>
              <input
                type="text"
                value={draftPeriod}
                onChange={(e) => setDraftPeriod(e.target.value)}
                placeholder="VD: 2022 - Hiện tại (2 năm)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Địa điểm / Hình thức</label>
              <input
                type="text"
                value={draftLocation}
                onChange={(e) => setDraftLocation(e.target.value)}
                placeholder="VD: TP. Hồ Chí Minh / Hybrid"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Thành tựu định lượng (Mỗi gạch đầu dòng 1 dòng, chuẩn Google X-Y-Z)
            </label>
            <textarea
              rows={3}
              value={draftHighlights}
              onChange={(e) => setDraftHighlights(e.target.value)}
              placeholder="• Tối ưu hóa API response time giảm 45% bằng Redis caching
• Dẫn dắt đội ngũ 6 kỹ sư di chuyển 12 microservices lên Kubernetes"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Kỹ năng & Công nghệ áp dụng (ngăn cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={draftSkills}
              onChange={(e) => setDraftSkills(e.target.value)}
              placeholder="Java, Spring Cloud, Kafka, Docker, Kubernetes"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold cursor-pointer shadow-sm disabled:opacity-60"
            >
              {isSaving ? 'Đang tạo...' : 'Tạo Kinh Nghiệm'}
            </button>
          </div>
        </form>
      )}

      {/* Experience List with Accordion Edit */}
      {experiences.length === 0 && !isAddingNew ? (
        <div className="py-8 text-center space-y-2 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
          <Briefcase className="h-7 w-7 text-slate-400 mx-auto" />
          <p className="text-slate-500 text-xs">Chưa có kinh nghiệm nào trong slide deck.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {experiences.map((exp, idx) => {
            const isExpanded = expandedId === exp.id;

            return (
              <div
                key={exp.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-50 dark:bg-[#111a24] border-teal-500/40 shadow-md'
                    : 'bg-white dark:bg-[#0c131a] border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                {/* Header Row */}
                <div className="p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                      0{idx + 1}.
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="text-left font-semibold text-slate-900 dark:text-white truncate hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer flex-1"
                    >
                      {exp.roleTitle}
                    </button>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono truncate max-w-[120px]">
                      @ {exp.companyName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveExperience(idx, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Chuyển lên trước"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === experiences.length - 1}
                      onClick={() => onMoveExperience(idx, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Chuyển xuống sau"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer ml-1"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Inline Editor */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-white/[0.06] space-y-2.5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Chức danh
                        </label>
                        <input
                          type="text"
                          value={exp.roleTitle}
                          onChange={(e) => onUpdateExperience(exp.id, { roleTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Tổ chức / Công ty
                        </label>
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => onUpdateExperience(exp.id, { companyName: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Thời gian</label>
                        <input
                          type="text"
                          value={exp.periodText || ''}
                          onChange={(e) => onUpdateExperience(exp.id, { periodText: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Địa điểm</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => onUpdateExperience(exp.id, { location: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                        Thành tựu định lượng (1 gạch đầu dòng mỗi dòng)
                      </label>
                      <textarea
                        rows={3}
                        value={(exp.highlights || []).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          onUpdateExperience(exp.id, { highlights: lines });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                        Kỹ năng áp dụng (ngăn cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={(exp.skillsUsed || []).join(', ')}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          onUpdateExperience(exp.id, { skillsUsed: arr });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xoá vị trí "${exp.roleTitle} @ ${exp.companyName}"?`)) {
                            onDeleteExperience(exp.id);
                          }
                        }}
                        className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 text-xs font-medium cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xoá vị trí này</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="px-2.5 py-1 rounded bg-slate-200 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 font-medium text-[11px] cursor-pointer"
                      >
                        Hoàn tất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

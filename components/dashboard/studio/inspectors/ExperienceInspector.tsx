'use client';

import React, { useState, useEffect } from 'react';
import { ExperienceDto } from '@/types/portfolio';
import {
  Briefcase,
  Plus,
  Trash2,
  Building2,
  Calendar,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Edit3,
  X,
  Sparkles,
  Layers,
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
  // Modal editor state (dùng chung cho cả tạo mới và chỉnh sửa)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  // Form draft fields
  const [draftRole, setDraftRole] = useState('');
  const [draftCompany, setDraftCompany] = useState('');
  const [draftPeriod, setDraftPeriod] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftHighlights, setDraftHighlights] = useState('');
  const [draftSkills, setDraftSkills] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditorOpen(false);
    };
    if (editorOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editorOpen]);

  // Open modal for new experience
  const handleOpenCreateModal = () => {
    setEditingExperienceId(null);
    setDraftRole('');
    setDraftCompany('');
    setDraftPeriod('');
    setDraftLocation('');
    setDraftDescription('');
    setDraftHighlights('');
    setDraftSkills('');
    setEditorOpen(true);
  };

  // Open modal for editing existing experience
  const handleOpenEditModal = (exp: ExperienceDto) => {
    setEditingExperienceId(exp.id);
    setDraftRole(exp.roleTitle || '');
    setDraftCompany(exp.companyName || '');
    setDraftPeriod(exp.periodText || '');
    setDraftLocation(exp.location || '');
    setDraftDescription(exp.description || '');
    setDraftHighlights((exp.highlights || []).join('\n'));
    setDraftSkills((exp.skillsUsed || []).join(', '));
    setEditorOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
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

    const payload = {
      roleTitle: draftRole.trim(),
      companyName: draftCompany.trim(),
      periodText: draftPeriod.trim() || undefined,
      location: draftLocation.trim() || undefined,
      description: draftDescription.trim() || undefined,
      highlights: highlightsArray,
      skillsUsed: skillsArray,
    };

    if (editingExperienceId) {
      await onUpdateExperience(editingExperienceId, payload);
    } else {
      await onAddExperience(payload);
    }

    setEditorOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
            <span>Slide 03</span>
            <span>·</span>
            <span>Professional Timeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Kinh nghiệm Kỹ thuật & Sự nghiệp
            <span className="ml-2.5 text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 tabular-nums">
              {experiences.length} vị trí
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hồ sơ năng lực thực chiến, các cột mốc thăng tiến và dấu ấn kỹ thuật quan trọng.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs transition-all cursor-pointer shadow-sm shadow-teal-600/30"
            aria-label="Thêm vị trí kinh nghiệm mới"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Kinh Nghiệm</span>
          </button>
        </div>
      </div>

      {/* Experience Timeline Grid */}
      {experiences.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.01]">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Chưa có kinh nghiệm nào</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Bắt đầu ghi lại các cột mốc nghề nghiệp, công ty đã làm việc và các thành tựu kỹ thuật định lượng.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-sans font-semibold cursor-pointer shadow-sm shadow-teal-600/30"
            >
              + Thêm Kinh Nghiệm Mới
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, idx) => {
            return (
              <div
                key={exp.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] hover:border-teal-500/40 dark:hover:border-teal-400/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-200 overflow-hidden"
              >
                {/* Card Top: Number Index, Role, Company */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="tabular-nums font-sans font-extrabold text-xs px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                      0{idx + 1}
                    </span>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveExperience(idx, 'up')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Chuyển lên trước"
                        aria-label={`Chuyển vị trí ${exp.roleTitle} lên trước`}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === experiences.length - 1}
                        onClick={() => onMoveExperience(idx, 'down')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Chuyển xuống sau"
                        aria-label={`Chuyển vị trí ${exp.roleTitle} xuống sau`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {exp.roleTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-teal-600 dark:text-teal-400 mt-1">
                      <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">@ {exp.companyName}</span>
                    </div>
                  </div>

                  {/* Period & Location Badges */}
                  {(exp.periodText || exp.location) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-sans text-slate-500 dark:text-slate-400">
                      {exp.periodText && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] font-medium">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{exp.periodText}</span>
                        </span>
                      )}
                      {exp.location && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] font-medium">
                          <MapPin className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Highlights Bullet List */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                      {exp.highlights.slice(0, 3).map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500/70 mt-1.5 flex-shrink-0" />
                          <span className="line-clamp-2">{hl}</span>
                        </div>
                      ))}
                      {exp.highlights.length > 3 && (
                        <span className="text-[11px] font-sans text-teal-600 dark:text-teal-400 font-medium">
                          +{exp.highlights.length - 3} thành tựu khác
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skillsUsed.slice(0, 5).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]"
                        >
                          {skill}
                        </span>
                      ))}
                      {exp.skillsUsed.length > 5 && (
                        <span className="px-1.5 py-0.5 rounded-md text-xs font-sans font-semibold text-slate-400">
                          +{exp.skillsUsed.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Meta info & Action buttons */}
                <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-sans text-slate-400">
                    {exp.highlights?.length || 0} thành tựu định lượng
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(exp)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Chỉnh sửa vị trí"
                      aria-label={`Chỉnh sửa vị trí ${exp.roleTitle} tại ${exp.companyName}`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Xoá vị trí "${exp.roleTitle} @ ${exp.companyName}" khỏi slide deck?`)) {
                          onDeleteExperience(exp.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Xoá vị trí này"
                      aria-label={`Xoá vị trí ${exp.roleTitle} tại ${exp.companyName}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Create Empty Slot Card */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group min-h-[220px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-teal-500/50 dark:hover:border-teal-400/40 bg-white/40 dark:bg-white/[0.01] hover:bg-teal-500/[0.02] transition-all p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] group-hover:bg-teal-500/10 border border-slate-200 dark:border-white/10 group-hover:border-teal-500/30 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
              <Plus className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                + Thêm Kinh Nghiệm Mới
              </span>
              <p className="text-[11px] font-sans text-slate-400 mt-0.5">Mở rộng hồ sơ sự nghiệp của bạn</p>
            </div>
          </button>
        </div>
      )}

      {/* Modern Two-Column Experience Editor Modal */}
      {editorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-editor-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                  {editingExperienceId ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
                </span>
                <h3 id="experience-editor-title" className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {editingExperienceId ? `${draftRole} @ ${draftCompany}` : 'Khởi tạo Cột mốc Sự nghiệp'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Body - Two Column Layout */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column: Role & Organization */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Chức danh / Vai trò <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={draftRole}
                      onChange={(e) => setDraftRole(e.target.value)}
                      placeholder="VD: Senior Frontend Engineer"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Công ty / Tổ chức <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCompany}
                      onChange={(e) => setDraftCompany(e.target.value)}
                      placeholder="VD: VNG Corporation / Zalo"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Thời gian làm việc
                      </label>
                      <input
                        type="text"
                        value={draftPeriod}
                        onChange={(e) => setDraftPeriod(e.target.value)}
                        placeholder="VD: 2023 - Hiện tại"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Địa điểm / Hình thức
                      </label>
                      <input
                        type="text"
                        value={draftLocation}
                        onChange={(e) => setDraftLocation(e.target.value)}
                        placeholder="VD: TP. HCM / Hybrid"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tóm tắt trách nhiệm chính
                    </label>
                    <textarea
                      rows={3}
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                      placeholder="Phụ trách kiến trúc giao diện người dùng và tối ưu hiệu năng web..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Right Column: Achievements & Skills */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Thành tựu định lượng (1 gạch đầu dòng mỗi dòng, chuẩn Google X-Y-Z)
                    </label>
                    <textarea
                      rows={6}
                      value={draftHighlights}
                      onChange={(e) => setDraftHighlights(e.target.value)}
                      placeholder="Tối ưu hóa thời gian tải trang giảm 42% bằng Next.js App Router và code-splitting
Tái cấu trúc hệ thống thiết kế Figma sang React Tailwind Tokens phục vụ 80+ màn hình
Tăng tỷ lệ hoàn thành tác vụ của người dùng thêm 28% qua A/B Testing"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500 font-sans"
                    />
                    <p className="text-[11px] font-sans text-slate-400 mt-1">
                      Mỗi dòng sẽ tự động được hiển thị dưới dạng bullet point trực quan trên slide deck.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kỹ năng & Công nghệ áp dụng (ngăn cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={draftSkills}
                      onChange={(e) => setDraftSkills(e.target.value)}
                      placeholder="React, Next.js, TypeScript, Tailwind CSS, Turborepo"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-[11px] font-sans text-slate-400 mt-1">
                      Hiển thị dạng các chip kỹ năng nổi bật bên dưới cột mốc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-sans font-medium text-xs cursor-pointer transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs cursor-pointer shadow-sm shadow-teal-500/20 disabled:opacity-60 transition-all"
                >
                  {isSaving ? 'Đang lưu...' : editingExperienceId ? 'Lưu Thay Đổi' : 'Thêm Kinh Nghiệm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

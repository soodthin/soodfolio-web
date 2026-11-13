'use client';

import React, { useState, useEffect } from 'react';
import { ExperienceDto, EducationDto } from '@/types/portfolio';
import { fetchWithAuth } from '@/lib/apiClient';
import { API_BASE } from '@/lib/auth';
import {
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Edit3,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { AiPolishDialog } from '../AiPolishDialog';

interface ExperienceInspectorProps {
  experiences: ExperienceDto[];
  educations?: EducationDto[];
  onAddExperience: (exp: Omit<ExperienceDto, 'id'>) => Promise<void>;
  onUpdateExperience: (id: string, updated: Partial<ExperienceDto>) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
  onMoveExperience: (index: number, direction: 'up' | 'down') => Promise<void>;
  onUpdateEducations?: (educations: EducationDto[]) => void;
  isSaving: boolean;
}

export const ExperienceInspector: React.FC<ExperienceInspectorProps> = ({
  experiences,
  educations = [],
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onMoveExperience,
  onUpdateEducations,
  isSaving,
}) => {
  // 2 Sub-Tabs state: Kinh nghiệm vs Học vấn
  const [activeSubTab, setActiveSubTab] = useState<'experience' | 'education'>('experience');

  // Experience Modal editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [aiPolishOpen, setAiPolishOpen] = useState(false);

  // Form draft fields for Experience
  const [draftRole, setDraftRole] = useState('');
  const [draftCompany, setDraftCompany] = useState('');
  const [draftPeriod, setDraftPeriod] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftHighlights, setDraftHighlights] = useState('');
  const [draftSkills, setDraftSkills] = useState('');

  // Education state & CRUD
  const [eduList, setEduList] = useState<EducationDto[]>(educations);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [isEduSaving, setIsEduSaving] = useState(false);

  // Form draft fields for Education
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduFieldOfStudy, setEduFieldOfStudy] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduHighlights, setEduHighlights] = useState('');

  // Load educations on mount or when switching to education tab
  useEffect(() => {
    if (activeSubTab === 'education') {
      const loadEducations = async () => {
        try {
          const res = await fetchWithAuth(`${API_BASE}/portfolios/me/educations`);
          if (res && res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setEduList(data);
              onUpdateEducations?.(data);
            }
          }
        } catch {
          // silently handle network error, keep current state
        }
      };
      loadEducations();
    }
  }, [activeSubTab]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorOpen(false);
        setEduModalOpen(false);
      }
    };
    if (editorOpen || eduModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editorOpen, eduModalOpen]);

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

  // Open modal for new education
  const handleOpenCreateEduModal = () => {
    setEditingEduId(null);
    setEduInstitution('');
    setEduDegree('');
    setEduFieldOfStudy('');
    setEduPeriod('');
    setEduHighlights('');
    setEduModalOpen(true);
  };

  // Open modal for editing education
  const handleOpenEditEduModal = (edu: EducationDto) => {
    setEditingEduId(edu.id);
    setEduInstitution(edu.institution || '');
    setEduDegree(edu.degree || '');
    setEduFieldOfStudy(edu.fieldOfStudy || '');
    setEduPeriod(edu.periodText || '');
    setEduHighlights(edu.highlights || '');
    setEduModalOpen(true);
  };

  // Save education (POST or PUT)
  const handleSaveEduModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduInstitution.trim()) return;

    setIsEduSaving(true);
    try {
      const payload = {
        institution: eduInstitution.trim(),
        degree: eduDegree.trim() || undefined,
        fieldOfStudy: eduFieldOfStudy.trim() || undefined,
        periodText: eduPeriod.trim() || undefined,
        highlights: eduHighlights.trim() || undefined,
      };

      if (editingEduId) {
        const res = await fetchWithAuth(`${API_BASE}/portfolios/me/educations/${editingEduId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res && res.ok) {
          const updatedEdu: EducationDto = await res.json();
          const currentList = Array.isArray(eduList) ? eduList : [];
          const newList = currentList.map((item) => (item.id === editingEduId ? updatedEdu : item));
          setEduList(newList);
          onUpdateEducations?.(newList);
          setEduModalOpen(false);
        }
      } else {
        const res = await fetchWithAuth(`${API_BASE}/portfolios/me/educations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res && res.ok) {
          const createdEdu: EducationDto = await res.json();
          const currentList = Array.isArray(eduList) ? eduList : [];
          const newList = [...currentList, createdEdu];
          setEduList(newList);
          onUpdateEducations?.(newList);
          setEduModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save education:', err);
    } finally {
      setIsEduSaving(false);
    }
  };

  // Delete education (DELETE)
  const handleDeleteEdu = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/educations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) {
        const newList = eduList.filter((item) => item.id !== id);
        setEduList(newList);
        onUpdateEducations?.(newList);
      }
    } catch (err) {
      console.error('Failed to delete education:', err);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* 2 Sub-Tabs Switcher: Kinh nghiệm · Học vấn */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#ede8dd] dark:bg-white/[0.04] border border-[#d6d0c2] dark:border-white/[0.08]">
        <button
          type="button"
          onClick={() => setActiveSubTab('experience')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
            activeSubTab === 'experience'
              ? 'bg-[#fbfaf7] dark:bg-[#111a24] text-teal-800 dark:text-teal-400 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>Kinh nghiệm</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('education')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
            activeSubTab === 'education'
              ? 'bg-[#fbfaf7] dark:bg-[#111a24] text-teal-800 dark:text-teal-400 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Học vấn</span>
        </button>
      </div>

      {activeSubTab === 'experience' ? (
        /* ================= TAB 1: KINH NGHIỆM ================= */
        <div className="space-y-5">
          {/* Header */}
          <div className="pb-3 border-b border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
                Slide 03 · Impact Timeline
              </span>
              <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
                Kinh nghiệm Kỹ thuật ({experiences.length})
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
              aria-label="Thêm vị trí kinh nghiệm mới"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Thêm</span>
            </button>
          </div>

          {/* Experience List */}
          {experiences.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-3 rounded-xl border border-[#d6d0c2] dark:border-white/[0.06] bg-[#fbfaf7] dark:bg-white/[0.01]">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Briefcase className="h-4 w-4 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
                  Chưa có kinh nghiệm nào
                </div>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thêm các vai trò, công ty và dự án then chốt để thể hiện quá trình phát triển sự nghiệp của bạn.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Thêm kinh nghiệm đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="group relative p-3 rounded-xl border border-[#d6d0c2] dark:border-white/[0.06] bg-[#fbfaf7] dark:bg-white/[0.02] hover:border-teal-500/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-stone-900 dark:text-white truncate">
                          {exp.roleTitle}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 truncate">
                          @ {exp.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-slate-400 font-mono mt-0.5">
                        {exp.periodText && <span>{exp.periodText}</span>}
                        {exp.location && (
                          <>
                            <span>·</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => onMoveExperience(idx, 'up')}
                        disabled={idx === 0}
                        title="Di chuyển lên trên"
                        className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveExperience(idx, 'down')}
                        disabled={idx === experiences.length - 1}
                        title="Di chuyển xuống dưới"
                        className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowRight className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(exp)}
                        title="Chỉnh sửa kinh nghiệm"
                        className="p-1 rounded text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteExperience(exp.id)}
                        title="Xóa kinh nghiệm"
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-[11px] text-stone-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.skillsUsed.slice(0, 5).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-stone-100 dark:bg-white/[0.04] text-stone-700 dark:text-slate-300 border border-[#d6d0c2]/60 dark:border-white/[0.06]"
                        >
                          {sk}
                        </span>
                      ))}
                      {exp.skillsUsed.length > 5 && (
                        <span className="text-[9px] font-mono text-stone-400 self-center">
                          +{exp.skillsUsed.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB 2: HỌC VẤN ================= */
        <div className="space-y-5">
          {/* Header */}
          <div className="pb-3 border-b border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
                Slide 03 · Academic Foundation
              </span>
              <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
                Học vấn & Bằng cấp ({(Array.isArray(eduList) ? eduList : []).length})
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateEduModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
              aria-label="Thêm mốc học vấn mới"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Thêm</span>
            </button>
          </div>

          {/* Education List */}
          {(!Array.isArray(eduList) || eduList.length === 0) ? (
            <div className="py-8 px-4 text-center space-y-3 rounded-xl border border-[#d6d0c2] dark:border-white/[0.06] bg-[#fbfaf7] dark:bg-white/[0.01]">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <GraduationCap className="h-4 w-4 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
                  Chưa có thông tin học vấn
                </div>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thêm cơ sở đào tạo, bằng cấp và thành tích học thuật để tạo uy tín nền tảng cho hồ sơ của bạn.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateEduModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Thêm học vấn đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {eduList.map((edu) => (
                <div
                  key={edu.id}
                  className="group relative p-3 rounded-xl border border-[#d6d0c2] dark:border-white/[0.06] bg-[#fbfaf7] dark:bg-white/[0.02] hover:border-teal-500/40 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-stone-900 dark:text-white truncate">
                          {edu.institution}
                        </span>
                        {edu.degree && (
                          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 truncate">
                            · {edu.degree}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-slate-400 font-mono mt-0.5">
                        {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                        {edu.periodText && (
                          <>
                            <span>·</span>
                            <span>{edu.periodText}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditEduModal(edu)}
                        title="Chỉnh sửa học vấn"
                        className="p-1 rounded text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEdu(edu.id)}
                        title="Xóa học vấn"
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {edu.highlights && (
                    <p className="text-[11px] text-stone-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {edu.highlights}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT EXPERIENCE ================= */}
      {editorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingExperienceId ? 'Chỉnh sửa kinh nghiệm' : 'Thêm vị trí kinh nghiệm mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Chức danh / Vị trí <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={draftRole}
                    onChange={(e) => setDraftRole(e.target.value)}
                    placeholder="Senior Fullstack Engineer"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Công ty / Tổ chức <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={draftCompany}
                    onChange={(e) => setDraftCompany(e.target.value)}
                    placeholder="Shopee / VNG"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Thời gian
                  </label>
                  <input
                    type="text"
                    value={draftPeriod}
                    onChange={(e) => setDraftPeriod(e.target.value)}
                    placeholder="2022 - Hiện tại"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={draftLocation}
                    onChange={(e) => setDraftLocation(e.target.value)}
                    placeholder="TP. Hồ Chí Minh · Remote"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Mô tả vai trò & Trọng trách
                  </label>
                  <button
                    type="button"
                    onClick={() => setAiPolishOpen(true)}
                    className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-sans font-medium hover:underline cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>AI Polish</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt về trách nhiệm chính và quy mô hệ thống phụ trách..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                  Thành tựu nổi bật (mỗi dòng 1 gạch đầu dòng)
                </label>
                <textarea
                  rows={3}
                  value={draftHighlights}
                  onChange={(e) => setDraftHighlights(e.target.value)}
                  placeholder="Tối ưu latency API từ 350ms xuống 45ms&#10;Dẫn dắt migrate hạ tầng sang Kubernetes"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none leading-relaxed font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                  Kỹ năng & Công nghệ (phân tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={draftSkills}
                  onChange={(e) => setDraftSkills(e.target.value)}
                  placeholder="Java, Spring Boot, PostgreSQL, Docker, Redis"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {editingExperienceId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT EDUCATION ================= */}
      {eduModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setEduModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingEduId ? 'Chỉnh sửa học vấn' : 'Thêm thông tin học vấn mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEduModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEduModal} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                  Cơ sở đào tạo / Trường đại học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="Đại học Bách Khoa TP.HCM"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Bằng cấp / Học vị
                  </label>
                  <input
                    type="text"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="Cử nhân / Kỹ sư"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                    Chuyên ngành đào tạo
                  </label>
                  <input
                    type="text"
                    value={eduFieldOfStudy}
                    onChange={(e) => setEduFieldOfStudy(e.target.value)}
                    placeholder="Khoa học Máy tính"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                  Niên khóa / Thời gian
                </label>
                <input
                  type="text"
                  value={eduPeriod}
                  onChange={(e) => setEduPeriod(e.target.value)}
                  placeholder="2018 - 2022"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase text-slate-500 dark:text-slate-400">
                  Thành tích / Điểm nổi bật
                </label>
                <textarea
                  rows={3}
                  value={eduHighlights}
                  onChange={(e) => setEduHighlights(e.target.value)}
                  placeholder="Tốt nghiệp loại Giỏi · Học bổng Khuyến khích Học tập 4 kỳ liên tiếp..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isEduSaving}
                  className="px-4 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isEduSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>{editingEduId ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Polish Dialog for Experience Description */}
      <AiPolishDialog
        isOpen={aiPolishOpen}
        onClose={() => setAiPolishOpen(false)}
        rawText={draftDescription}
        field="exp_bullet"
        onApply={(polished: string) => setDraftDescription(polished)}
      />
    </div>
  );
};
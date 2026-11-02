'use client';

import React, { useState } from 'react';
import { ProjectDto } from '@/types/portfolio';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  ArrowLeft,
  ArrowRight,
  Edit3,
  X,
  Sparkles,
  Layers,
  Globe,
  Briefcase,
  Calendar,
  Check,
} from 'lucide-react';
import { GitHubImportModal } from './GitHubImportModal';
import { AiPolishDialog } from '../AiPolishDialog';

interface ProjectsInspectorProps {
  projects: ProjectDto[];
  onAddProject: (project: Omit<ProjectDto, 'id'>) => Promise<void>;
  onUpdateProject: (id: string, updated: Partial<ProjectDto>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onMoveProject: (index: number, direction: 'up' | 'down') => Promise<void>;
  isSaving: boolean;
  defaultGithubUsername?: string;
  onProjectImported?: (project: ProjectDto) => void;
}

export const ProjectsInspector: React.FC<ProjectsInspectorProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onMoveProject,
  isSaving,
  defaultGithubUsername,
  onProjectImported,
}) => {
  // Modal editor state (dùng chung cho cả tạo mới và chỉnh sửa)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [aiPolishOpen, setAiPolishOpen] = useState(false);

  // Form draft fields
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [draftPeriod, setDraftPeriod] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftTechStack, setDraftTechStack] = useState('');
  const [draftLiveUrl, setDraftLiveUrl] = useState('');
  const [draftGithubUrl, setDraftGithubUrl] = useState('');
  const [draftImageUrl, setDraftImageUrl] = useState('');

  // Mở modal tạo dự án mới
  const handleOpenCreateModal = () => {
    setEditingProjectId(null);
    setDraftTitle('');
    setDraftSubtitle('');
    setDraftRole('');
    setDraftPeriod('');
    setDraftDescription('');
    setDraftTechStack('');
    setDraftLiveUrl('');
    setDraftGithubUrl('');
    setDraftImageUrl('');
    setEditorOpen(true);
  };

  // Mở modal chỉnh sửa dự án đã có
  const handleOpenEditModal = (proj: ProjectDto) => {
    setEditingProjectId(proj.id);
    setDraftTitle(proj.title || '');
    setDraftSubtitle(proj.subtitle || '');
    setDraftRole(proj.role || '');
    setDraftPeriod(proj.periodText || '');
    setDraftDescription(proj.description || '');
    setDraftTechStack((proj.techStack || []).join(', '));
    setDraftLiveUrl(proj.liveUrl || '');
    setDraftGithubUrl(proj.githubUrl || '');
    setDraftImageUrl(proj.imageUrl || '');
    setEditorOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    const techArray = draftTechStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: draftTitle.trim(),
      subtitle: draftSubtitle.trim() || undefined,
      role: draftRole.trim() || undefined,
      periodText: draftPeriod.trim() || undefined,
      description: draftDescription.trim() || undefined,
      techStack: techArray,
      liveUrl: draftLiveUrl.trim() || undefined,
      githubUrl: draftGithubUrl.trim() || undefined,
      imageUrl: draftImageUrl.trim() || undefined,
    };

    if (editingProjectId) {
      await onUpdateProject(editingProjectId, payload);
    } else {
      await onAddProject(payload);
    }

    setEditorOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Compact Section Header */}
      <div className="pb-3 border-b border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Slide 02 · Case Studies
          </span>
          <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
            Dự án Tiêu biểu ({projects.length})
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGithubModal(true)}
            className="p-1.5 rounded-lg bg-[#ede8dd] hover:bg-[#e2dcd0] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-stone-700 dark:text-slate-300 border border-[#d6d0c2] dark:border-transparent transition-colors cursor-pointer"
            title="Import từ GitHub"
            aria-label="Import từ GitHub"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
            aria-label="Thêm dự án mới"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Projects Vertical List */}
      {projects.length === 0 ? (
        <div className="py-8 px-4 text-center space-y-3 rounded-xl border border-[#d6d0c2] dark:border-white/[0.06] bg-[#fbfaf7] dark:bg-white/[0.01]">
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <FolderGit2 className="h-4 w-4 stroke-[1.8]" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">Chưa có dự án nào</h3>
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              Thêm các dự án nổi bật hoặc nhập trực tiếp từ GitHub.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowGithubModal(true)}
              className="px-2.5 py-1 rounded-lg bg-[#ede8dd] hover:bg-[#e2dcd0] dark:bg-white/[0.06] text-stone-800 dark:text-slate-200 text-[11px] font-semibold cursor-pointer border border-[#d6d0c2] dark:border-white/10"
            >
              GitHub
            </button>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold cursor-pointer"
            >
              + Tạo Dự Án
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => {
            const hasLinks = proj.liveUrl || proj.githubUrl;

            return (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-xl bg-[#fbfaf7] dark:bg-[#0c131a] border border-[#d6d0c2] dark:border-white/[0.07] hover:border-teal-600/50 dark:hover:border-teal-400/30 shadow-xs transition-all duration-200 overflow-hidden"
              >
                {/* Card Top: Number Index, Title, Actions */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="tabular-nums font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-800 dark:text-teal-400 border border-teal-500/20 shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveProject(idx, 'up')}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Di chuyển lên"
                        aria-label={`Chuyển dự án ${proj.title} lên`}
                      >
                        <ArrowLeft className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => onMoveProject(idx, 'down')}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Di chuyển xuống"
                        aria-label={`Chuyển dự án ${proj.title} xuống`}
                      >
                        <ArrowRight className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(proj)}
                        className="p-1 rounded text-slate-400 hover:text-teal-400 cursor-pointer"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa dự án ${proj.title}`}
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xoá dự án "${proj.title}" khỏi slide deck?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Xoá"
                        aria-label={`Xoá dự án ${proj.title}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {proj.subtitle && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
                      {proj.subtitle}
                    </p>
                  )}

                  {/* Role & Period */}
                  {(proj.role || proj.periodText) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                      {proj.role && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
                          <Briefcase className="h-2.5 w-2.5 text-teal-600 dark:text-teal-400" />
                          <span>{proj.role}</span>
                        </span>
                      )}
                      {proj.periodText && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
                          <Calendar className="h-2.5 w-2.5 text-slate-500 dark:text-slate-400" />
                          <span>{proj.periodText}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {proj.description && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}

                  {/* Tech Stack Badges */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Sleek Hairline Add Project Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="w-full py-4 px-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] hover:border-teal-500/40 bg-white/40 dark:bg-white/[0.02] hover:bg-teal-500/[0.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 group"
          >
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <Plus className="h-4 w-4" />
            </div>
            <span className="font-sans font-semibold text-xs group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Thêm Dự Án Mới
            </span>
          </button>
        </div>
      )}

      {/* Modern Two-Column Project Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-semibold text-teal-600 dark:text-teal-400">
                  {editingProjectId ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {editingProjectId ? draftTitle || 'Chi tiết Case Study' : 'Khởi tạo Case Study mới'}
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
                {/* Left Column: Core Identity */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Tên dự án <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder="VD: SoodFolio Presentation Engine"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs font-semibold focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tiêu đề phụ / Tagline
                    </label>
                    <input
                      type="text"
                      value={draftSubtitle}
                      onChange={(e) => setDraftSubtitle(e.target.value)}
                      placeholder="VD: Interactive Pitch-Deck Platform"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Vai trò
                      </label>
                      <input
                        type="text"
                        value={draftRole}
                        onChange={(e) => setDraftRole(e.target.value)}
                        placeholder="VD: Lead Architect"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={draftPeriod}
                        onChange={(e) => setDraftPeriod(e.target.value)}
                        placeholder="VD: 2025 - Hiện tại"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Mô tả giá trị & Giải pháp kỹ thuật
                      </label>
                      <button
                        type="button"
                        onClick={() => setAiPolishOpen(true)}
                        disabled={!draftDescription.trim()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans font-medium text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Tối ưu mô tả dự án và kiến trúc bằng AI"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>AI Polish</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                      placeholder="Tóm tắt bài toán kỹ thuật, giải pháp kiến trúc và kết quả đạt được..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column: Stack & Links */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tech Stack (ngăn cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={draftTechStack}
                      onChange={(e) => setDraftTechStack(e.target.value)}
                      placeholder="Next.js 16, Spring Boot 3, PostgreSQL, Tailwind"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Các kỹ năng sẽ tự động hiển thị dạng viên thuốc trực quan trên slide.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Demo Live URL
                    </label>
                    <input
                      type="url"
                      value={draftLiveUrl}
                      onChange={(e) => setDraftLiveUrl(e.target.value)}
                      placeholder="https://soodfolio.com/preview/demo"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      value={draftGithubUrl}
                      onChange={(e) => setDraftGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ảnh Mockup / Thumbnail URL (tùy chọn)
                    </label>
                    <input
                      type="url"
                      value={draftImageUrl}
                      onChange={(e) => setDraftImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 shadow-xs transition-colors"
                    />
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
                  {isSaving ? 'Đang lưu...' : editingProjectId ? 'Lưu Thay Đổi' : 'Tạo Dự Án Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click GitHub Import Modal */}
      <GitHubImportModal
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        onProjectImported={(newProj) => {
          if (onProjectImported) {
            onProjectImported(newProj);
          } else {
            onAddProject(newProj);
          }
          setShowGithubModal(false);
        }}
        defaultUsername={defaultGithubUsername}
      />

      <AiPolishDialog
        isOpen={aiPolishOpen}
        onClose={() => setAiPolishOpen(false)}
        rawText={draftDescription}
        field="project_desc"
        onApply={(refinedText) => setDraftDescription(refinedText)}
      />
    </div>
  );
};

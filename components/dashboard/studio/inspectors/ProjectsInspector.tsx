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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
            <span>Slide 02</span>
            <span>·</span>
            <span>Selected Case Studies</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Dự án & Sản phẩm Tiêu biểu
            <span className="ml-2.5 text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 tabular-nums">
              {projects.length} dự án
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trình bày các sản phẩm số, dự án trọng điểm và năng lực kỹ thuật của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowGithubModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-sans font-semibold text-xs border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs"
            aria-label="Import dự án từ GitHub"
          >
            <FolderGit2 className="h-4 w-4 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            <span>Import từ GitHub</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs transition-all cursor-pointer shadow-sm shadow-teal-600/30"
            aria-label="Thêm dự án mới thủ công"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Dự Án</span>
          </button>
        </div>
      </div>

      {/* Projects Gallery Grid (Visual Cards) */}
      {projects.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.01]">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <FolderGit2 className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Chưa có dự án nào</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Bắt đầu thêm các dự án nổi bật của bạn hoặc nhập trực tiếp từ GitHub để tự động tạo case study.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowGithubModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-white/10"
            >
              Import từ GitHub
            </button>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
            >
              + Tạo Dự Án Mới
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((proj, idx) => {
            const hasLinks = proj.liveUrl || proj.githubUrl;

            return (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] hover:border-teal-500/40 dark:hover:border-teal-400/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-200 overflow-hidden"
              >
                {/* Card Top: Number Index, Title, Subtitle */}
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
                        onClick={() => onMoveProject(idx, 'up')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Chuyển sang trước"
                        aria-label={`Chuyển dự án ${proj.title} sang trước`}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => onMoveProject(idx, 'down')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Chuyển sang sau"
                        aria-label={`Chuyển dự án ${proj.title} sang sau`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {proj.title}
                    </h3>
                    {proj.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {proj.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Role & Period Badges */}
                  {(proj.role || proj.periodText) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {proj.role && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] font-medium">
                          <Briefcase className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          <span>{proj.role}</span>
                        </span>
                      )}
                      {proj.periodText && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] font-medium">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{proj.periodText}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {proj.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                      {proj.description}
                    </p>
                  )}

                  {/* Tech Stack Badges */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-xs font-sans font-semibold text-slate-400">
                          +{proj.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Links & Actions */}
                <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between gap-3">
                  {/* External links */}
                  <div className="flex items-center gap-2">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-teal-600 dark:text-teal-400 hover:underline"
                        title={proj.liveUrl}
                      >
                        <Globe className="h-3 w-3" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        title={proj.githubUrl}
                      >
                        <Code2 className="h-3 w-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {!hasLinks && (
                      <span className="text-[11px] text-slate-400 italic">Chưa gắn link</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Chỉnh sửa dự án"
                      aria-label={`Chỉnh sửa dự án ${proj.title}`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Xoá dự án "${proj.title}" khỏi slide deck?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Xoá dự án này"
                      aria-label={`Xoá dự án ${proj.title}`}
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
                + Thêm Dự Án Mới
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Khởi tạo thêm case study tiếp theo</p>
            </div>
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mô tả giá trị & Giải pháp kỹ thuật
                    </label>
                    <textarea
                      rows={4}
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                      placeholder="Tóm tắt bài toán kỹ thuật, giải pháp kiến trúc và kết quả đạt được..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
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
    </div>
  );
};

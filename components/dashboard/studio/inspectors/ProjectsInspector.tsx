'use client';

import React, { useState } from 'react';
import { ProjectDto } from '@/types/portfolio';
import {
  FolderGit2,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  Code2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Layers,
} from 'lucide-react';

interface ProjectsInspectorProps {
  projects: ProjectDto[];
  onAddProject: (project: Omit<ProjectDto, 'id'>) => Promise<void>;
  onUpdateProject: (id: string, updated: Partial<ProjectDto>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onMoveProject: (index: number, direction: 'up' | 'down') => Promise<void>;
  isSaving: boolean;
}

export const ProjectsInspector: React.FC<ProjectsInspectorProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onMoveProject,
  isSaving,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New project draft state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [draftPeriod, setDraftPeriod] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftTechStack, setDraftTechStack] = useState('');
  const [draftLiveUrl, setDraftLiveUrl] = useState('');
  const [draftGithubUrl, setDraftGithubUrl] = useState('');
  const [draftImageUrl, setDraftImageUrl] = useState('');

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    const techArray = draftTechStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await onAddProject({
      title: draftTitle.trim(),
      subtitle: draftSubtitle.trim() || undefined,
      role: draftRole.trim() || undefined,
      periodText: draftPeriod.trim() || undefined,
      description: draftDescription.trim() || undefined,
      techStack: techArray,
      liveUrl: draftLiveUrl.trim() || undefined,
      githubUrl: draftGithubUrl.trim() || undefined,
      imageUrl: draftImageUrl.trim() || undefined,
    });

    // Reset form
    setDraftTitle('');
    setDraftSubtitle('');
    setDraftRole('');
    setDraftPeriod('');
    setDraftDescription('');
    setDraftTechStack('');
    setDraftLiveUrl('');
    setDraftGithubUrl('');
    setDraftImageUrl('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
            SLIDE 02 // SELECTED CASE STUDIES
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            Dự án & Sản phẩm Tiêu biểu ({projects.length})
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
            <span>Thêm Dự Án</span>
          </button>
        )}
      </div>

      {/* Inline Form: Add New Project */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateNew}
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-teal-500/40 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-white/10">
            <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
              // THÊM DỰ ÁN MỚI
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên dự án <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="VD: SoodFolio Platform"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Tiêu đề phụ / Tagline</label>
              <input
                type="text"
                value={draftSubtitle}
                onChange={(e) => setDraftSubtitle(e.target.value)}
                placeholder="VD: Interactive Pitch-Deck"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Vai trò của bạn</label>
              <input
                type="text"
                value={draftRole}
                onChange={(e) => setDraftRole(e.target.value)}
                placeholder="VD: Fullstack Lead / Solo Creator"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Tech Stack (ngăn cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={draftTechStack}
              onChange={(e) => setDraftTechStack(e.target.value)}
              placeholder="Next.js 16, Spring Boot 3, PostgreSQL, Tailwind"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Demo Live URL</label>
              <input
                type="url"
                value={draftLiveUrl}
                onChange={(e) => setDraftLiveUrl(e.target.value)}
                placeholder="https://soodfolio.com"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">GitHub Repo URL</label>
              <input
                type="url"
                value={draftGithubUrl}
                onChange={(e) => setDraftGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">Mô tả giá trị & Kiến trúc</label>
            <textarea
              rows={2}
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              placeholder="Mô tả bài toán kỹ thuật, giải pháp kiến trúc và kết quả đạt được..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs resize-none"
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
              {isSaving ? 'Đang tạo...' : 'Tạo Dự Án Mới'}
            </button>
          </div>
        </form>
      )}

      {/* Projects List with Accordion Edit */}
      {projects.length === 0 && !isAddingNew ? (
        <div className="py-8 text-center space-y-2 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
          <FolderGit2 className="h-7 w-7 text-slate-400 mx-auto" />
          <p className="text-slate-500 text-xs">Chưa có dự án nào trong slide deck.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((proj, idx) => {
            const isExpanded = expandedId === proj.id;

            return (
              <div
                key={proj.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-50 dark:bg-[#111a24] border-teal-500/40 shadow-md'
                    : 'bg-white dark:bg-[#0c131a] border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                {/* Accordion Item Header */}
                <div className="p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                      0{idx + 1}.
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                      className="text-left font-semibold text-slate-900 dark:text-white truncate hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer flex-1"
                    >
                      {proj.title}
                    </button>
                    {proj.role && (
                      <span className="hidden sm:inline text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        // {proj.role}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Move Up/Down buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveProject(idx, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Chuyển lên trước"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => onMoveProject(idx, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Chuyển xuống sau"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>

                    {/* Toggle Accordion */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer ml-1"
                      title={isExpanded ? 'Thu gọn' : 'Chỉnh sửa'}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Inline Editor */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-white/[0.06] space-y-2.5 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tên dự án
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => onUpdateProject(proj.id, { title: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Phụ đề</label>
                        <input
                          type="text"
                          value={proj.subtitle || ''}
                          onChange={(e) => onUpdateProject(proj.id, { subtitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Vai trò</label>
                        <input
                          type="text"
                          value={proj.role || ''}
                          onChange={(e) => onUpdateProject(proj.id, { role: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                        Tech Stack (phẩy để tách)
                      </label>
                      <input
                        type="text"
                        value={(proj.techStack || []).join(', ')}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          onUpdateProject(proj.id, { techStack: arr });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Demo Live URL</label>
                        <input
                          type="url"
                          value={proj.liveUrl || ''}
                          onChange={(e) => onUpdateProject(proj.id, { liveUrl: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => onUpdateProject(proj.id, { githubUrl: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Mô tả dự án</label>
                      <textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => onUpdateProject(proj.id, { description: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs resize-none"
                      />
                    </div>

                    {/* Actions: Delete & Close */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xoá dự án "${proj.title}" khỏi slide deck?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 text-xs font-medium cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xoá dự án này</span>
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

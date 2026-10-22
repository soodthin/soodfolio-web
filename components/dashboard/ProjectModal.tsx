'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';
import { ProjectDto } from '@/types/portfolio';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDto | null;
  onSaved: (project: ProjectDto) => void;
}

export function ProjectModal({ isOpen, onClose, project, onSaved }: ProjectModalProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [subtitle, setSubtitle] = useState(project?.subtitle || '');
  const [role, setRole] = useState(project?.role || '');
  const [periodText, setPeriodText] = useState(project?.periodText || '');
  const [description, setDescription] = useState(project?.description || '');
  const [techStackInput, setTechStackInput] = useState(project?.techStack?.join(', ') || '');
  const [highlightsInput, setHighlightsInput] = useState(project?.highlights?.join('\n') || '');
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || '');
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');
  const [imageUrl] = useState(project?.imageUrl || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Project Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      role: role.trim() || null,
      periodText: periodText.trim() || null,
      description: description.trim() || null,
      techStack,
      highlights,
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      imageUrl: imageUrl.trim() || null,
    };

    try {
      const url = project
        ? `${API_BASE}/portfolios/me/projects/${project.id}`
        : `${API_BASE}/portfolios/me/projects`;
      const method = project ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || `Failed to ${project ? 'update' : 'create'} project slide.`);
      }

      const saved: ProjectDto = await res.json();
      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#11131a] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-400/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {project ? 'Edit Project Slide' : 'Create New Project Slide'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {project ? 'Update details for this slide deck project.' : 'Add a new showcase slide to your deck.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-8 w-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>PROJECT TITLE *</span>
                <span className="text-[10px] text-slate-400">Required</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cash Flow AI Reconciliation"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">SUBTITLE / TAGLINE</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Automated Banking OCR & Settlement"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">ROLE / CAPACITY</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full-stack Architect & Lead"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">TIMELINE / PERIOD</label>
              <input
                type="text"
                value={periodText}
                onChange={(e) => setPeriodText(e.target.value)}
                placeholder="e.g. 2025 – 2026"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">TECH STACK (COMMA-SEPARATED)</label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="Next.js, TypeScript, Spring Boot, Redis"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">LIVE DEMO URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">GITHUB REPOSITORY URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">DESCRIPTION</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level architectural overview and core objective of the project..."
              className="w-full p-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>ĐIỂM NỔI BẬT & ĐÓNG GÓP CỐT LÕI</span>
              <span className="text-[10px] text-slate-400">Mỗi dòng một ý</span>
            </label>
            <textarea
              rows={4}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="Ví dụ:&#10;- Xây dựng trải nghiệm trực quan giúp tăng 35% mức độ tương tác của người dùng&#10;- Tối ưu hóa hiệu năng và tốc độ phản hồi nhanh hơn 50%&#10;- Đạt giải thưởng Thiết kế & Trải nghiệm xuất sắc nhất năm"
              className="w-full p-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs font-sans leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-400/10 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Slide...</span>
                </>
              ) : (
                <span>{project ? 'Update Slide' : 'Create Slide'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

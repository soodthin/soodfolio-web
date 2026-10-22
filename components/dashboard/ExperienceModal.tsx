'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Briefcase, AlertCircle } from 'lucide-react';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';
import { ExperienceDto } from '@/types/portfolio';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceDto | null;
  onSaved: (experience: ExperienceDto) => void;
}

export function ExperienceModal({ isOpen, onClose, experience, onSaved }: ExperienceModalProps) {
  const [roleTitle, setRoleTitle] = useState(experience?.roleTitle || '');
  const [companyName, setCompanyName] = useState(experience?.companyName || '');
  const [companyUrl, setCompanyUrl] = useState(experience?.companyUrl || '');
  const [location, setLocation] = useState(experience?.location || '');
  const [periodText, setPeriodText] = useState(experience?.periodText || '');
  const [skillsUsedInput, setSkillsUsedInput] = useState(experience?.skillsUsed?.join(', ') || '');
  const [description, setDescription] = useState(experience?.description || '');
  const [highlightsInput, setHighlightsInput] = useState(experience?.highlights?.join('\n') || '');

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
    if (!roleTitle.trim()) {
      setErrorMessage('Role Title is required.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMessage('Company Name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const skillsUsed = skillsUsedInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      roleTitle: roleTitle.trim(),
      companyName: companyName.trim(),
      companyUrl: companyUrl.trim() || null,
      location: location.trim() || null,
      periodText: periodText.trim() || null,
      description: description.trim() || null,
      skillsUsed,
      highlights,
    };

    try {
      const url = experience
        ? `${API_BASE}/portfolios/me/experiences/${experience.id}`
        : `${API_BASE}/portfolios/me/experiences`;
      const method = experience ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || `Failed to ${experience ? 'update' : 'create'} experience.`);
      }

      const saved: ExperienceDto = await res.json();
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
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {experience ? 'Edit Professional Role' : 'Add Professional Experience'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {experience ? 'Update timeline track details.' : 'Add your role history and technical achievements.'}
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
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>ROLE TITLE *</span>
                <span className="text-[10px] text-slate-400">Required</span>
              </label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior Full-stack Engineer"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>COMPANY / ORG *</span>
                <span className="text-[10px] text-slate-400">Required</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. BW Industrial Development"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">COMPANY URL</label>
              <input
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://company.com"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">LOCATION</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ho Chi Minh City, Vietnam"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">TENURE / PERIOD</label>
              <input
                type="text"
                value={periodText}
                onChange={(e) => setPeriodText(e.target.value)}
                placeholder="e.g. Oct 2025 – Apr 2026"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">SKILLS USED (COMMA-SEPARATED)</label>
              <input
                type="text"
                value={skillsUsedInput}
                onChange={(e) => setSkillsUsedInput(e.target.value)}
                placeholder="FastAPI, React, TypeScript, Docker, Redis"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">MÔ TẢ VAI TRÒ</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt vai trò, trách nhiệm và phạm vi công việc của bạn..."
              className="w-full p-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>THÀNH TỰU & KẾT QUẢ NỔI BẬT</span>
              <span className="text-[10px] text-slate-400">Mỗi dòng một ý</span>
            </label>
            <textarea
              rows={4}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="Ví dụ:&#10;- Dẫn dắt ra mắt dự án mới thu hút hơn 100.000 người dùng trong 3 tháng đầu&#10;- Cải tiến quy trình làm việc giúp tiết kiệm 40% thời gian xử lý của đội ngũ&#10;- Nâng cao chỉ số hài lòng của khách hàng và đối tác lên 96%"
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{experience ? 'Update Experience' : 'Save Experience'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

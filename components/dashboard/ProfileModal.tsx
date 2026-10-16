'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, User, AlertCircle } from 'lucide-react';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';
import { PortfolioData } from '@/types/portfolio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData | null;
  onSaved: (updatedPortfolio: PortfolioData) => void;
}

export function ProfileModal({ isOpen, onClose, portfolio, onSaved }: ProfileModalProps) {
  const [title, setTitle] = useState(portfolio?.title || '');
  const [tagline, setTagline] = useState(portfolio?.tagline || '');
  const [bio, setBio] = useState(portfolio?.bio || '');
  const [statusText, setStatusText] = useState(portfolio?.statusText || '');
  const [resumeUrl, setResumeUrl] = useState(portfolio?.resumeUrl || '');

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
      setErrorMessage('Portfolio Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      title: title.trim(),
      tagline: tagline.trim() || null,
      bio: bio.trim() || null,
      statusText: statusText.trim() || null,
      resumeUrl: resumeUrl.trim() || null,
      themeMode: portfolio?.themeMode || 'DARK',
      showExperience: portfolio?.showExperience ?? true,
      showProjects: portfolio?.showProjects ?? true,
      showSkills: portfolio?.showSkills ?? true,
      showEducation: portfolio?.showEducation ?? true,
      showContact: portfolio?.showContact ?? true,
      socialLinks: portfolio?.socialLinks || [],
    };

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Failed to update portfolio profile.');
      }

      const updated: PortfolioData = await res.json();
      onSaved(updated);
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
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#11131a] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-400/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Edit Identity & Hero Slide</h3>
              <p className="text-xs text-slate-400 font-mono">
                Update your professional header, elevator bio, and status.
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
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>PORTFOLIO TITLE / NAME *</span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. THAI DO THINH"
              className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">HERO TAGLINE</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. SOFTWARE ENGINEER // FULL-STACK DEVELOPER"
              className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">AVAILABILITY / STATUS TEXT</label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="AVAILABLE FOR ROLES // READY TO DEPLOY"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">RESUME / CV URL</label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/... or #contact"
                className="w-full h-10 px-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">ELEVATOR BIO / HERO OVERVIEW</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Final-year Computer Science student with experience building and deploying production systems..."
              className="w-full p-3.5 rounded-xl bg-[#161923] border border-white/10 focus:border-teal-400/60 focus:outline-none text-white text-xs font-sans leading-relaxed resize-none"
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
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

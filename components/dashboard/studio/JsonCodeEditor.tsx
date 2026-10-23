'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { StudioSlideKey } from './types';
import { Code2, Check, AlertCircle, Copy, RotateCcw } from 'lucide-react';

interface JsonCodeEditorProps {
  portfolio: PortfolioData | null;
  activeSlide: StudioSlideKey;
  onApplyJson: (updated: PortfolioData) => Promise<void>;
  isSaving: boolean;
}

export const JsonCodeEditor: React.FC<JsonCodeEditorProps> = ({
  portfolio,
  activeSlide,
  onApplyJson,
  isSaving,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Initialize JSON text based on active slide or full portfolio
  useEffect(() => {
    if (!portfolio) return;
    try {
      let sliceData: any = portfolio;
      if (activeSlide === 'cover') {
        sliceData = {
          title: portfolio.title,
          fullName: portfolio.fullName,
          tagline: portfolio.tagline,
          bio: portfolio.bio,
          statusText: portfolio.statusText,
          avatarUrl: portfolio.avatarUrl,
          resumeUrl: portfolio.resumeUrl,
          socialLinks: portfolio.socialLinks,
        };
      } else if (activeSlide === 'projects') {
        sliceData = { projects: portfolio.projects };
      } else if (activeSlide === 'experience') {
        sliceData = { experiences: portfolio.experiences };
      } else if (activeSlide === 'skills') {
        sliceData = { skills: portfolio.skills };
      } else if (activeSlide === 'settings') {
        sliceData = {
          themeMode: portfolio.themeMode,
          isPublished: portfolio.isPublished,
          showProjects: portfolio.showProjects,
          showExperience: portfolio.showExperience,
          showSkills: portfolio.showSkills,
          showEducation: portfolio.showEducation,
          showContact: portfolio.showContact,
        };
      }
      setJsonText(JSON.stringify(sliceData, null, 2));
      setParseError(null);
    } catch {
      setJsonText('{}');
    }
  }, [portfolio, activeSlide]);

  const handleTextChange = (value: string) => {
    setJsonText(value);
    try {
      JSON.parse(value);
      setParseError(null);
    } catch (e: any) {
      setParseError(e.message || 'JSON không hợp lệ');
    }
  };

  const handleApply = async () => {
    if (!portfolio || parseError) return;
    try {
      const parsed = JSON.parse(jsonText);
      const merged: PortfolioData = {
        ...portfolio,
        ...parsed,
      };
      await onApplyJson(merged);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 2500);
    } catch (e: any) {
      setParseError(e.message || 'Lỗi khi áp dụng JSON');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 text-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
            RAW JSON SPEC // {activeSlide.toUpperCase()}
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            Trình Biên Tập Mã JSON (Dev-First)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Sao chép JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-teal-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!!parseError || isSaving}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {appliedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Đã Áp Dụng</span>
              </>
            ) : (
              <span>Áp Dụng JSON</span>
            )}
          </button>
        </div>
      </div>

      {parseError && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 flex items-center gap-2 text-xs">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="font-mono text-[11px] truncate">{parseError}</span>
        </div>
      )}

      {/* Editor textarea */}
      <div className="relative flex-1 min-h-[360px]">
        <textarea
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full min-h-[360px] p-3.5 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] leading-relaxed border border-slate-700 dark:border-white/10 focus:outline-none focus:border-teal-400 selection:bg-teal-500/30 resize-none shadow-inner"
        />
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5 pointer-events-none">
          JSON 2.0 · UTF-8
        </div>
      </div>
    </div>
  );
};

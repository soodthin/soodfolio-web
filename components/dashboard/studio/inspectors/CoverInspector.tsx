'use client';

import React, { useState, useRef } from 'react';
import { PortfolioData, SocialLinkDto } from '@/types/portfolio';
import {
  User,
  Sparkles,
  Plus,
  Trash2,
  Globe,
  Share2,
  Code2,
  Briefcase,
  Camera,
} from 'lucide-react';
import { AiPolishDialog } from '../AiPolishDialog';

interface CoverInspectorProps {
  portfolio: PortfolioData | null;
  onUpdateField: (field: keyof PortfolioData, value: any) => void;
  onSaveProfile: (updated: Partial<PortfolioData>) => Promise<void>;
  isSaving: boolean;
  focusedField?: string | null;
  onFocusField?: (field: string) => void;
  onBlurField?: () => void;
}

export const CoverInspector: React.FC<CoverInspectorProps> = ({
  portfolio,
  onUpdateField,
  onSaveProfile,
  isSaving,
  focusedField,
  onFocusField,
  onBlurField,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [aiPolishOpen, setAiPolishOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!portfolio) return null;

  // Smart detect platform from URL
  const detectPlatform = (url: string): { platform: string; cleanUrl: string } => {
    let clean = url.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }

    try {
      const parsed = new URL(clean);
      const host = parsed.hostname.toLowerCase();

      if (host.includes('github.com')) return { platform: 'GitHub', cleanUrl: clean };
      if (host.includes('linkedin.com')) return { platform: 'LinkedIn', cleanUrl: clean };
      if (host.includes('twitter.com') || host.includes('x.com')) return { platform: 'Twitter/X', cleanUrl: clean };
      if (host.includes('dribbble.com')) return { platform: 'Dribbble', cleanUrl: clean };
      if (host.includes('youtube.com')) return { platform: 'YouTube', cleanUrl: clean };
      return { platform: 'Website', cleanUrl: clean };
    } catch {
      return { platform: 'Website', cleanUrl: clean };
    }
  };

  const handleAddSocialLink = () => {
    if (!inputUrl.trim()) return;
    const { platform, cleanUrl } = detectPlatform(inputUrl);

    let label = customLabel.trim();
    if (!label) {
      try {
        const parsed = new URL(cleanUrl);
        const pathParts = parsed.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          label = `@${pathParts[pathParts.length - 1]}`;
        } else {
          label = parsed.hostname.replace(/^www\./, '');
        }
      } catch {
        label = cleanUrl;
      }
    }

    const newLinks: SocialLinkDto[] = [
      ...(portfolio.socialLinks || []),
      { platform, url: cleanUrl, label },
    ];
    onUpdateField('socialLinks', newLinks);
    setInputUrl('');
    setCustomLabel('');
  };

  const handleRemoveSocialLink = (index: number) => {
    const updated = (portfolio.socialLinks || []).filter((_, i) => i !== index);
    onUpdateField('socialLinks', updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateField('avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github') || p.includes('git')) return <Code2 className="h-3 w-3 text-current" />;
    if (p.includes('linkedin')) return <Briefcase className="h-3 w-3 text-current" />;
    if (p.includes('twitter') || p.includes('x')) return <Share2 className="h-3 w-3 text-current" />;
    return <Globe className="h-3 w-3 text-current" />;
  };

  return (
    <div className="w-full space-y-4 font-sans text-xs">
      {/* Compact Section Header */}
      <div className="pb-2 border-b border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
          Slide 01 · Identity & Cover
        </span>
        <span className="text-[10px] text-stone-600 dark:text-slate-400 font-mono">Định danh</span>
      </div>

      {/* Avatar Compact Row */}
      <div className="p-3 rounded-xl bg-[#fbfaf7] dark:bg-white/[0.02] border border-[#d6d0c2] dark:border-white/[0.06] shadow-xs flex items-center gap-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 overflow-hidden flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 cursor-pointer relative group hover:border-teal-400 transition-colors"
          title="Nhấp để thay đổi ảnh đại diện"
        >
          {portfolio.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portfolio.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
            <Camera className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-stone-900 dark:text-slate-100 text-xs truncate">
            {portfolio.fullName || 'Chưa đặt tên'}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold cursor-pointer transition-colors"
          >
            Đổi ảnh đại diện
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Fields: Core Identity */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold mb-1">
            Họ và tên <span className="text-rose-500">*</span>
          </label>
          <input
            id="field-fullName"
            type="text"
            required
            value={portfolio.fullName || ''}
            onChange={(e) => onUpdateField('fullName', e.target.value)}
            onFocus={() => onFocusField?.('fullName')}
            onBlur={onBlurField}
            placeholder="VD: Thái Đỗ Thịnh"
            className="w-full px-3 py-2 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs font-semibold focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold mb-1">
            Tiêu đề Slide Deck <span className="text-rose-500">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            required
            value={portfolio.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            onFocus={() => onFocusField?.('title')}
            onBlur={onBlurField}
            placeholder="VD: THÁI ĐỖ THỊNH"
            className="w-full px-3 py-2 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs font-semibold focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold mb-1">
            Định vị chuyên môn (Tagline)
          </label>
          <input
            id="field-tagline"
            type="text"
            value={portfolio.tagline || ''}
            onChange={(e) => onUpdateField('tagline', e.target.value)}
            onFocus={() => onFocusField?.('tagline')}
            onBlur={onBlurField}
            placeholder="VD: SOFTWARE ENGINEER · FULL-STACK DEVELOPER"
            className="w-full px-3 py-2 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-teal-800 dark:text-teal-400 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs font-semibold focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold mb-1">
            Trạng thái hợp tác (Status Badge)
          </label>
          <input
            id="field-statusText"
            type="text"
            value={(portfolio.statusText || '').replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·')}
            onChange={(e) => onUpdateField('statusText', e.target.value.replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·'))}
            onFocus={() => onFocusField?.('statusText')}
            onBlur={onBlurField}
            placeholder="VD: Sẵn sàng hợp tác · Full-time"
            className="w-full px-3 py-2 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* Field: Bio Statement with AI Polish Trigger */}
      <div className="pt-2 border-t border-[#d6d0c2] dark:border-white/[0.06] space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold">
            Tuyên ngôn bản thân (Bio)
          </label>
          <button
            type="button"
            onClick={() => setAiPolishOpen(true)}
            disabled={!portfolio.bio?.trim()}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-sans font-medium text-teal-800 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all cursor-pointer disabled:opacity-40"
            title="Tối ưu tuyên ngôn bằng Google X-Y-Z"
          >
            <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span>AI Polish</span>
          </button>
        </div>
        <textarea
          id="field-bio"
          rows={4}
          value={portfolio.bio || ''}
          onChange={(e) => onUpdateField('bio', e.target.value)}
          onFocus={() => onFocusField?.('bio')}
          onBlur={onBlurField}
          placeholder="Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội..."
          className="w-full px-3 py-2 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs leading-relaxed focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors resize-none font-sans"
        />
      </div>

      {/* Social Links List */}
      <div className="pt-2 border-t border-[#d6d0c2] dark:border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-700 dark:text-slate-300 font-semibold">
            Kênh liên kết ({portfolio.socialLinks?.length || 0})
          </span>
        </div>

        {/* Existing links */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
          {portfolio.socialLinks && portfolio.socialLinks.length > 0 ? (
            portfolio.socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#fbfaf7] dark:bg-white/[0.03] border border-[#d6d0c2] dark:border-white/[0.06] text-xs text-stone-800 dark:text-slate-300 shadow-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-teal-600 dark:text-teal-400 shrink-0">{getPlatformIcon(link.platform)}</span>
                  <span className="font-medium truncate text-[11px]">{link.label || link.platform}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="text-stone-400 hover:text-rose-500 cursor-pointer p-0.5 transition-colors"
                  title="Xoá liên kết"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-stone-500 italic py-1">Chưa có liên kết nào.</p>
          )}
        </div>

        {/* Add link input */}
        <div className="flex items-center gap-1.5 pt-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSocialLink();
              }
            }}
            placeholder="VD: github.com/username"
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-xs focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs"
          />
          <button
            type="button"
            onClick={handleAddSocialLink}
            disabled={!inputUrl.trim()}
            className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <AiPolishDialog
        isOpen={aiPolishOpen}
        onClose={() => setAiPolishOpen(false)}
        rawText={portfolio.bio || ''}
        field="bio"
        onApply={(refinedText) => onUpdateField('bio', refinedText)}
      />
    </div>
  );
};

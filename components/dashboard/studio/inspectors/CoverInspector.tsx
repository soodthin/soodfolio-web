'use client';

import React, { useState, useRef } from 'react';
import { PortfolioData, SocialLinkDto } from '@/types/portfolio';
import {
  User,
  Sparkles,
  Link2,
  Plus,
  Trash2,
  FileText,
  Upload,
  Check,
  Globe,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';

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
      return { platform: 'Link', cleanUrl: clean };
    }
  };

  const handleAddSocialLink = () => {
    if (!inputUrl.trim()) return;
    const { platform, cleanUrl } = detectPlatform(inputUrl);

    // Extract smart handle or label if none provided
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
    const newLinks = (portfolio.socialLinks || []).filter((_, i) => i !== index);
    onUpdateField('socialLinks', newLinks);
  };

  // Avatar file upload handler (converts to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh nhỏ hơn 2MB để tối ưu tốc độ tải trang.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateField('avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Inspector Section Header */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
          SLIDE 01 // IDENTITY & HERO
        </span>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
          Thông tin Giới thiệu & Slide Mở đầu
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Mọi chỉnh sửa được đồng bộ tức thì sang bản xem trước bên phải.
        </p>
      </div>

      {/* Smart Avatar Upload Section */}
      <div className="space-y-2">
        <label className="block font-semibold text-slate-700 dark:text-slate-300">
          Ảnh đại diện (Avatar)
        </label>
        <div className="flex items-center gap-3">
          {/* Avatar Preview */}
          <div
            id="field-avatarUrl"
            onClick={() => fileInputRef.current?.click()}
            className={`h-14 w-14 rounded-2xl bg-teal-500/10 border-2 overflow-hidden flex items-center justify-center text-teal-500 font-bold text-base flex-shrink-0 cursor-pointer group relative ${
              focusedField === 'avatarUrl'
                ? 'border-teal-500 ring-2 ring-teal-500/30'
                : 'border-teal-500/40 hover:border-teal-500'
            }`}
            title="Bấm để đổi ảnh"
          >
            {portfolio.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={portfolio.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 stroke-[1.5]" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
              <Upload className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>Tải ảnh lên</span>
              </button>

              {portfolio.avatarUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateField('avatarUrl', null)}
                  className="px-2 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 font-medium text-xs cursor-pointer"
                >
                  Xoá ảnh
                </button>
              )}
            </div>

            {/* URL Input fallback */}
            <input
              type="url"
              value={portfolio.avatarUrl?.startsWith('data:') ? '' : portfolio.avatarUrl || ''}
              onChange={(e) => onUpdateField('avatarUrl', e.target.value)}
              onFocus={() => onFocusField?.('avatarUrl')}
              onBlur={onBlurField}
              placeholder="Hoặc dán link ảnh trực tiếp (https://...)"
              className="w-full px-2.5 py-1 rounded-md bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 text-[11px] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Full Name & Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Họ và tên hiển thị <span className="text-rose-500">*</span>
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
            className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border text-slate-900 dark:text-white focus:outline-none text-xs transition-colors ${
              focusedField === 'fullName'
                ? 'border-teal-500 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-white/10 focus:border-teal-500'
            }`}
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tiêu đề Deck / Portfolio <span className="text-rose-500">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            required
            value={portfolio.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            onFocus={() => onFocusField?.('title')}
            onBlur={onBlurField}
            placeholder="VD: Senior Full-Stack Engineer"
            className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border text-slate-900 dark:text-white focus:outline-none text-xs font-medium transition-colors ${
              focusedField === 'title'
                ? 'border-teal-500 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-white/10 focus:border-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Tagline (Realistic developer title) */}
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Định vị chuyên môn (Tagline)
        </label>
        <input
          id="field-tagline"
          type="text"
          value={portfolio.tagline || ''}
          onChange={(e) => onUpdateField('tagline', e.target.value)}
          onFocus={() => onFocusField?.('tagline')}
          onBlur={onBlurField}
          placeholder="VD: Full-Stack Engineer & Product Builder"
          className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border text-slate-900 dark:text-white focus:outline-none text-xs text-teal-600 dark:text-teal-400 font-medium transition-colors ${
            focusedField === 'tagline'
              ? 'border-teal-500 ring-2 ring-teal-500/20'
              : 'border-slate-200 dark:border-white/10 focus:border-teal-500'
          }`}
        />
      </div>

      {/* Status Pill Text */}
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Trạng thái hợp tác (Status Badge)
        </label>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0" />
          <input
            id="field-statusText"
            type="text"
            value={portfolio.statusText || ''}
            onChange={(e) => onUpdateField('statusText', e.target.value)}
            onFocus={() => onFocusField?.('statusText')}
            onBlur={onBlurField}
            placeholder="VD: Sẵn sàng nhận dự án tư vấn / Full-time"
            className={`flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border text-slate-900 dark:text-white focus:outline-none text-xs transition-colors ${
              focusedField === 'statusText'
                ? 'border-teal-500 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-white/10 focus:border-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Bio Statement */}
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Giới thiệu bản thân (Bio Statement)
        </label>
        <textarea
          id="field-bio"
          rows={3}
          value={portfolio.bio || ''}
          onChange={(e) => onUpdateField('bio', e.target.value)}
          onFocus={() => onFocusField?.('bio')}
          onBlur={onBlurField}
          placeholder="Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng..."
          className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111a24] border text-slate-900 dark:text-white focus:outline-none text-xs leading-relaxed transition-colors ${
            focusedField === 'bio'
              ? 'border-teal-500 ring-2 ring-teal-500/20'
              : 'border-slate-200 dark:border-white/10 focus:border-teal-500'
          }`}
        />
      </div>

      {/* Smart Social Links Manager */}
      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Liên kết xã hội & Mạng lưới
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            Tự động nhận diện GitHub / LinkedIn
          </span>
        </div>

        {/* Existing Links List */}
        {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
          <div className="space-y-1.5">
            {portfolio.socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                    {link.platform}:
                  </span>
                  <span className="truncate text-slate-700 dark:text-slate-300">
                    {link.label || link.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer flex-shrink-0"
                  title="Xoá liên kết này"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Smart Link Add Input Bar */}
        <div className="flex items-center gap-2">
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
            placeholder="Dán link GitHub, LinkedIn, Twitter... (VD: github.com/username)"
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 text-xs font-mono"
          />

          <button
            type="button"
            onClick={handleAddSocialLink}
            disabled={!inputUrl.trim()}
            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

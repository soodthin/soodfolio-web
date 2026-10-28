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
  ExternalLink,
  Code2,
  Briefcase,
  BadgeCheck,
  Camera,
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
    const newLinks = (portfolio.socialLinks || []).filter((_, i) => i !== index);
    onUpdateField('socialLinks', newLinks);
  };

  // Avatar file upload handler
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

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github') || p.includes('git')) return <Code2 className="h-3.5 w-3.5 text-current" />;
    if (p.includes('linkedin')) return <Briefcase className="h-3.5 w-3.5 text-current" />;
    if (p.includes('twitter') || p.includes('x')) return <Share2 className="h-3.5 w-3.5 text-current" />;
    return <Globe className="h-3.5 w-3.5 text-current" />;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
          <span>Slide 01</span>
          <span>·</span>
          <span>Identity & Hero Cover</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Hồ sơ Định danh & Mở đầu Slide Deck
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Thiết lập thông tin đại diện chuyên nghiệp, định vị chuyên môn và các kênh liên hệ trực tiếp.
        </p>
      </div>

      {/* Two-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Visual Identity Card Showcase */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-semibold text-slate-500">
                Thẻ Danh Thiếp Kỹ Thuật Số
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Card</span>
              </span>
            </div>

            {/* Avatar Showcase with direct action */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-28 w-28 rounded-3xl bg-teal-500/10 border-2 border-teal-500/30 overflow-hidden flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-md cursor-pointer transition-transform group-hover:scale-105"
                  title="Nhấp để tải ảnh đại diện mới"
                >
                  {portfolio.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={portfolio.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 stroke-[1.5]" />
                  )}
                  <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1 transition-opacity">
                    <Camera className="h-5 w-5" />
                    <span>Đổi ảnh</span>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {portfolio.fullName || 'Tên hiển thị'}
                </h3>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                  {portfolio.tagline || 'Định vị chuyên môn (Tagline)'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {portfolio.title || 'Tiêu đề Portfolio'}
                </p>
              </div>

              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-xs font-sans font-medium text-slate-700 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>{portfolio.statusText || 'Sẵn sàng hợp tác & tư vấn'}</span>
              </div>
            </div>

            {/* Social Links Chips Showcase */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400">
                Mạng lưới liên kết ({portfolio.socialLinks?.length || 0})
              </span>
              <div className="flex flex-wrap gap-2">
                {portfolio.socialLinks && portfolio.socialLinks.length > 0 ? (
                  portfolio.socialLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-800 dark:text-slate-200 font-sans"
                    >
                      <span className="text-teal-600 dark:text-teal-400">
                        {getPlatformIcon(link.platform)}
                      </span>
                      <span className="font-medium truncate max-w-[140px]">{link.label || link.platform}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1"
                        title="Xoá liên kết"
                        aria-label={`Xoá liên kết ${link.platform}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa có liên kết mạng xã hội nào.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Detailed Form Fields */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Basic Identity */}
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-2">
              Thông Tin Định Danh & Chức Danh
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  placeholder="VD: THÁI ĐỖ THỊNH"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-teal-700 dark:text-teal-400 text-xs font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Trạng thái hợp tác (Status Badge)
              </label>
              <input
                id="field-statusText"
                type="text"
                value={portfolio.statusText || ''}
                onChange={(e) => onUpdateField('statusText', e.target.value)}
                onFocus={() => onFocusField?.('statusText')}
                onBlur={onBlurField}
                placeholder="VD: Sẵn sàng nhận dự án tư vấn / Full-time"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Card: Bio Statement */}
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-2">
              Tuyên Ngôn Nghề Nghiệp & Giới Thiệu (Bio Statement)
            </h3>
            <div>
              <textarea
                id="field-bio"
                rows={4}
                value={portfolio.bio || ''}
                onChange={(e) => onUpdateField('bio', e.target.value)}
                onFocus={() => onFocusField?.('bio')}
                onBlur={onBlurField}
                placeholder="Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-teal-500 resize-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Đoạn văn này xuất hiện trực tiếp tại vị trí trung tâm của Slide 01 để gây ấn tượng đầu tiên với người tuyển dụng và đối tác.
              </p>
            </div>
          </div>

          {/* Card: Add Social Links */}
          <div className="rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-2">
              Thêm Liên Kết Mạng Xã Hội
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
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
                placeholder="Dán link GitHub, LinkedIn, Portfolio... (VD: github.com/username)"
                className="w-full sm:flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 text-xs"
              />

              <button
                type="button"
                onClick={handleAddSocialLink}
                disabled={!inputUrl.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0"
              >
                <Plus className="h-4 w-4 stroke-[2.2]" />
                <span>Thêm Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

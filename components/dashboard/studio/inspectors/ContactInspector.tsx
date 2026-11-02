'use client';

import React, { useState } from 'react';
import { PortfolioData, SocialLinkDto } from '@/types/portfolio';
import {
  Mail,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  CheckCircle2,
  Share2,
  Sparkles,
  Link2,
} from 'lucide-react';

interface ContactInspectorProps {
  portfolio: PortfolioData | null;
  onUpdateField: (field: keyof PortfolioData, value: any) => void;
  onSaveProfile: (updated: Partial<PortfolioData>) => Promise<void>;
  isSaving: boolean;
  focusedField?: string | null;
  onFocusField?: (field: string) => void;
  onBlurField?: () => void;
}

const COMMON_PLATFORMS = [
  'Email',
  'GitHub',
  'LinkedIn',
  'X',
  'Telegram',
  'Website',
  'Discord',
  'Calendar',
];

const QUICK_STATUS_OPTIONS = [
  'Available for collaboration',
  'Open to Staff · Lead roles',
  'Advisory & Tech Consulting',
  'Building in Stealth',
];

export const ContactInspector: React.FC<ContactInspectorProps> = ({
  portfolio,
  onUpdateField,
  onSaveProfile,
  isSaving,
  focusedField,
  onFocusField,
  onBlurField,
}) => {
  if (!portfolio) return null;

  const [socialLinks, setSocialLinks] = useState<SocialLinkDto[]>(portfolio.socialLinks || []);
  const [newPlatform, setNewPlatform] = useState('Email');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync state when portfolio changes externally
  React.useEffect(() => {
    if (portfolio.socialLinks) {
      setSocialLinks(portfolio.socialLinks);
    }
  }, [portfolio.socialLinks]);

  const handleStatusChange = (val: string) => {
    onUpdateField('statusText', val.replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·'));
  };

  const handleResumeChange = (val: string) => {
    onUpdateField('resumeUrl', val);
  };

  const handleQuickStatusSelect = (opt: string) => {
    const clean = opt.replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·');
    onUpdateField('statusText', clean);
    onSaveProfile({ statusText: clean });
  };

  const handleAddSocialLink = () => {
    if (!newUrl.trim()) return;

    let cleanUrl = newUrl.trim();
    if (newPlatform === 'Email' && !cleanUrl.startsWith('mailto:') && cleanUrl.includes('@')) {
      cleanUrl = `mailto:${cleanUrl}`;
    } else if (
      newPlatform !== 'Email' &&
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('https://')
    ) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const defaultLabel =
      newLabel.trim() ||
      (newPlatform === 'Email' ? cleanUrl.replace('mailto:', '') : `@${portfolio.username || 'dev'}`);

    const updatedLinks: SocialLinkDto[] = [
      ...socialLinks,
      {
        platform: newPlatform,
        url: cleanUrl,
        label: defaultLabel,
      },
    ];

    setSocialLinks(updatedLinks);
    onUpdateField('socialLinks', updatedLinks);
    onSaveProfile({ socialLinks: updatedLinks });

    setNewUrl('');
    setNewLabel('');
    setShowAddForm(false);
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, idx) => idx !== index);
    setSocialLinks(updatedLinks);
    onUpdateField('socialLinks', updatedLinks);
    onSaveProfile({ socialLinks: updatedLinks });
  };

  const handleUpdateSocialLink = (index: number, patch: Partial<SocialLinkDto>) => {
    const updatedLinks = socialLinks.map((item, idx) => (idx === index ? { ...item, ...patch } : item));
    setSocialLinks(updatedLinks);
    onUpdateField('socialLinks', updatedLinks);
  };

  const handleBlurSocialLink = () => {
    onSaveProfile({ socialLinks });
  };

  return (
    <div className="w-full space-y-5 font-sans select-none pb-8 text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#d6d0c2] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Mail className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
              05 Contact &amp; Connect
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              Kênh liên lạc, CV và mạng lưới kết nối
            </p>
          </div>
        </div>

        {isSaving ? (
          <span className="text-[11px] text-teal-700 flex items-center gap-1 font-medium animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            Lưu...
          </span>
        ) : (
          <span className="text-[11px] text-stone-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Đã đồng bộ
          </span>
        )}
      </div>

      {/* Section 1: Availability Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="field-statusText"
            className="text-[11px] font-semibold text-stone-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Trạng thái làm việc (Status Signal)
          </label>
        </div>

        <input
          id="field-statusText"
          type="text"
          value={(portfolio.statusText || '').replace(/\s*\/\/\s*/g, ' · ').replace(/\/\//g, '·')}
          onChange={(e) => handleStatusChange(e.target.value)}
          onBlur={() => onSaveProfile({ statusText: portfolio.statusText })}
          onFocus={() => onFocusField?.('statusText')}
          placeholder="vd: Available for collaboration · Sẵn sàng hợp tác"
          className={`w-full px-3 py-2 rounded-xl text-xs bg-[#ede8dd]/50 dark:bg-[#080d12] border transition-all text-[#202124] dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-600 outline-none focus:bg-[#fbfaf7] ${
            focusedField === 'statusText'
              ? 'border-teal-600 ring-1 ring-teal-600/20'
              : 'border-[#d6d0c2] dark:border-white/[0.08] hover:border-stone-400 dark:hover:border-white/20'
          }`}
        />

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {QUICK_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleQuickStatusSelect(opt)}
              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[#ede8dd] dark:bg-white/[0.03] hover:bg-teal-500/10 dark:hover:bg-teal-400/10 text-stone-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 border border-[#d6d0c2] dark:border-white/[0.05] transition-colors cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Resume / CV Link */}
      <div className="space-y-2 pt-2 border-t border-[#d6d0c2] dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <label
            htmlFor="field-resumeUrl"
            className="text-[11px] font-semibold text-stone-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
          >
            <FileText className="h-3 w-3 text-stone-400" />
            Liên kết CV / Resume (URL)
          </label>
          {portfolio.resumeUrl && (
            <a
              href={portfolio.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              Xem thử
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>

        <div className="relative">
          <input
            id="field-resumeUrl"
            type="url"
            value={portfolio.resumeUrl || ''}
            onChange={(e) => handleResumeChange(e.target.value)}
            onBlur={() => onSaveProfile({ resumeUrl: portfolio.resumeUrl })}
            onFocus={() => onFocusField?.('resumeUrl')}
            placeholder="https://drive.google.com/... hoặc link direct PDF"
            className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-[#ede8dd]/50 dark:bg-[#080d12] border transition-all text-[#202124] dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-600 outline-none focus:bg-[#fbfaf7] ${
              focusedField === 'resumeUrl'
                ? 'border-teal-600 ring-1 ring-teal-600/20'
                : 'border-[#d6d0c2] dark:border-white/[0.08] hover:border-stone-400 dark:hover:border-white/20'
            }`}
          />
          <Link2 className="h-3.5 w-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[11px] text-stone-500 dark:text-slate-400">
          Khi có link, nút Tải CV sẽ tự động kích hoạt trên slide Contact.
        </p>
      </div>

      {/* Section 3: Social Links & Contact Channels */}
      <div className="space-y-3 pt-2 border-t border-[#d6d0c2] dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Share2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span className="text-[11px] font-semibold text-stone-800 dark:text-slate-300 uppercase tracking-wider">
              Hồ sơ mạng xã hội &amp; Liên hệ
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Thêm kênh</span>
          </button>
        </div>

        {/* Inline Add Form */}
        {showAddForm && (
          <div className="p-3 rounded-xl bg-[#fbfaf7] dark:bg-white/[0.02] border border-[#d6d0c2] dark:border-white/[0.07] shadow-xs space-y-2.5 animate-in fade-in duration-150">
            <div className="text-[11px] font-semibold text-stone-800 dark:text-slate-200">
              Thêm kênh liên lạc mới
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400 block mb-1">Nền tảng</span>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#ede8dd] dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-200 outline-none"
                >
                  {COMMON_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400 block mb-1">Nhãn hiển thị</span>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="vd: @username · Email"
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#ede8dd]/50 focus:bg-[#fbfaf7] dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-200 outline-none placeholder:text-stone-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 dark:text-slate-400 block mb-1">
                Đường dẫn liên kết (URL · Email)
              </span>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={
                  newPlatform === 'Email' ? 'contact@domain.com' : 'https://github.com/username'
                }
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#ede8dd]/50 focus:bg-[#fbfaf7] dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-stone-800 dark:text-slate-200 outline-none placeholder:text-stone-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-stone-600 dark:text-slate-400 hover:bg-[#ede8dd] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer"
              >
                Lưu kênh
              </button>
            </div>
          </div>
        )}

        {/* Existing Social Links List */}
        <div id="field-contact" className="space-y-2">
          {socialLinks.length === 0 ? (
            <div className="py-6 px-3 rounded-xl border border-dashed border-[#d6d0c2] dark:border-white/[0.08] text-center text-stone-400 text-[11px]">
              Chưa có kênh liên lạc nào. Bấm &quot;Thêm kênh&quot; để bổ sung Email, GitHub, LinkedIn...
            </div>
          ) : (
            socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#fbfaf7] dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/[0.06] hover:border-stone-400 dark:hover:border-white/15 transition-all space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ede8dd] dark:bg-white/[0.05] text-stone-700 dark:text-slate-300 uppercase tracking-wider">
                      {link.platform}
                    </span>
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => handleUpdateSocialLink(idx, { label: e.target.value })}
                      onBlur={handleBlurSocialLink}
                      placeholder="Nhãn hiển thị"
                      className="px-1.5 py-0.5 rounded text-xs font-medium text-stone-900 dark:text-white bg-transparent border border-transparent hover:border-[#d6d0c2] dark:hover:border-white/10 focus:border-teal-600 outline-none max-w-[120px] truncate"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.url}
                      className="p-1 rounded text-stone-400 hover:text-teal-600 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      title="Xóa kênh liên lạc"
                      className="p-1 rounded text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdateSocialLink(idx, { url: e.target.value })}
                  onBlur={handleBlurSocialLink}
                  placeholder="URL hoặc Email"
                  className="w-full px-2 py-1 rounded-lg text-[11px] bg-[#ede8dd]/50 dark:bg-white/[0.02] border border-[#d6d0c2] dark:border-white/[0.05] text-stone-700 dark:text-slate-300 outline-none focus:border-teal-600 truncate"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

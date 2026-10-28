'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PortfolioData } from '@/types/portfolio';
import { AuthUser } from '@/lib/auth';
import {
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  Share2,
  Globe,
  Loader2,
  AlertTriangle,
  History,
  UploadCloud,
  Eye,
  Settings,
} from 'lucide-react';

interface StudioHeaderProps {
  portfolio: PortfolioData | null;
  user: AuthUser | null;
  theme: 'dark' | 'light';
  lang: 'vi' | 'en';
  backendOffline?: boolean;
  onRetryConnection?: () => void;
  isUpdatingStatus?: boolean;
  onToggleStatus?: () => void;
  onPublish?: () => void;
  onOpenPreview?: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onCopyLink: () => void;
  copiedLink: boolean;
  onLogout: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSnapshots?: () => void;
  pendingChangesCount?: number;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  portfolio,
  user,
  theme,
  lang,
  backendOffline = false,
  onRetryConnection,
  isUpdatingStatus = false,
  onToggleStatus,
  onPublish,
  onOpenPreview,
  onToggleTheme,
  onToggleLang,
  onCopyLink,
  copiedLink,
  onLogout,
  onOpenCommandPalette,
  onOpenSnapshots,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const username = portfolio?.username || user?.username || 'member';
  const fullName = portfolio?.fullName || user?.fullName || 'Chuyên gia Sáng tạo';
  const isPublished = portfolio?.isPublished ?? true;

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleStatusClick = () => {
    if (onToggleStatus) {
      onToggleStatus();
    } else if (onPublish) {
      onPublish();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-slate-200/80 dark:border-white/[0.07] bg-white/95 dark:bg-[#080d12]/95 backdrop-blur-md transition-colors select-none flex-shrink-0">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-5 h-full flex items-center justify-between gap-3">
        {/* Left: Brand, Middle Dot, User / Deck Title & URL Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
            aria-label="Trang chủ SoodFolio"
          >
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-transform group-hover:scale-105">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="font-extrabold tracking-tight text-xs sm:text-sm text-slate-900 dark:text-white flex-shrink-0">
              SOODFOLIO
            </span>
          </Link>

          <span className="text-slate-300 dark:text-white/20 text-xs">·</span>

          {/* User Name, Title & Copy Link Pill */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[220px] md:max-w-[280px]">
              <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                {fullName}
              </span>
              {portfolio?.title && (
                <>
                  <span className="text-slate-300 dark:text-white/20 text-xs hidden sm:inline">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                    {portfolio.title}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onCopyLink}
              title={`Sao chép link: soodfolio.com/${username}`}
              aria-label={`Sao chép link chia sẻ soodfolio.com/${username}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex-shrink-0"
            >
              <span className="text-teal-600 dark:text-teal-400 font-semibold">soodfolio.com/</span>
              <span>{username}</span>
              {copiedLink ? (
                <Check className="h-3 w-3 text-teal-500" />
              ) : (
                <Copy className="h-3 w-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>



        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Offline Indicator Chip */}
          {backendOffline && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
              title="Chế độ Studio Ngoại tuyến: Không thể kết nối API. Đang lưu tạm trên trình duyệt."
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span className="hidden sm:inline">Chế độ Studio Ngoại tuyến</span>
              {onRetryConnection && (
                <button
                  type="button"
                  onClick={onRetryConnection}
                  aria-label="Thử lại kết nối máy chủ"
                  className="underline hover:text-amber-500 text-xs cursor-pointer ml-1"
                >
                  Thử lại
                </button>
              )}
            </div>
          )}

          {/* Draft / Published Status Chip Button */}
          <button
            type="button"
            onClick={handleStatusClick}
            disabled={isUpdatingStatus}
            aria-label={isPublished ? 'Trạng thái: Công khai (Click để chuyển về Bản nháp)' : 'Trạng thái: Bản nháp (Click để Công khai)'}
            title={
              isPublished
                ? 'Trạng thái: Công khai (Click để chuyển về Bản nháp)'
                : 'Trạng thái: Bản nháp (Click để Công khai)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium border cursor-pointer transition-colors ${
              isPublished
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isUpdatingStatus ? (
              <Loader2 className="h-3 w-3 animate-spin text-current" />
            ) : (
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
            )}
            <span>{isPublished ? 'LIVE' : 'DRAFT'}</span>
          </button>

          {/* Review Preview Button */}
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              aria-label="Mở Sân khấu trình chiếu Preview 16:9"
              title="Mở Sân khấu trình chiếu Preview 16:9"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
              <span className="hidden sm:inline">Xem Preview</span>
            </button>
          )}

          {/* Primary Action: Publish Button (Accent Kinpaku Gold) */}
          {onPublish && (
            <button
              type="button"
              onClick={onPublish}
              disabled={isUpdatingStatus}
              aria-label="Đóng băng snapshot và phát hành bản Live công khai"
              title="Đóng băng snapshot và phát hành bản Live công khai"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all cursor-pointer shadow-sm shadow-amber-500/20 disabled:opacity-50"
            >
              <UploadCloud className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>Phát Hành</span>
            </button>
          )}

          {/* Vùng Chức Năng Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Mở vùng chức năng tập trung"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-all cursor-pointer font-sans font-medium text-xs"
            >
              <div className="h-6 w-6 rounded-md bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center overflow-hidden border border-teal-500/30 flex-shrink-0">
                {portfolio?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portfolio.avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <span>{fullName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="hidden md:inline">Vùng Chức Năng</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200/60 dark:border-white/[0.05] shadow-xs p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5 font-sans">
                {/* User Identity Card */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{fullName}</div>
                  <div className="text-xs font-sans font-medium text-teal-600 dark:text-teal-400 truncate">@{username}</div>
                  {user?.email && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                  )}
                </div>

                <div className="space-y-0.5 pt-1">
                  {/* Copy Live Link */}
                  <button
                    type="button"
                    onClick={() => {
                      onCopyLink();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Copy className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Sao chép liên kết</span>
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Copy</span>
                  </button>

                  {/* View Live */}
                  <Link
                    href={`/preview/${username}`}
                    target="_blank"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      <span>Xem Live công khai</span>
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Mở tab</span>
                  </Link>

                  {/* Snapshot History */}
                  {onOpenSnapshots && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSnapshots();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Lịch sử Snapshot</span>
                      </span>
                      <span className="text-xs text-slate-400 font-sans">SHA-256</span>
                    </button>
                  )}

                  {/* Share Links Manager */}
                  <Link
                    href="/dashboard/links"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="h-3.5 w-3.5 text-teal-500" />
                      <span>Quản lý Share Links</span>
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Telemetry</span>
                  </Link>

                  {/* Theme Switcher Toggle */}
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />}
                      <span>Giao diện</span>
                    </span>
                    <span className="text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
                      {theme === 'dark' ? 'Tối' : 'Sáng'}
                    </span>
                  </button>

                  {/* Language Switcher Toggle */}
                  <button
                    type="button"
                    onClick={onToggleLang}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      <span>Ngôn ngữ Studio</span>
                    </span>
                    <span className="text-xs font-sans font-bold text-teal-600 dark:text-teal-400">
                      {lang.toUpperCase()}
                    </span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

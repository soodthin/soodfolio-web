'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StudioSlideKey, STUDIO_SLIDES } from './types';
import {
  Search,
  Layers,
  ExternalLink,
  Copy,
  Printer,
  Share2,
  Sun,
  Moon,
  Code,
  Maximize2,
  History,
  CheckCircle2,
  ArrowRight,
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
} from 'lucide-react';

interface StudioCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (slide: StudioSlideKey) => void;
  onPublish: () => void;
  onCopyLink: () => void;
  onToggleTheme: () => void;
  onToggleJsonMode: () => void;
  onToggleFullscreen: () => void;
  onOpenSnapshots: () => void;
  username: string;
  theme: 'dark' | 'light';
}

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
};

export const StudioCommandPalette: React.FC<StudioCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSlide,
  onPublish,
  onCopyLink,
  onToggleTheme,
  onToggleJsonMode,
  onToggleFullscreen,
  onOpenSnapshots,
  username,
  theme,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  interface CommandItem {
    id: string;
    label: string;
    category: string;
    icon: React.ElementType;
    shortcut?: string;
    action: () => void;
  }

  const allCommands: CommandItem[] = [
    // Slide Navigation
    ...STUDIO_SLIDES.map((slide) => ({
      id: `slide-${slide.key}`,
      label: `Slide ${slide.number}: ${slide.title}`,
      category: 'Điều Hướng Slide',
      icon: ICON_MAP[slide.iconName] || Layers,
      shortcut: slide.shortcut,
      action: () => {
        onSelectSlide(slide.key);
        onClose();
      },
    })),
    // Actions
    {
      id: 'action-publish',
      label: 'Phát hành Slide Deck (Publish)',
      category: 'Xuất Bản & Chia Sẻ',
      icon: CheckCircle2,
      shortcut: 'P',
      action: () => {
        onPublish();
        onClose();
      },
    },
    {
      id: 'action-copy',
      label: 'Sao chép liên kết công khai',
      category: 'Xuất Bản & Chia Sẻ',
      icon: Copy,
      shortcut: 'Cmd+C',
      action: () => {
        onCopyLink();
        onClose();
      },
    },
    {
      id: 'action-preview',
      label: 'Xem bài thuyết trình Live',
      category: 'Xuất Bản & Chia Sẻ',
      icon: ExternalLink,
      action: () => {
        window.open(`/preview/${username}`, '_blank');
        onClose();
      },
    },
    {
      id: 'action-snapshots',
      label: 'Xem Lịch sử Phiên bản (Snapshots)',
      category: 'Xuất Bản & Chia Sẻ',
      icon: History,
      shortcut: 'S',
      action: () => {
        onOpenSnapshots();
        onClose();
      },
    },
    {
      id: 'action-export-pdf',
      label: 'Xuất hồ sơ Dossier A4 (PDF)',
      category: 'Xuất Bản & Chia Sẻ',
      icon: Printer,
      action: () => {
        window.open(`/export/${username}`, '_blank');
        onClose();
      },
    },
    {
      id: 'action-share-links',
      label: 'Quản lý Targeted Share Links & Heatmap',
      category: 'Xuất Bản & Chia Sẻ',
      icon: Share2,
      action: () => {
        window.location.href = '/dashboard/links';
        onClose();
      },
    },
    // Settings
    {
      id: 'setting-theme',
      label: `Chuyển sang giao diện ${theme === 'dark' ? 'Sáng (Light)' : 'Tối (Dark)'}`,
      category: 'Tuỳ Chỉnh Studio',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'setting-json',
      label: 'Bật/Tắt chế độ JSON Spec',
      category: 'Tuỳ Chỉnh Studio',
      icon: Code,
      shortcut: 'Cmd+J',
      action: () => {
        onToggleJsonMode();
        onClose();
      },
    },
    {
      id: 'setting-fullscreen',
      label: 'Chế độ Trình chiếu Toàn màn hình',
      category: 'Tuỳ Chỉnh Studio',
      icon: Maximize2,
      shortcut: 'F5',
      action: () => {
        onToggleFullscreen();
        onClose();
      },
    },
  ];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm kiếm tác vụ, nhảy tới slide, phát hành... (Gõ để lọc)"
            className="flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-400 border border-slate-200 dark:border-white/10">
            ESC
          </span>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              Không tìm thấy tác vụ phù hợp với &quot;{search}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="truncate">{cmd.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{cmd.category}</div>
                      </div>
                    </div>

                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-400 border border-slate-200 dark:border-white/10 flex-shrink-0 ml-2">
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-black/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Di chuyển</span>
            <span>↵ Chọn</span>
          </div>
          <span className="text-teal-600 dark:text-teal-400 font-medium">SOODFOLIO COMMAND</span>
        </div>
      </div>
    </div>
  );
};

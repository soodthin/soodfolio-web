'use client';

import React, { useState } from 'react';
import { SnapshotItem } from './types';
import {
  History,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface SnapshotHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSnapshot?: (snapshot: SnapshotItem) => void;
  username: string;
}

export const SnapshotHistoryModal: React.FC<SnapshotHistoryModalProps> = ({
  isOpen,
  onClose,
  onRestoreSnapshot,
  username,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  // Realistic mock / stored snapshots matching Phase 1 & 2
  const snapshots: SnapshotItem[] = [
    {
      id: 'snap-3',
      version: 'v1.2.0 (Hiện tại)',
      hash: 'sha256:7f8a3c9b1e4d8a20f1c6e93b2a5d7e8f0c1b4a6d',
      createdAt: '23/10/2026 19:17:42',
      note: 'Cập nhật dự án mới và thông tin định vị cá nhân',
      slidesCount: 5,
    },
    {
      id: 'snap-2',
      version: 'v1.1.0',
      hash: 'sha256:4e9c12a78f0d5b3c2e1a908f7d6e4b1c3a2f8e9d',
      createdAt: '22/10/2026 14:05:18',
      note: 'Phát hành slide kỹ năng và liên kết GitHub',
      slidesCount: 4,
    },
    {
      id: 'snap-1',
      version: 'v1.0.0',
      hash: 'sha256:a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e',
      createdAt: '20/10/2026 09:30:00',
      note: 'Khởi tạo hồ sơ SoodFolio Slide-Deck ban đầu',
      slidesCount: 3,
    },
  ];

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lịch sử phiên bản hồ sơ"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Lịch Sử Phiên Bản & Immutable Snapshots
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mỗi lần phát hành được đóng băng bằng mã băm SHA-256 chống sửa đổi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {snapshots.map((snap, idx) => (
            <div
              key={snap.id}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? 'bg-teal-500/[0.04] border-teal-500/30 ring-1 ring-teal-500/10'
                  : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                    {snap.version}
                  </span>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-sans bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                      Live hiện tại
                    </span>
                  )}
                </div>
                <span className="text-xs font-sans text-slate-400">
                  {snap.createdAt}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                {snap.note}
              </p>

              {/* SHA-256 Hash pill */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.04] text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 truncate max-w-[320px]">
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">SHA:</span>
                  <span className="truncate">{snap.hash}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(snap.hash)}
                    title="Sao chép mã hash SHA-256"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedHash === snap.hash ? (
                      <Check className="h-3 w-3 text-teal-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>

                  {idx !== 0 && onRestoreSnapshot && (
                    <button
                      type="button"
                      onClick={() => onRestoreSnapshot(snap)}
                      className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      <span>Khôi phục</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Hồ sơ nộp qua Targeted Link sẽ giữ nguyên bản snapshot lúc nộp.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

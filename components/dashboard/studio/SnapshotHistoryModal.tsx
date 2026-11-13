'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { fetchWithAuth } from '@/lib/apiClient';
import { API_BASE } from '@/lib/auth';
import {
  ShieldCheck,
  RotateCcw,
  X,
  Plus,
  Loader2,
  Calendar,
  AlertCircle,
  Inbox,
  Check,
} from 'lucide-react';

export interface SnapshotSummary {
  id: string;
  version: number;
  changelog?: string | null;
  createdAt: string;
}

interface SnapshotHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSnapshot?: (portfolio: PortfolioData) => void;
  username?: string;
}

export const SnapshotHistoryModal: React.FC<SnapshotHistoryModalProps> = ({
  isOpen,
  onClose,
  onRestoreSnapshot,
}) => {
  const [snapshots, setSnapshots] = useState<SnapshotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form tạo snapshot thủ công
  const [changelog, setChangelog] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Rollback confirmation state
  const [confirmVersion, setConfirmVersion] = useState<number | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function fetchSnapshots() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetchWithAuth(`${API_BASE}/portfolios/me/snapshots`);
        if (!isMounted) return;
        if (res.ok) {
          const data: SnapshotSummary[] = await res.json();
          const sorted = Array.isArray(data)
            ? [...data].sort((a, b) => b.version - a.version)
            : [];
          setSnapshots(sorted);
        } else {
          setErrorMessage('Không thể tải lịch sử phiên bản từ máy chủ.');
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Không thể kết nối đến máy chủ.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSnapshots();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/snapshots`);
      if (res.ok) {
        const data: SnapshotSummary[] = await res.json();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => b.version - a.version)
          : [];
        setSnapshots(sorted);
      } else {
        setErrorMessage('Không thể tải lịch sử phiên bản từ máy chủ.');
      }
    } catch {
      setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

    try {
      setIsCreating(true);
      setErrorMessage(null);
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/snapshots/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changelog: changelog.trim() || undefined,
        }),
      });

      if (res.ok) {
        setChangelog('');
        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 3000);
        await loadSnapshots();
      } else {
        const errorData = await res.json().catch(() => null);
        setErrorMessage(errorData?.message || 'Không thể tạo bản chụp snapshot.');
      }
    } catch {
      setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRollback = async (version: number) => {
    try {
      setIsRollingBack(true);
      setErrorMessage(null);
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/snapshots/${version}/rollback`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.portfolio && onRestoreSnapshot) {
          onRestoreSnapshot(data.portfolio);
        }
        setConfirmVersion(null);
        onClose();
      } else {
        const err = await res.json().catch(() => null);
        setErrorMessage(err?.message || `Không thể khôi phục về phiên bản v${version}.`);
      }
    } catch {
      setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      setIsRollingBack(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
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
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Lịch Sử Phiên Bản & Immutable Snapshots
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mỗi lần phát hành được đóng băng bất biến chống sửa đổi ngầm
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

        {/* Create Snapshot Form */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] flex-shrink-0">
          <form onSubmit={handleCreateSnapshot} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tạo bản chụp snapshot mới (Changelog)
              </label>
              {createSuccess && (
                <span className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 font-sans font-medium">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  Đã tạo snapshot thành công!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                placeholder="Ghi chú thay đổi (ví dụ: Thêm dự án fintech, sửa bio...)"
                maxLength={255}
                className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={isCreating}
                className="h-9 px-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                {isCreating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                <span>Tạo Snapshot</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="px-5 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body: Snapshots list */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-14 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
              <p className="text-xs font-sans font-medium">Đang tải lịch sử phiên bản...</p>
            </div>
          ) : snapshots.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Chưa có bản chụp snapshot nào
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Nhấn &quot;Tạo Snapshot&quot; ở trên hoặc bấm &quot;Phát Hành&quot; từ Studio để đóng băng phiên bản đầu tiên của bạn.
              </p>
            </div>
          ) : (
            snapshots.map((snap, idx) => {
              const isLatest = idx === 0;
              const isConfirming = confirmVersion === snap.version;

              return (
                <div
                  key={snap.id || snap.version}
                  className={`p-4 rounded-xl border transition-all ${
                    isLatest
                      ? 'bg-teal-500/[0.04] border-teal-500/30 ring-1 ring-teal-500/10'
                      : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                        Phiên bản v{snap.version}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                          Bản mới nhất
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-sans text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(snap.createdAt)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                    {snap.changelog || 'Không có ghi chú thay đổi'}
                  </p>

                  {/* Actions / Rollback */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.04] text-xs">
                    <span className="font-mono text-[11px] text-slate-400">
                      ID: {snap.id ? snap.id.substring(0, 8) : `v${snap.version}`}
                    </span>

                    <div className="flex items-center gap-2">
                      {isConfirming ? (
                        /* Confirmation prompt */
                        <div className="flex items-center gap-2 animate-in fade-in duration-150">
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-sans font-medium">
                            Xác nhận khôi phục?
                          </span>
                          <button
                            type="button"
                            disabled={isRollingBack}
                            onClick={() => handleRollback(snap.version)}
                            className="px-2.5 py-1 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            {isRollingBack ? 'Đang xử lý...' : 'Đồng ý'}
                          </button>
                          <button
                            type="button"
                            disabled={isRollingBack}
                            onClick={() => setConfirmVersion(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-sans font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        !isLatest && (
                          <button
                            type="button"
                            onClick={() => setConfirmVersion(snap.version)}
                            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                            title={`Khôi phục toàn bộ bản nháp về phiên bản v${snap.version}`}
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Khôi phục phiên bản này</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-black/20 flex items-center justify-between text-xs flex-shrink-0">
          <span className="text-[11px] text-slate-400">
            Hồ sơ nộp qua Targeted Link sẽ giữ nguyên bản snapshot lúc nộp.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-sans font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
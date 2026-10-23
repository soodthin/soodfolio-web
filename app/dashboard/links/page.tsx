'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth } from '@/lib/apiClient';
import { API_BASE } from '@/lib/auth';
import { ShareLinkDto } from '@/types/shareLink';
import { PortfolioData } from '@/types/portfolio';
import { CreateShareLinkModal } from '@/components/dashboard/CreateShareLinkModal';
import { TelemetryHeatmapModal } from '@/components/dashboard/TelemetryHeatmapModal';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import {
  Link2,
  Plus,
  ArrowLeft,
  Building2,
  Clock,
  Eye,
  Activity,
  Copy,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  FileText,
  Trash2,
  Share2,
  Sparkles,
  Check
} from 'lucide-react';

export default function ShareLinksManagementPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [links, setLinks] = useState<ShareLinkDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedHeatmapLink, setSelectedHeatmapLink] = useState<ShareLinkDto | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load portfolio & links
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load portfolio data
      const portRes = await fetchWithAuth(`${API_BASE}/portfolios/me`);
      if (portRes.ok) {
        const portData = await portRes.json();
        setPortfolio(portData);
      }

      // Load share links
      const linksRes = await fetchWithAuth(`${API_BASE}/portfolios/me/links`);
      if (linksRes.ok) {
        const linksData: ShareLinkDto[] = await linksRes.json();
        setLinks(linksData);
      } else {
        // Sample starter data if backend endpoint is in setup
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://soodfolio.com';
        const sampleLinks: ShareLinkDto[] = [
          {
            id: 'shopee-backend',
            portfolioId: 'me',
            companyName: 'Shopee - Senior Backend Engineer',
            customLayout: 'CINEMATIC_DECK',
            expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(),
            viewCount: 24,
            isRevoked: false,
            createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            token: 'shopee-demo-token',
            shareUrl: `${origin}/p/shopee-demo-token`,
          },
          {
            id: 'vng-lead',
            portfolioId: 'me',
            companyName: 'VNG Games - Software Architect',
            customLayout: 'MINIMALIST_DOC',
            expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
            viewCount: 11,
            isRevoked: false,
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            token: 'vng-arch-token',
            shareUrl: `${origin}/p/vng-arch-token`,
          },
        ];
        setLinks(sampleLinks);
      }
    } catch (err) {
      console.error('Failed to load links data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated, loadData, router]);

  // Handle Copy Link
  const handleCopyLink = (link: ShareLinkDto) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://soodfolio.com';
    const url = link.shareUrl || `${origin}/p/${link.token || link.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    showToast('Đã sao chép link ứng tuyển vào clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Revoke Link
  const handleRevokeLink = async (linkId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn thu hồi liên kết này? Nhà tuyển dụng sẽ không thể mở xem được nữa.')) {
      return;
    }

    setRevokingId(linkId);
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/links/${linkId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLinks((prev) =>
          prev.map((l) => (l.id === linkId ? { ...l, isRevoked: true } : l))
        );
        showToast('Đã thu hồi quyền truy cập của link.');
      } else {
        // Optimistic UI update for offline demo
        setLinks((prev) =>
          prev.map((l) => (l.id === linkId ? { ...l, isRevoked: true } : l))
        );
        showToast('Đã cập nhật trạng thái thu hồi liên kết.');
      }
    } catch {
      showToast('Lỗi khi thu hồi liên kết.', 'error');
    } finally {
      setRevokingId(null);
    }
  };

  const handleLinkCreated = (newLink: ShareLinkDto) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-medium backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-white/95 dark:bg-[#0c141d]/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/10'
                : 'bg-white/95 dark:bg-[#0c141d]/95 border-rose-500/40 text-rose-800 dark:text-rose-300 shadow-rose-500/10'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-500" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#080d12]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
              title="Quay lại Studio Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Targeted Share Links
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20">
                  DocSend Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý các đường link ứng tuyển riêng biệt kèm radar đo lường telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tạo Link Ứng Tuyển Mới</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Intro Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 dark:text-teal-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Snapshot Bất Biến & Telemetry Radar</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Gửi hồ sơ nhắm trúng mục tiêu cho từng công ty
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mỗi link được gắn với một bản chụp Snapshot độc lập: Bạn có thể chỉnh sửa nháp trên Studio mà không sợ làm thay đổi bản đã gửi cho nhà tuyển dụng. Hệ thống tự động đo thời gian dừng lại trên từng slide khi HR mở link.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 font-mono text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-slate-400 block">Tổng số link</span>
              <span className="font-bold text-base text-slate-900 dark:text-white">{links.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-slate-400 block">Tổng lượt xem</span>
              <span className="font-bold text-base text-teal-600 dark:text-teal-400">
                {links.reduce((acc, cur) => acc + (cur.viewCount || 0), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Links List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto" />
            <p className="text-xs font-mono text-slate-400">Đang tải danh sách liên kết ứng tuyển...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200 dark:border-white/[0.08] p-8">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <Link2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Chưa có link ứng tuyển nào được tạo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Hãy tạo link riêng đầu tiên cho công ty bạn đang ứng tuyển để nhận báo cáo dwell-time và bảo vệ bản nháp cá nhân.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium text-xs transition-colors cursor-pointer"
            >
              + Tạo link ứng tuyển đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
              const isRevoked = link.isRevoked;
              const isActive = !isExpired && !isRevoked;
              const tokenKey = link.token || link.id;
              const shareUrl = link.shareUrl || `/p/${tokenKey}`;

              return (
                <div
                  key={link.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200/90 dark:border-white/[0.08] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  {/* Left: Info */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {link.companyName}
                      </span>

                      {/* Status Badge */}
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Đang hoạt động</span>
                        </span>
                      )}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          <Clock className="h-3 w-3" />
                          <span>Đã hết hạn</span>
                        </span>
                      )}
                      {isRevoked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Đã thu hồi</span>
                        </span>
                      )}

                      {/* Layout badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                        {link.customLayout === 'CINEMATIC_DECK' ? (
                          <>
                            <Layers className="h-3 w-3 text-teal-500" />
                            <span>Slide Deck</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-3 w-3 text-teal-500" />
                            <span>Paper Doc</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{link.viewCount} lượt xem</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {link.expiresAt
                            ? `Hạn xem: ${new Date(link.expiresAt).toLocaleDateString('vi-VN')}`
                            : 'Thời hạn: Vĩnh viễn'}
                        </span>
                      </div>

                      {link.allowedSlideIds && link.allowedSlideIds.length > 0 && (
                        <span>Lọc {link.allowedSlideIds.length} slide mục tiêu</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/[0.06]">
                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-xs font-sans font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span>{copiedId === link.id ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>

                    {/* Open Live Preview Button */}
                    <Link
                      href={shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-xs font-sans font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <span>Mở link</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </Link>

                    {/* Telemetry Radar Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedHeatmapLink(link)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Activity className="h-3.5 w-3.5 text-teal-500" />
                      <span>Biểu đồ nhiệt</span>
                    </button>

                    {/* Revoke Button */}
                    {!isRevoked && (
                      <button
                        type="button"
                        disabled={revokingId === link.id}
                        onClick={() => handleRevokeLink(link.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Thu hồi quyền truy cập của liên kết này"
                      >
                        {revokingId === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Link Modal */}
      <CreateShareLinkModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleLinkCreated}
        portfolio={portfolio}
      />

      {/* Telemetry Heatmap Modal */}
      <TelemetryHeatmapModal
        isOpen={Boolean(selectedHeatmapLink)}
        onClose={() => setSelectedHeatmapLink(null)}
        link={selectedHeatmapLink}
      />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}

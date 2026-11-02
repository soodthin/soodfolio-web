'use client';

export const dynamic = 'force-dynamic';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { MinimalistPaperDoc } from '@/components/deck/MinimalistPaperDoc';
import { useDeckTelemetry } from '@/hooks/useDeckTelemetry';
import { PublicShareLinkData, TemplateLayout } from '@/types/shareLink';
import { PortfolioData } from '@/types/portfolio';
import {
  Layers,
  FileText,
  AlertCircle,
  Clock,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function TargetedDeckViewerPage({ params }: PageProps) {
  const { token } = use(params);

  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<'not_found' | 'expired' | 'revoked' | 'network_error' | null>(null);
  const [linkData, setLinkData] = useState<PublicShareLinkData | null>(null);
  const [layout, setLayout] = useState<TemplateLayout>('CINEMATIC_DECK');
  const [activeSlideKey, setActiveSlideKey] = useState<string>('hero');

  // Activate telemetry tracking
  useDeckTelemetry(token, activeSlideKey);

  // Fetch targeted share link snapshot
  useEffect(() => {
    let isMounted = true;

    async function fetchShareLink() {
      try {
        setLoading(true);
        setErrorStatus(null);

        const res = await fetch(`${API_BASE}/public/links/${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });

        if (res.status === 404) {
          if (isMounted) setErrorStatus('not_found');
          return;
        }

        if (res.status === 410) {
          if (isMounted) setErrorStatus('expired');
          return;
        }

        if (res.status === 403) {
          if (isMounted) setErrorStatus('revoked');
          return;
        }

        if (!res.ok) {
          if (isMounted) setErrorStatus('network_error');
          return;
        }

        const data = await res.json();
        
        // Handle variations in backend response format
        const portfolioPayload: PortfolioData = data.portfolio || data.snapshotData || data.snapshot || data;
        
        const normalizedData: PublicShareLinkData = {
          companyName: data.companyName || 'Nhà Tuyển Dụng',
          customLayout: data.customLayout || 'CINEMATIC_DECK',
          allowedSlideIds: data.allowedSlideIds || null,
          expiresAt: data.expiresAt || null,
          isExpired: Boolean(data.isExpired),
          isRevoked: Boolean(data.isRevoked),
          portfolio: portfolioPayload,
        };

        if (normalizedData.isExpired) {
          if (isMounted) setErrorStatus('expired');
          return;
        }

        if (normalizedData.isRevoked) {
          if (isMounted) setErrorStatus('revoked');
          return;
        }

        if (isMounted) {
          setLinkData(normalizedData);
          setLayout(normalizedData.customLayout);
        }
      } catch (err) {
        console.error('Failed to load targeted share link:', err);
        if (isMounted) setErrorStatus('network_error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (token) {
      fetchShareLink();
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#080d12] text-slate-300 font-sans p-4 gap-4">
        <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-white tracking-wide">Đang mở hồ sơ ứng tuyển...</h2>
          <p className="text-xs font-mono text-slate-500">Đang giải mã bản chụp snapshot bất biến an toàn</p>
        </div>
      </div>
    );
  }

  // Error States: Expired / Revoked / Not Found
  if (errorStatus || !linkData || !linkData.portfolio) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#080d12] text-slate-200 font-sans p-6">
        <div className="max-w-md w-full rounded-2xl bg-[#0c141d] border border-white/10 p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center border">
            {errorStatus === 'expired' && (
              <div className="h-full w-full rounded-2xl bg-amber-500/10 border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Clock className="h-7 w-7" />
              </div>
            )}
            {errorStatus === 'revoked' && (
              <div className="h-full w-full rounded-2xl bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="h-7 w-7" />
              </div>
            )}
            {(errorStatus === 'not_found' || errorStatus === 'network_error' || !errorStatus) && (
              <div className="h-full w-full rounded-2xl bg-teal-500/10 border-teal-500/30 text-teal-400 flex items-center justify-center">
                <AlertCircle className="h-7 w-7" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">
              {errorStatus === 'expired' && 'Liên kết ứng tuyển đã hết hạn'}
              {errorStatus === 'revoked' && 'Liên kết đã bị thu hồi'}
              {errorStatus === 'not_found' && 'Không tìm thấy liên kết ứng tuyển'}
              {errorStatus === 'network_error' && 'Không thể kết nối đến máy chủ'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorStatus === 'expired' &&
                'Thời hạn xem hồ sơ này đã kết thúc theo cấu hình bảo mật của ứng viên. Vui lòng liên hệ trực tiếp với ứng viên để nhận liên kết mới.'}
              {errorStatus === 'revoked' &&
                'Ứng viên đã chủ động đóng quyền truy cập của liên kết này.'}
              {errorStatus === 'not_found' &&
                'Mã token không hợp lệ hoặc đã bị xóa khỏi hệ thống SoodFolio.'}
              {errorStatus === 'network_error' &&
                'Vui lòng kiểm tra lại kết nối mạng của bạn và tải lại trang.'}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Về trang chủ SoodFolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter portfolio content according to allowedSlideIds (Selective Slides)
  const rawPortfolio = linkData.portfolio;
  const allowedIds = linkData.allowedSlideIds;

  const filteredPortfolio: PortfolioData = {
    ...rawPortfolio,
    projects:
      allowedIds && allowedIds.length > 0
        ? rawPortfolio.projects?.filter((p) => allowedIds.includes(p.id)) || []
        : rawPortfolio.projects || [],
    experiences:
      allowedIds && allowedIds.length > 0
        ? rawPortfolio.experiences?.filter((e) => allowedIds.includes(e.id)) || []
        : rawPortfolio.experiences || [],
  };

  const toggleLayout = () => {
    setLayout((prev) => (prev === 'CINEMATIC_DECK' ? 'MINIMALIST_DOC' : 'CINEMATIC_DECK'));
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Top Banner: Target Company & Layout Switcher (Floating Bar) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#0c141d]/90 border border-slate-700/60 dark:border-white/15 backdrop-blur-md shadow-2xl text-xs print:hidden animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700 dark:border-white/10">
          <Building2 className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
          <span className="font-semibold text-white truncate max-w-[130px] sm:max-w-[220px]">
            Dành cho: {linkData.companyName}
          </span>
        </div>

        {/* Layout Toggle Button */}
        <button
          type="button"
          onClick={toggleLayout}
          aria-label="Chuyển đổi kiểu giao diện xem"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-all cursor-pointer"
          title="Bấm để chuyển đổi giữa Trình Chiếu Slide và Văn Bản Tài Liệu"
        >
          {layout === 'CINEMATIC_DECK' ? (
            <>
              <FileText className="h-3 w-3" />
              <span>Chuyển sang Bản Văn Bản</span>
            </>
          ) : (
            <>
              <Layers className="h-3 w-3" />
              <span>Chuyển sang Slide Deck</span>
            </>
          )}
        </button>
      </div>

      {/* Render Active Template */}
      {layout === 'CINEMATIC_DECK' ? (
        <div className="w-full">
          <VerticalStackDeck data={filteredPortfolio} variant={filteredPortfolio.themeConfig} />
        </div>
      ) : (
        <div className="w-full">
          <MinimalistPaperDoc
            portfolio={filteredPortfolio}
            companyName={linkData.companyName}
            onSwitchLayout={toggleLayout}
            activeLayout="MINIMALIST_DOC"
          />
        </div>
      )}
    </div>
  );
}

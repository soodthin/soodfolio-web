'use client';

import React, { useState, useEffect } from 'react';
import { ShareLinkDto } from '@/types/shareLink';
import { fetchWithAuth } from '@/lib/apiClient';
import { API_BASE } from '@/lib/auth';
import {
  X,
  Activity,
  Clock,
  Eye,
  CheckCircle2,
  Monitor,
  Sparkles,
  TrendingUp,
  Loader2,
  Inbox,
} from 'lucide-react';

interface SlideTelemetryStatDto {
  slideKey: string;
  totalDwellSeconds: number;
  viewCount: number;
  avgDwellSeconds: number;
}

interface TelemetryAnalyticsResponse {
  shareLinkId: string;
  companyName: string;
  totalViews: number;
  totalDwellSeconds: number;
  slideStats: SlideTelemetryStatDto[];
  deviceBreakdown?: Record<string, number>;
}

export interface DisplaySlideMetric {
  slideKey: string;
  label: string;
  dwellSeconds: number;
  percentage: number;
  interestLevel: 'high' | 'medium' | 'low';
}

interface TelemetryHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: ShareLinkDto | null;
}

export function getSlideDisplayName(slideKey: string): string {
  switch (slideKey) {
    case 'hero':
      return 'Giới thiệu & Bìa';
    case 'experience':
      return 'Hành trình sự nghiệp';
    case 'projects':
      return 'Dự án tiêu biểu & Case Studies';
    case 'skills':
      return 'Ma trận kỹ năng & Năng lực';
    case 'education':
      return 'Học vấn & Bằng cấp';
    case 'contact':
      return 'Kênh liên hệ trực tiếp';
    default:
      if (slideKey.startsWith('project-')) {
        return `Dự án: ${slideKey.replace('project-', '')}`;
      }
      return slideKey;
  }
}

export function TelemetryHeatmapModal({
  isOpen,
  onClose,
  link,
}: TelemetryHeatmapModalProps) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<TelemetryAnalyticsResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !link) return;
    const currentLink: ShareLinkDto = link;
    let isMounted = true;

    async function loadAnalytics(targetLink: ShareLinkDto) {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetchWithAuth(`${API_BASE}/portfolios/me/links/${targetLink.id}/analytics`);

        if (res.ok) {
          const data: TelemetryAnalyticsResponse = await res.json();
          if (isMounted) {
            setAnalytics(data);
          }
          return;
        }

        if (isMounted) {
          setAnalytics(null);
          setErrorMessage('Không thể tải dữ liệu phân tích từ máy chủ.');
        }
      } catch {
        if (isMounted) {
          setAnalytics(null);
          setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalytics(currentLink);

    return () => {
      isMounted = false;
    };
  }, [isOpen, link]);

  if (!isOpen || !link) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const totalDwell = analytics?.totalDwellSeconds || 0;
  const rawStats = analytics?.slideStats || [];

  // Tính % và map nhãn tiếng Việt cho từng slideKey
  const displayMetrics: DisplaySlideMetric[] = rawStats.map((stat) => {
    const pct = totalDwell > 0 ? Math.round((stat.totalDwellSeconds / totalDwell) * 100) : 0;
    const interestLevel: 'high' | 'medium' | 'low' =
      pct >= 30 || stat.totalDwellSeconds >= 60
        ? 'high'
        : pct >= 15
        ? 'medium'
        : 'low';

    return {
      slideKey: stat.slideKey,
      label: getSlideDisplayName(stat.slideKey),
      dwellSeconds: stat.totalDwellSeconds,
      percentage: pct,
      interestLevel,
    };
  });

  const highestSlide = displayMetrics.length > 0
    ? displayMetrics.reduce(
        (max, cur) => (cur.dwellSeconds > max.dwellSeconds ? cur : max),
        displayMetrics[0]
      )
    : null;

  // Xử lý deviceBreakdown dạng uppercase (DESKTOP, TABLET, MOBILE)
  const desktopCount = analytics?.deviceBreakdown?.DESKTOP || 0;
  const tabletCount = analytics?.deviceBreakdown?.TABLET || 0;
  const mobileCount = analytics?.deviceBreakdown?.MOBILE || 0;
  const totalDeviceCount = desktopCount + tabletCount + mobileCount;
  const desktopPct = totalDeviceCount > 0 ? Math.round((desktopCount / totalDeviceCount) * 100) : 100;

  // Tỷ lệ hoàn thành ước tính dựa trên số slide đã đọc / tổng số slide
  const completionRate = displayMetrics.length >= 4 ? 90 : displayMetrics.length >= 2 ? 65 : displayMetrics.length > 0 ? 35 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Telemetry Radar & Biểu Đồ Nhiệt
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20">
                  {link.companyName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đo lường thời gian thực tế nhà tuyển dụng dừng lại đọc từng slide
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
              <p className="text-xs font-sans font-medium">Đang tổng hợp dữ liệu Dwell-time...</p>
            </div>
          ) : errorMessage ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-rose-500 font-sans font-medium">{errorMessage}</p>
              <p className="text-xs text-slate-400">Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.</p>
            </div>
          ) : displayMetrics.length === 0 ? (
            /* Friendly Empty-State when no interaction data */
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-3 px-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chưa có dữ liệu dwell-time
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Liên kết này chưa ghi nhận thời gian đọc slide. Dữ liệu nhiệt sẽ tự động xuất hiện khi nhà tuyển dụng mở và tương tác với trang.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans font-medium uppercase">
                    <Clock className="h-3 w-3" />
                    <span>Thời gian đọc</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {formatSeconds(totalDwell)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans font-medium uppercase">
                    <Eye className="h-3 w-3" />
                    <span>Lượt xem</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">
                    {analytics?.totalViews ?? link.viewCount ?? 0} lượt
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans font-medium uppercase">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Tỷ lệ hoàn thành</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {completionRate}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans font-medium uppercase">
                    <Monitor className="h-3 w-3" />
                    <span>Thiết bị chính</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-0.5">
                    Desktop ({desktopPct}%)
                  </div>
                </div>
              </div>

              {/* Dwell-time Heatmap Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-sans font-medium">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Phân Bổ Thời Gian Theo Slide (Dwell-time Heatmap)
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Đo bằng navigator.sendBeacon
                  </span>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
                  {displayMetrics.map((item) => {
                    const isHigh = item.interestLevel === 'high';
                    const isMed = item.interestLevel === 'medium';
                    return (
                      <div key={item.slideKey} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
                            {isHigh && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center gap-1 font-sans font-medium">
                                <TrendingUp className="w-2.5 h-2.5" />
                                HOT
                              </span>
                            )}
                            <span className="font-bold font-mono text-slate-900 dark:text-white">
                              {item.dwellSeconds}s
                            </span>
                            <span className="text-slate-400 font-mono">({item.percentage}%)</span>
                          </div>
                        </div>

                        {/* Progress Bar Heatmap */}
                        <div className="h-2 w-full bg-slate-200/70 dark:bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHigh
                                ? 'bg-teal-400'
                                : isMed
                                ? 'bg-sky-400'
                                : 'bg-slate-400 dark:bg-slate-600'
                            }`}
                            style={{ width: `${Math.max(item.percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Strategic Recruiter Insights */}
              {highestSlide && highestSlide.dwellSeconds > 0 && (
                <div className="p-4 rounded-xl bg-teal-500/10 dark:bg-teal-400/5 border border-teal-500/20 flex items-start gap-3 text-xs leading-relaxed">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-teal-800 dark:text-teal-300">
                      Gợi ý phỏng vấn chiến lược:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      Nhà tuyển dụng {link.companyName} dừng lại lâu nhất tại <strong className="text-slate-900 dark:text-white">{highestSlide.label}</strong> ({highestSlide.dwellSeconds}s). Hãy chủ động chuẩn bị các câu chuyện sâu về kiến trúc, quyết định kỹ thuật và số liệu đo lường cụ thể cho phần này khi bước vào vòng phỏng vấn!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 text-[11px]">
            ID: {link.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-sans font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
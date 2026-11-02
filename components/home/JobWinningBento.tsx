'use client';

import React, { useState } from 'react';
import { Link2, ShieldCheck, BarChart3, Download, Copy, Check, Lock, Sparkles, Clock, FileCheck } from 'lucide-react';
import Link from 'next/link';

interface JobWinningBentoProps {
  theme: 'dark' | 'light';
  lang: 'en' | 'vi';
}

export function JobWinningBento({ theme, lang }: JobWinningBentoProps) {
  const isDark = theme === 'dark';
  const [copiedLink, setCopiedLink] = useState(false);
  const [targetCompany, setTargetCompany] = useState('shopee');

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section
      id="bento"
      className={`py-20 md:py-28 border-b transition-colors ${
        isDark ? 'bg-[#080D12] border-white/10' : 'bg-[#FAFCFC] border-slate-200'
      }`}
      data-purpose="job-winning-bento"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-sans font-medium text-xs uppercase tracking-wider mb-3">
            <span>THE JOB-WINNING BENTO</span>
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            {lang === 'en'
              ? '4 UNFAIR ADVANTAGES WHEN PASTING YOUR LINK INTO CV.'
              : '4 VŨ KHÍ TỐI THƯỢNG KHI GẮN LINK PORTFOLIO VÀO CV.'}
          </h2>
          <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'en'
              ? 'Traditional PDFs are black boxes. SoodFolio turns every application link into a tracked, protected, and unforgettable career presentation.'
              : 'File PDF truyền thống là một chiếc hộp đen. SoodFolio biến mỗi đường link nộp việc thành một sân khấu thuyết trình được bảo vệ và đo lường từng giây.'}
          </p>
        </div>

        {/* 
          BENTO GRID: 4 TASTEFUL BOXES 
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* =========================================================================
              BOX 1 (LARGE - 7 Cols): Targeted Share Links
          ========================================================================== */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-sans font-bold text-xs">
                    01
                  </div>
                  <span className="font-sans font-medium text-xs uppercase tracking-wider text-teal-400">
                    {lang === 'en' ? 'TARGETED SHARE LINKS' : 'LINK ĐỘC QUYỀN TỪNG CÔNG TY'}
                  </span>
                </div>
                <span className="text-[11px] font-sans font-medium text-slate-400">
                  {lang === 'en' ? '1-Click Vanity Generator' : 'Tạo link tức thì'}
                </span>
              </div>

              <h3 className={`mt-5 text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'en'
                  ? 'Generate custom vanity URLs per dream company.'
                  : 'Tạo link cá nhân hóa cho từng công ty mục tiêu.'}
              </h3>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'en'
                  ? 'Paste soodfolio.com/p/shopee or soodfolio.com/p/vng directly into your PDF resume. Track individual company views without leaking stats across recruiters.'
                  : 'Gắn link riêng biệt như soodfolio.com/p/shopee hoặc soodfolio.com/p/vng vào CV. Theo dõi chính xác công ty nào đã mở mà không làm lộ dữ liệu giữa các bên.'}
              </p>

              {/* Interactive Mock Link Switcher */}
              <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex flex-wrap gap-2 text-xs font-sans font-medium mb-3">
                  {(['shopee', 'vng', 'grab', 'linear'] as const).map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setTargetCompany(comp)}
                      className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors cursor-pointer border ${
                        targetCompany === comp
                          ? 'bg-teal-400 text-slate-950 border-teal-400 font-semibold'
                          : isDark
                          ? 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      @{comp}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between font-mono text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#080d12] text-slate-900 dark:text-white">
                  <span data-testid="bento-target-link" className="text-teal-600 dark:text-teal-400 truncate">
                    https://soodfolio.com/p/{targetCompany}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`https://soodfolio.com/p/${targetCompany}`)}
                    className="ml-2 flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 font-sans font-medium"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 font-medium">
                <Lock className="w-3 h-3" />
                <span>Password Protection &amp; Self-Destruct Supported</span>
              </span>
            </div>
          </div>

          {/* =========================================================================
              BOX 2 (SMALL - 5 Cols): Immutable Snapshot Engine
          ========================================================================== */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center space-x-2 pb-4 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-sans font-bold text-xs">
                  02
                </div>
                <span className="font-sans font-medium text-xs uppercase tracking-wider text-teal-400">
                  {lang === 'en' ? 'IMMUTABLE SNAPSHOT' : 'ĐÓNG BĂNG PHIÊN BẢN'}
                </span>
              </div>

              <h3 className={`mt-5 text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'en'
                  ? 'SHA-256 Signed Release Commits'
                  : 'Bảo vệ phiên bản với khóa SHA-256'}
              </h3>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'en'
                  ? 'Lock your portfolio state at submission time. Update new projects later without accidentally changing what hiring managers are actively reviewing.'
                  : 'Nộp lúc nào giữ nguyên lúc đó. Bạn thoải mái cập nhật dự án mới mà không sợ làm thay đổi phiên bản nhà tuyển dụng đang chấm.'}
              </p>

              {/* SHA Hash Pill Badge */}
              <div className={`mt-5 p-3 rounded-xl border font-mono text-xs space-y-1.5 ${isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>LOCKED AT COMMIT</span>
                  <span className="text-emerald-400 font-bold">● VERIFIED</span>
                </div>
                <div className="text-slate-300 font-mono text-[11px] truncate">
                  sha256: 8f92a10b4c81...7e2d
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Never breaks mid-interview review' : 'Không lo gãy link hay sửa nhầm'}
            </div>
          </div>

          {/* =========================================================================
              BOX 3 (SMALL - 5 Cols): Dwell-time Telemetry
          ========================================================================== */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center space-x-2 pb-4 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-sans font-bold text-xs">
                  03
                </div>
                <span className="font-sans font-medium text-xs uppercase tracking-wider text-teal-400">
                  {lang === 'en' ? 'DWELL-TIME TELEMETRY' : 'ĐO LƯỜNG THỜI GIAN ĐỌC'}
                </span>
              </div>

              <h3 className={`mt-5 text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'en'
                  ? 'Slide-by-slide recruiter attention heatmaps.'
                  : 'Đo lường chi tiết số giây đọc từng slide.'}
              </h3>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'en'
                  ? 'Discover which case studies captivate decision-makers and where recruiters linger before calling you in for an interview.'
                  : 'Biết chính xác case study nào khiến sếp công nghệ hứng thú nhất và phần nào giữ chân họ lâu nhất trước khi gửi lời mời phỏng vấn.'}
              </p>

              {/* Mini Horizontal Bar Chart */}
              <div className="mt-5 space-y-2.5 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Slide 01: Profile Overview</span>
                    <span className="text-slate-600 dark:text-slate-300">15s</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-slate-400 dark:bg-slate-400 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Slide 02: Flagship Case Study</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">75s (High Dwell)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-teal-500 dark:bg-teal-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Slide 03: Distributed Architecture</span>
                    <span className="text-slate-600 dark:text-slate-300">40s</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-slate-400 dark:bg-slate-400 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] text-xs font-mono text-slate-500 dark:text-slate-400">
              {lang === 'en' ? 'Instant push notification on first open' : 'Báo ngay khi nhà tuyển dụng mở link'}
            </div>
          </div>

          {/* =========================================================================
              BOX 4 (LARGE - 7 Cols): Instant Publish & Export
          ========================================================================== */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-sans font-bold text-xs">
                    04
                  </div>
                  <span className="font-sans font-medium text-xs uppercase tracking-wider text-teal-400">
                    {lang === 'en' ? 'INSTANT PUBLISH & EXPORT' : 'XUẤT BẢN TRONG 3 PHÚT & XUẤT PDF'}
                  </span>
                </div>
                <span className="text-[11px] font-sans font-medium text-teal-400">
                  READY IN 180s
                </span>
              </div>

              <h3 className={`mt-5 text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'en'
                  ? 'One profile. Two formats. Zero friction.'
                  : 'Một lần nhập liệu. Hai định dạng. Không rườm rà.'}
              </h3>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'en'
                  ? 'Fill your technical milestones in minutes. SoodFolio automatically formats both an unboxed interactive presentation deck and a clean, 1-page ATS-parseable PDF dossier for printing.'
                  : 'Điền các dấu mốc sự nghiệp trong tích tắc. SoodFolio tự động tạo cả bài thuyết trình trình chiếu ấn tượng và bản PDF in ấn chuẩn A4 ATS-friendly cho bạn.'}
              </p>

              {/* Feature Highlights Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-2 text-teal-400 font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant Live Presentation</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Interactive 16:9 slides with sub-50ms latency CDN delivery.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-2 text-teal-400 font-semibold mb-1">
                    <FileCheck className="w-4 h-4" />
                    <span>Print-Ready A4 Dossier</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Export high-DPI PDF resume tailored for traditional corporate recruiters.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">100% Free Forever for Creators</span>
              <Link
                href="/register"
                className="text-teal-400 hover:text-teal-300 font-sans font-medium flex items-center space-x-1 cursor-pointer"
              >
                <span>Get Started Now →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

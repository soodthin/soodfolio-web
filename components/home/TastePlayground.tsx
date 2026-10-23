'use client';

import React, { useState } from 'react';
import { Sliders, Monitor, FileText, Check, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TastePlaygroundProps {
  theme: 'dark' | 'light';
  lang: 'en' | 'vi';
}

type LayoutMode = 'deck' | 'cv';
type AccentColor = 'teal' | 'indigo' | 'emerald' | 'monochrome';
type FontFamily = 'inter' | 'outfit' | 'mono';

const ACCENTS: Record<
  AccentColor,
  { label: string; bg: string; text: string; border: string; hex: string }
> = {
  teal: {
    label: 'Ruza Teal',
    bg: 'bg-teal-400',
    text: 'text-teal-400',
    border: 'border-teal-400',
    hex: '#2DD4BF',
  },
  indigo: {
    label: 'Indigo Electric',
    bg: 'bg-indigo-400',
    text: 'text-indigo-400',
    border: 'border-indigo-400',
    hex: '#818CF8',
  },
  emerald: {
    label: 'Terminal Emerald',
    bg: 'bg-emerald-400',
    text: 'text-emerald-400',
    border: 'border-emerald-400',
    hex: '#34D399',
  },
  monochrome: {
    label: 'Quiet Monochrome',
    bg: 'bg-slate-200',
    text: 'text-slate-200',
    border: 'border-slate-200',
    hex: '#E2E8F0',
  },
};

const FONTS: Record<FontFamily, { label: string; className: string }> = {
  inter: { label: 'Inter', className: 'font-sans' },
  outfit: { label: 'Outfit', className: 'font-sans tracking-tight' },
  mono: { label: 'JetBrains Mono', className: 'font-mono' },
};

export function TastePlayground({ theme, lang }: TastePlaygroundProps) {
  const isDark = theme === 'dark';
  const [layout, setLayout] = useState<LayoutMode>('deck');
  const [accent, setAccent] = useState<AccentColor>('teal');
  const [font, setFont] = useState<FontFamily>('inter');

  const activeAccent = ACCENTS[accent];
  const activeFont = FONTS[font];

  return (
    <section
      id="playground"
      className={`py-20 md:py-28 border-b transition-colors ${
        isDark ? 'bg-[#080D12] border-white/10' : 'bg-[#FAFCFC] border-slate-200'
      }`}
      data-purpose="taste-playground"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-sans font-medium text-xs uppercase tracking-wider mb-3">
              <Sliders className="w-3.5 h-3.5 mr-1" />
              <span>{lang === 'en' ? 'TASTE PLAYGROUND' : 'BỘ TINH CHỈNH PHONG CÁCH'}</span>
            </div>
            <h2
              className={`text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {lang === 'en'
                ? 'TEST-DRIVE YOUR SIGNATURE AESTHETIC.'
                : 'THỬ NGHIỆM GU THẨM MỸ CỦA RIÊNG BẠN.'}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Toggle layouts, accent colors, and typography in real-time. What you see is exactly what your hiring team interacts with.'
                : 'Gạt đổi bố cục, bảng màu và phông chữ trực tiếp. Những gì bạn thấy là chính xác những gì nhà tuyển dụng sẽ trải nghiệm.'}
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center space-x-2 text-xs font-sans font-medium text-teal-400 hover:text-teal-300 group cursor-pointer"
          >
            <span>{lang === 'en' ? 'Create with this style' : 'Khởi tạo theo phong cách này'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 
          PLAYGROUND CONTROL BAR (Floating Toolbar)
        */}
        <div
          className={`p-3 sm:p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 mb-8 transition-colors ${
            isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          {/* 1. Layout Mode Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              {lang === 'en' ? 'Layout:' : 'Bố cục:'}
            </span>
            <div className={`p-0.5 rounded-lg border flex space-x-1 ${isDark ? 'border-white/10 bg-[#080D12]' : 'border-slate-200 bg-slate-50'}`}>
              <button
                type="button"
                data-testid="layout-deck"
                onClick={() => setLayout('deck')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  layout === 'deck'
                    ? 'bg-teal-400 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Slide Deck' : 'Slide Điện Ảnh'}</span>
              </button>

              <button
                type="button"
                data-testid="layout-cv"
                onClick={() => setLayout('cv')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  layout === 'cv'
                    ? 'bg-teal-400 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Minimalist CV' : 'Bản In CV Tối Giản'}</span>
              </button>
            </div>
          </div>

          {/* 2. Color Accent Picker */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider hidden sm:inline">
              {lang === 'en' ? 'Accent:' : 'Màu nhấn:'}
            </span>
            <div className="flex items-center space-x-2">
              {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
                const item = ACCENTS[key];
                const isSelected = accent === key;
                return (
                  <button
                    key={key}
                    type="button"
                    title={item.label}
                    onClick={() => setAccent(key)}
                    style={{ backgroundColor: item.hex }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0C131A] scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Font Family Picker */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider hidden md:inline">
              {lang === 'en' ? 'Font:' : 'Phông chữ:'}
            </span>
            <div className={`p-0.5 rounded-lg border flex space-x-1 ${isDark ? 'border-white/10 bg-[#080D12]' : 'border-slate-200 bg-slate-50'}`}>
              {(Object.keys(FONTS) as FontFamily[]).map((key) => {
                const item = FONTS[key];
                const isSelected = font === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFont(key)}
                    className={`px-2.5 py-1 rounded text-xs font-sans font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-white/10 text-white font-semibold'
                          : 'bg-white text-slate-950 shadow-xs font-semibold'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 
          LIVE INTERACTIVE PLAYGROUND CANVAS 
        */}
        <div
          className={`rounded-2xl border p-6 sm:p-10 transition-all duration-200 ${
            isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
          } ${activeFont.className}`}
        >
          {layout === 'deck' ? (
            /* =========================================================================
               LAYOUT A: 16:9 CINEMATIC SLIDE DECK
            ========================================================================== */
            <div className="space-y-6">
              {/* Slide Meta Bar */}
              <div
                className={`flex flex-wrap items-center justify-between pb-4 border-b text-xs font-mono ${
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${activeAccent.bg}`} />
                  <span className={`${activeAccent.text} uppercase tracking-widest font-semibold`}>
                    SLIDE 03 • ARCHITECTURE & METRICS
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span>PRESENTER: ALEXA CHEN</span>
                  <span className="opacity-40">•</span>
                  <span className="text-slate-400">SERIES B PRINCIPAL PM</span>
                </div>
              </div>

              {/* Slide Core Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                <div className="lg:col-span-7 space-y-4">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono border ${
                      isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className={activeAccent.text}>Core Initiative • Global Expansion</span>
                  </div>

                  <h3
                    className={`text-2xl sm:text-4xl font-bold tracking-tight leading-snug ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {lang === 'en'
                      ? 'Scaled self-serve payments to 42 countries under 180 days.'
                      : 'Mở rộng cổng thanh toán tự phục vụ sang 42 quốc gia trong 180 ngày.'}
                  </h3>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Orchestrated localized payment routing, FX compliance engines, and automated billing fallback pipelines. Drove $4.2M in net-new ARR.'
                      : 'Điều phối luồng thanh toán bản địa hóa, tuân thủ pháp lý đa tiền tệ và cơ chế dự phòng thanh toán tự động. Tạo ra thêm $4.2M ARR ròng.'}
                  </p>

                  {/* 3 Metric Badges */}
                  <div
                    className={`pt-5 grid grid-cols-3 gap-4 border-t ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        ARR IMPACT
                      </span>
                      <span className={`text-2xl sm:text-3xl font-bold tracking-tight mt-0.5 block ${activeAccent.text}`}>
                        +$4.2M
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        MARKETS
                      </span>
                      <span
                        className={`text-2xl sm:text-3xl font-bold tracking-tight mt-0.5 block ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        42 Geo
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        TIMELINE
                      </span>
                      <span
                        className={`text-2xl sm:text-3xl font-bold tracking-tight mt-0.5 block ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        5.8 mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Visual Box */}
                <div className="lg:col-span-5">
                  <div
                    className={`rounded-xl border p-5 relative space-y-3 ${
                      isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
                      <span>SYSTEM_DIAGRAM_V2</span>
                      <span className={activeAccent.text}>ACTIVE ENGINE</span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Integrated Stripe Billing, Adyen local rails, and automated failover routing with sub-50ms latency.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {['Next.js 16', 'TypeScript', 'Tailwind', 'Stripe', 'Kafka'].map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                            isDark
                              ? 'bg-white/[0.04] border-white/10 text-slate-300'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               LAYOUT B: MINIMALIST PRINT-READY PAPER CV
            ========================================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* CV Top Header */}
              <div className="border-b pb-5 border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    Alexa Chen
                  </h3>
                  <p className={`text-xs sm:text-sm font-mono mt-1 ${activeAccent.text}`}>
                    Staff Product Lead &amp; Technical Architect
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400 sm:text-right">
                  <span>alexa@soodfolio.com</span> • <span>soodfolio.com/alexa</span>
                </div>
              </div>

              {/* CV Experience Item */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Linear Payments Inc. — Principal Product Lead
                  </span>
                  <span className="text-slate-400">2023 — Present</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Spearheaded cross-border monetization platform serving 42 global regions. Reduced transaction drop-off rate by 34% through intelligent tokenization and predictive routing.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Product Strategy', 'Fintech Infrastructure', 'SQL & Telemetry', 'Multi-tenant API'].map((skill) => (
                    <span
                      key={skill}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        isDark ? 'bg-white/[0.04] border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

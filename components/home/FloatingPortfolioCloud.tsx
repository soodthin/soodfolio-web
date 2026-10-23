'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle, TrendingUp, Cpu, Bell, Eye } from 'lucide-react';

interface FloatingPortfolioCloudProps {
  theme: 'dark' | 'light';
  lang: 'en' | 'vi';
}

export function FloatingPortfolioCloud({ theme, lang }: FloatingPortfolioCloudProps) {
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 pt-4 pb-12 select-none" data-purpose="floating-portfolio-cloud">
      {/* 
        CENTRAL PORTFOLIO STAGE PREVIEW 
      */}
      <div
        className={`relative z-10 rounded-2xl border transition-all duration-300 overflow-hidden ${
          isDark
            ? 'bg-[#0C131A] border-white/[0.08]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Browser Chrome Header */}
        <div
          className={`px-4 py-2.5 flex items-center justify-between border-b text-[11px] font-mono ${
            isDark ? 'bg-[#080D12] border-white/[0.06] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-slate-500 ml-2 font-mono">soodfolio.com/elena-vance</span>
          </div>

          <div className="flex items-center space-x-3 text-[10px]">
            <span className="inline-flex items-center space-x-1 text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span className="font-medium">STAGE 01 • 60 FPS</span>
            </span>
            <span className="opacity-40">•</span>
            <span className="uppercase text-slate-400">SLIDE 02 OF 06</span>
          </div>
        </div>

        {/* Mock Stage Slide Canvas */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Slide Narrative Left */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-sans font-medium text-[11px] uppercase tracking-wider">
              <span>{lang === 'en' ? 'Flagship Case Study' : 'Case Study Tiêu Biểu'}</span>
            </div>

            <h3
              className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {lang === 'en'
                ? 'Redesigning Multi-Platform Checkout Funnel at Scale'
                : 'Tái Thiết Kế Phễu Thanh Toán Đa Nền Tảng Cho 8.5M Người Dùng'}
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Architected seamless 1-click checkout experience and design tokens across mobile and web. Reduced drop-off rate by 34% within first quarter.'
                : 'Xây dựng trải nghiệm checkout 1 chạm liền mạch và đồng bộ design token giữa app và web. Giảm 34% tỷ lệ rớt đơn chỉ sau 1 quý.'}
            </p>

            {/* 3 Metrics Mini Grid */}
            <div
              className={`pt-3 grid grid-cols-3 gap-3 border-t ${
                isDark ? 'border-white/[0.08]' : 'border-slate-100'
              }`}
            >
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {lang === 'en' ? 'CONVERSION' : 'TỶ LỆ CHUYỂN ĐỔI'}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-teal-400 tracking-tight mt-0.5 block">
                  +34.2%
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {lang === 'en' ? 'CHECKOUT TIME' : 'THỜI GIAN ĐẶT'}
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold tracking-tight mt-0.5 block ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  1.4s
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {lang === 'en' ? 'SQUADS ADOPTED' : 'SQUADS ÁP DỤNG'}
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold tracking-tight mt-0.5 block ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* Slide Visual Right */}
          <div className="md:col-span-5 relative">
            <div
              className={`rounded-xl border overflow-hidden relative aspect-[4/3] flex items-center justify-center ${
                isDark ? 'bg-[#080D12] border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
                alt="Product Design Case Study"
                className="w-full h-full object-cover object-top opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/90">
                <span>FIGMA TOKENS → REACT</span>
                <span className="text-teal-400">VERIFIED METRIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        4 FLOATING MINI CARDS AROUND CENTRAL STAGE
        (In desktop they float with subtle offsets; in mobile they stack neatly below)
      */}
      <div className="mt-4 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-20">
        {/* Card 1: UI/UX Designer */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-200 sm:-translate-y-4 hover:-translate-y-6 ${
            isDark
              ? 'bg-[#0C131A] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
            <span className="font-semibold text-teal-400">01 • UI·UX DESIGNER</span>
            <span>PROJ_01</span>
          </div>
          <div className="mt-2.5 flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'en' ? 'Redesign Checkout' : 'Tối Ưu Phễu Checkout'}
              </h4>
              <p className="text-[11px] text-teal-400 font-mono mt-0.5 font-medium">+34% CVR Uplift</p>
            </div>
          </div>
        </div>

        {/* Card 2: Growth Marketer */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-200 sm:translate-y-2 hover:translate-y-0 ${
            isDark
              ? 'bg-[#0C131A] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
            <span className="font-semibold text-teal-400">02 • GROWTH MARKETER</span>
            <span>CAMP_04</span>
          </div>
          <div className="mt-2.5 flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'en' ? 'Viral Referral Loop' : 'Chiến Dịch Viral Loop'}
              </h4>
              <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                1.2M Reach • 4.8× ROI
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Software Engineer */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-200 sm:-translate-y-4 hover:-translate-y-6 ${
            isDark
              ? 'bg-[#0C131A] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
            <span className="font-semibold text-teal-400">03 • SOFTWARE ARCHITECT</span>
            <span>INFRA_02</span>
          </div>
          <div className="mt-2.5 flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Distributed Core
              </h4>
              <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                45k tx/s • 12ms p99
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Realtime Recruiter Toast */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-200 sm:translate-y-2 hover:translate-y-0 ${
            isDark
              ? 'bg-[#0C131A] border-teal-500/30'
              : 'bg-white border-teal-500/40 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
            <span className="flex items-center space-x-1.5 text-teal-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>LIVE TELEMETRY</span>
            </span>
            <span>12s ago</span>
          </div>
          <div className="mt-2.5 flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'en' ? 'Shopee HR opened link' : 'HR Shopee vừa mở link'}
              </h4>
              <p className="text-[11px] text-teal-400 font-mono mt-0.5 flex items-center space-x-1">
                <Eye className="w-3 h-3 inline mr-0.5" />
                <span>{lang === 'en' ? 'Viewing Slide 2 (75s)' : 'Đang xem Slide 2 (75s)'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

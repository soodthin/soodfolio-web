'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Layers, 
  Terminal,
  Activity,
  Eye
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function AuthLayout({ children, title, subtitle, badgeText = 'SOODFOLIO PLATFORM' }: AuthLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full flex bg-[#090a0f] text-slate-100 overflow-x-hidden selection:bg-teal-500/20 selection:text-teal-300">
      {/* LEFT COLUMN: AUTH FORM CONTAINER */}
      <div className="w-full lg:w-[50%] xl:w-[46%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 bg-[#090a0f] relative">
        {/* Ambient subtle warm spotlight behind the form */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Top Header / Brand Logo */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 relative z-10">
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 p-[1px] shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <div className="h-full w-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center group-hover:bg-[#121520] transition-colors">
                <Code2 className="h-5 w-5 text-teal-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base sm:text-lg text-white font-sans flex items-center gap-1.5">
                SoodFolio
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400" />
              </span>
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
                Crafted for Engineers
              </span>
            </div>
          </Link>

          {/* Micro pill badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-300 text-[11px] font-mono font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>
        </div>

        {/* Form Body Center */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-4 relative z-10">
          {/* Header Typography adhering to type ramp */}
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[40ch]">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Bottom Safety & Trust Footer */}
        <div className="pt-8 sm:pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400/80" />
            <span>Xác thực an toàn 256-bit SSL • NextGen Auth</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-400 transition-colors">Điều khoản</Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-400 transition-colors">Bảo mật</Link>
            <span>•</span>
            <span className="text-emerald-400 font-mono text-[11px]">System 99.98%</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE LIVE PORTFOLIO SHOWCASE */}
      <div className="hidden lg:flex flex-1 relative bg-[#0b0c12] border-l border-white/5 items-center justify-center p-8 xl:p-14 overflow-hidden">
        {/* Mechanical Grid Background */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" 
        />
        {/* Ambient Gold Radial Flare */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_50%,rgba(245,158,11,0.07),transparent_70%)] pointer-events-none" />
        
        {/* Subtle Decorative Circle Accent */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-teal-500/10 pointer-events-none" />

        {/* The Live Portfolio Showcase Box */}
        <div className="w-full max-w-lg relative z-10 space-y-6">
          {/* Eyebrow Restraint: Only 1 intentional tag for the hero showcase */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-teal-400 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Portfolio Showcase</span>
          </div>

          {/* Master Profile Card */}
          <div className="rounded-2xl bg-[#11131a]/95 border border-white/10 p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300">
            {/* Top Inset Highlight line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

            {/* Top Bar with URL & Verified Tag */}
            <div className="flex items-center justify-between pb-5 border-b border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 bg-[#161822] px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">soodfolio.dev/</span>
                <span className="text-teal-400 font-semibold">alex.vance</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Pro</span>
              </div>
            </div>

            {/* Profile Intro */}
            <div className="pt-5 flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-400/30 via-[#181a24] to-[#181a24] border border-teal-500/30 p-1 flex-shrink-0 flex items-center justify-center font-bold text-teal-300 text-lg shadow-inner">
                AV
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Alex Vance</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">Staff Engineer</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Building distributed real-time event platforms & high-frequency microservices.
                </p>
              </div>
            </div>

            {/* Bento Metrics Row (Deterministic Data - No Fake Divs) */}
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              <div className="p-3 rounded-xl bg-[#161822] border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Activity className="h-3 w-3 text-teal-400" />
                  <span>Uptime</span>
                </div>
                <div className="text-base font-bold text-white mt-1">99.9%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">SLA Guaranteed</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161822] border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Eye className="h-3 w-3 text-teal-400" />
                  <span>Views</span>
                </div>
                <div className="text-base font-bold text-white mt-1">14.2k</div>
                <div className="text-[10px] text-slate-400 mt-0.5">+28% this month</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161822] border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Layers className="h-3 w-3 text-teal-400" />
                  <span>Slides</span>
                </div>
                <div className="text-base font-bold text-white mt-1">4 Decks</div>
                <div className="text-[10px] text-teal-400 mt-0.5">Interactive</div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="text-[11px] font-mono text-slate-400 mb-2.5 uppercase tracking-wider">
                Active Architecture Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Next.js 15', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Redis', 'Docker'].map((tech) => (
                  <span 
                    key={tech} 
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#161822] border border-white/5 text-slate-300 hover:border-teal-500/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini Slide Deck Preview Bar */}
            <div className="mt-5 p-3.5 rounded-xl bg-[#0c0d14] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Terminal className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">Slide 2 / 4: Scalable Architecture</div>
                  <div className="text-[11px] text-slate-400">Interactive Pitch Deck mode</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* High-End Slogan */}
          <div className="px-2 space-y-1">
            <p className="text-sm text-slate-300 font-medium">
              Nền tảng danh thiếp số dạng Slide Deck cho lập trình viên ưu tú.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biến hồ sơ năng lực thành bài thuyết trình tương tác sắc bén, sẵn sàng chinh phục khách hàng và nhà tuyển dụng toàn cầu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

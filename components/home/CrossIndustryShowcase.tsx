'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Layers,
  ArrowRight,
  Play,
  Pause,
  Zap,
  Compass,
  Palette,
  TrendingUp,
  Code2,
} from 'lucide-react';

interface CrossIndustryShowcaseProps {
  theme: 'dark' | 'light';
  lang: 'en' | 'vi';
}

type IndustryCategory = 'all' | 'design' | 'marketing' | 'engineering' | 'pm' | 'freelance';

interface TemplateItem {
  id: string;
  category: IndustryCategory;
  name: string;
  roleEn: string;
  roleVi: string;
  headlineEn: string;
  headlineVi: string;
  metricLabel: string;
  metricValue: string;
  imageUrl: string;
  tags: string[];
}

const STREAM_ROW_1: TemplateItem[] = [
  {
    id: 'elena-design',
    category: 'design',
    name: 'Elena Vance',
    roleEn: 'Staff Product Designer',
    roleVi: 'Kiến Trúc Sư Thiết Kế & Staff Designer',
    headlineEn: 'Unified 420+ Figma tokens across 85 engineering squads with 0.02% drift.',
    headlineVi: 'Đồng nhất 420+ token Figma trên 85 squad kỹ thuật với độ lệch chỉ 0.02%.',
    metricLabel: 'SPEED UPLIFT',
    metricValue: '+140%',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Design Systems', 'Figma Tokens', 'Design Ops'],
  },
  {
    id: 'julian-growth',
    category: 'marketing',
    name: 'Julian Chen',
    roleEn: 'VP of Growth & Performance',
    roleVi: 'Giám Đốc Tăng Trưởng & Marketing Hiệu Suất',
    headlineEn: 'Scaled inbound organic signups from 12k to 148k monthly with sub-$4.20 CAC.',
    headlineVi: 'Tăng trưởng người dùng tự nhiên từ 12k lên 148k/tháng với CAC dưới $4.20.',
    metricLabel: 'ORGANIC SCALE',
    metricValue: '12.3×',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['Product-Led Growth', 'Viral Funnels', 'B2B SaaS'],
  },
  {
    id: 'alexa-pm',
    category: 'pm',
    name: 'Alexa Chen',
    roleEn: 'Lead Technical Product Manager',
    roleVi: 'Giám Đốc Sản Phẩm Kỹ Thuật (Tech PM)',
    headlineEn: 'Scaled global localized payment gateways to 42 countries driving +$4.2M net ARR.',
    headlineVi: 'Mở rộng cổng thanh toán toàn cầu sang 42 quốc gia, tạo thêm $4.2M net ARR.',
    metricLabel: 'NET NEW ARR',
    metricValue: '+$4.2M',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Fintech Core', 'Global Expansion', 'Roadmap'],
  },
  {
    id: 'david-mobile',
    category: 'engineering',
    name: 'David Miller',
    roleEn: 'Principal iOS & Mobile Architect',
    roleVi: 'Trưởng Nhóm Kỹ Thuật Mobile & iOS',
    headlineEn: 'Engineered sub-60fps offline-first synchronization engine for 3.4M active drivers.',
    headlineVi: 'Xây dựng engine đồng bộ offline-first mượt 60fps cho 3.4M tài xế công nghệ.',
    metricLabel: 'CRASH-FREE',
    metricValue: '99.98%',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    tags: ['SwiftUI', 'Metal 3D', 'Offline Sync', 'iOS'],
  },
];

const STREAM_ROW_2: TemplateItem[] = [
  {
    id: 'tara-infra',
    category: 'engineering',
    name: 'Tara Sundaram',
    roleEn: 'Principal Systems Architect',
    roleVi: 'Kiến Trúc Sư Hệ Thống Phân Tán Cao Cấp',
    headlineEn: 'High-throughput ledger infra processing 45,000 tx/sec under 12ms p99 latency.',
    headlineVi: 'Hạ tầng sổ cái giao dịch 45,000 lệnh/giây với độ trễ p99 dưới 12ms.',
    metricLabel: 'P99 LATENCY',
    metricValue: '<12ms',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tags: ['Distributed Kafka', 'Rust', 'Kubernetes'],
  },
  {
    id: 'chi-freelance',
    category: 'freelance',
    name: 'Chi Nguyen',
    roleEn: 'Independent Creative Director',
    roleVi: 'Giám Đốc Sáng Tạo Độc Lập & Nghệ Sĩ 3D',
    headlineEn: 'Brand identity & 3D visual campaigns for Nike, Spotify, and 14 web3 studios.',
    headlineVi: 'Bộ nhận diện thương hiệu & chiến dịch visual 3D cho Nike, Spotify và 14 studio.',
    metricLabel: 'RETENTION',
    metricValue: '96%',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    tags: ['Art Direction', 'Cinema4D', 'Identity'],
  },
  {
    id: 'minh-dev',
    category: 'engineering',
    name: 'Minh Quan',
    roleEn: 'Applied AI & RAG Engineer',
    roleVi: 'Kỹ Sư Phần Mềm Full-Stack & Ứng Dụng AI',
    headlineEn: 'Built agentic RAG workflows indexing 10M enterprise documents with 99.4% accuracy.',
    headlineVi: 'Phát triển hệ thống Agentic RAG xử lý 10M tài liệu doanh nghiệp với độ chính xác 99.4%.',
    metricLabel: 'QUERY TIME',
    metricValue: '280ms',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js 16', 'Python', 'FastAPI', 'LangChain'],
  },
  {
    id: 'sarah-cmo',
    category: 'marketing',
    name: 'Sarah Jenkins',
    roleEn: 'Fractional CMO & Brand Strategist',
    roleVi: 'Giám Đốc Tiếp Thị & Chiến Lược Thương Hiệu',
    headlineEn: 'Orchestrated launch of 3 consumer hardware products surpassing $18M pre-orders.',
    headlineVi: 'Chỉ đạo ra mắt 3 sản phẩm phần cứng tiêu dùng đạt hơn $18M lượng đặt trước.',
    metricLabel: 'PRE-ORDERS',
    metricValue: '$18.4M',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    tags: ['Launch Playbook', 'Hardware', 'PR Blitz'],
  },
];

export function CrossIndustryShowcase({ theme, lang }: CrossIndustryShowcaseProps) {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<IndustryCategory>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.8>(1);

  const categories: {
    key: IndustryCategory;
    labelEn: string;
    labelVi: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: 'all', labelEn: 'All Disciplines', labelVi: 'Tất cả', icon: Layers },
    { key: 'design', labelEn: 'UI/UX & Design', labelVi: 'Thiết kế UI/UX', icon: Palette },
    { key: 'marketing', labelEn: 'Growth & Marketing', labelVi: 'Marketing & Tăng trưởng', icon: TrendingUp },
    { key: 'engineering', labelEn: 'Software & Infra', labelVi: 'Lập trình & Hạ tầng', icon: Code2 },
    { key: 'pm', labelEn: 'Product Manager', labelVi: 'Quản lý Sản phẩm', icon: Compass },
    { key: 'freelance', labelEn: 'Freelancer', labelVi: 'Freelancer', icon: Zap },
  ];

  // Filter templates for both rows
  const filterRow = (items: TemplateItem[]) => {
    if (activeCategory === 'all') return items;
    const matched = items.filter((item) => item.category === activeCategory);
    if (matched.length === 0) {
      const allMatched = [...STREAM_ROW_1, ...STREAM_ROW_2].filter(
        (item) => item.category === activeCategory
      );
      return allMatched.length > 0 ? allMatched : items;
    }
    return matched;
  };

  const row1Items = filterRow(STREAM_ROW_1);
  const row2Items = filterRow(STREAM_ROW_2);

  // Duplicate for seamless infinite loop
  const infiniteRow1 = [...row1Items, ...row1Items, ...row1Items];
  const infiniteRow2 = [...row2Items, ...row2Items, ...row2Items];

  const durationRow1 = `${34 / speedMultiplier}s`;
  const durationRow2 = `${36 / speedMultiplier}s`;

  return (
    <section
      id="showcase"
      className={`py-20 md:py-28 border-b transition-colors overflow-hidden relative ${
        isDark ? 'bg-[#080D12] border-white/10' : 'bg-[#FAFCFC] border-slate-200'
      }`}
      data-purpose="cross-industry-showcase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-sans font-medium text-xs uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 mr-1" />
              <span>{lang === 'en' ? 'Cross-Industry Showcase' : 'Thư Viện Mẫu Đa Ngành'}</span>
            </div>
            <h2
              className={`text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {lang === 'en'
                ? 'BUILT FOR EVERY AMBITIOUS CREATOR.'
                : 'THIẾT KẾ CHO MỌI NHÂN TÀI ĐẦY KHÁT VỌNG.'}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Whether you craft interfaces, architect distributed clusters, orchestrate growth funnels, or run an elite agency — there is an unboxed presentation ready to deploy.'
                : 'Dù bạn thiết kế giao diện, viết hệ thống phân tán, chạy chiến dịch marketing hay làm agency độc lập — luôn có mẫu portfolio sẵn sàng để bạn cá nhân hóa.'}
            </p>
          </div>

          {/* Interactive Depth & Speed Controls */}
          <div className="flex items-center space-x-2.5 select-none text-xs font-sans font-medium">
            {/* Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 1.8 : 1)}
              title={speedMultiplier === 1 ? 'Tăng tốc cuộn 1.8×' : 'Tốc độ bình thường 1×'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                speedMultiplier === 1.8
                  ? 'bg-teal-400 text-slate-950 border-teal-400 font-semibold'
                  : isDark
                  ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  : 'border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{speedMultiplier === 1 ? '1.0× Speed' : '1.8× Fast'}</span>
            </button>

            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Tiếp tục cuộn' : 'Tạm dừng cuộn'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  : 'border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-teal-400" />
                  <span className="hidden sm:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-teal-400" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 
          CATEGORY FILTER TABS (Lucide Icons, No Emoji, font-sans font-medium)
        */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar mb-4 text-xs font-sans font-medium select-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg border whitespace-nowrap transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-teal-400 text-slate-950 border-teal-400 font-semibold'
                    : isDark
                    ? 'bg-[#0C131A] text-slate-400 hover:text-white border-white/[0.08] hover:border-white/20'
                    : 'bg-white text-slate-600 hover:text-slate-950 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? cat.labelEn : cat.labelVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        =============================================================================
        CINEMATIC OPPOSING DUAL-STREAM STAGE (WITH DEEP MULTI-LAYER BLUR ON BOTH SIDES)
        =============================================================================
      */}
      <div className="relative w-full mt-4 space-y-6">
        {/* 
          LEFT MULTI-LAYER DEPTH CURTAIN (Blur & Matte Vignette)
        */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-24 sm:w-44 lg:w-72 z-30 pointer-events-none backdrop-blur-[4px] ${
            isDark
              ? 'bg-gradient-to-r from-[#080D12] via-[#080D12]/85 to-transparent'
              : 'bg-gradient-to-r from-[#FAFCFC] via-[#FAFCFC]/85 to-transparent'
          }`}
          style={{
            maskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
          }}
        />

        {/* 
          RIGHT MULTI-LAYER DEPTH CURTAIN (Blur & Matte Vignette)
        */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-24 sm:w-44 lg:w-72 z-30 pointer-events-none backdrop-blur-[4px] ${
            isDark
              ? 'bg-gradient-to-l from-[#080D12] via-[#080D12]/85 to-transparent'
              : 'bg-gradient-to-l from-[#FAFCFC] via-[#FAFCFC]/85 to-transparent'
          }`}
          style={{
            maskImage: 'linear-gradient(to left, black 25%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 25%, transparent 100%)',
          }}
        />

        {/* 
          STREAM ROW 1: LEFTWARD INFINITE DRIFT
        */}
        <div className="relative w-full overflow-hidden select-none">
          <div
            className="animate-marquee-left flex space-x-6"
            style={{
              animationDuration: durationRow1,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {infiniteRow1.map((item, idx) => (
              <div
                key={`row1-${item.id}-${idx}`}
                className={`w-[290px] sm:w-[350px] shrink-0 rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 ${
                  isDark
                    ? 'bg-[#0C131A] border-white/[0.08] hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Image Preview Canvas */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden border-b border-white/[0.06]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top opacity-90 transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Floating Metric Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-sans font-medium text-[10px] text-teal-400 flex items-center space-x-1">
                      <span>{item.metricLabel}:</span>
                      <span className="text-white font-bold">{item.metricValue}</span>
                    </div>

                    {/* Bottom Author Tag */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-sans text-white">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-[10px] text-teal-400 uppercase font-medium">SOODFOLIO DECK</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    <div className={`text-xs font-sans font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lang === 'en' ? item.roleEn : item.roleVi}
                    </div>

                    <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {lang === 'en' ? item.headlineEn : item.headlineVi}
                    </h3>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${
                            isDark
                              ? 'bg-white/[0.03] border-white/10 text-slate-300'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  className={`p-4 pt-2.5 border-t flex items-center justify-between text-xs font-sans font-medium ${
                    isDark ? 'border-white/[0.06]' : 'border-slate-100'
                  }`}
                >
                  <Link
                    href="/preview/demo"
                    target="_blank"
                    className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Live Demo' : 'Xem Demo'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/register?template=${item.id}`}
                    className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-medium px-3 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Use Template' : 'Dùng mẫu này'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 
          STREAM ROW 2: RIGHTWARD OPPOSITE INFINITE DRIFT
        */}
        <div className="relative w-full overflow-hidden select-none">
          <div
            className="animate-marquee-right flex space-x-6"
            style={{
              animationDuration: durationRow2,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {infiniteRow2.map((item, idx) => (
              <div
                key={`row2-${item.id}-${idx}`}
                className={`w-[290px] sm:w-[350px] shrink-0 rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 ${
                  isDark
                    ? 'bg-[#0C131A] border-white/[0.08] hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Image Preview Canvas */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden border-b border-white/[0.06]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top opacity-90 transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Floating Metric Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-sans font-medium text-[10px] text-teal-400 flex items-center space-x-1">
                      <span>{item.metricLabel}:</span>
                      <span className="text-white font-bold">{item.metricValue}</span>
                    </div>

                    {/* Bottom Author Tag */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-sans text-white">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-[10px] text-teal-400 uppercase font-medium">SOODFOLIO DECK</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    <div className={`text-xs font-sans font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lang === 'en' ? item.roleEn : item.roleVi}
                    </div>

                    <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {lang === 'en' ? item.headlineEn : item.headlineVi}
                    </h3>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${
                            isDark
                              ? 'bg-white/[0.03] border-white/10 text-slate-300'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  className={`p-4 pt-2.5 border-t flex items-center justify-between text-xs font-sans font-medium ${
                    isDark ? 'border-white/[0.06]' : 'border-slate-100'
                  }`}
                >
                  <Link
                    href="/preview/demo"
                    target="_blank"
                    className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Live Demo' : 'Xem Demo'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/register?template=${item.id}`}
                    className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-medium px-3 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Use Template' : 'Dùng mẫu này'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

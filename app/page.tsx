'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sun,
  Moon,
  Globe,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

import { FloatingPortfolioCloud } from '@/components/home/FloatingPortfolioCloud';
import { TastePlayground } from '@/components/home/TastePlayground';
import { JobWinningBento } from '@/components/home/JobWinningBento';
import { CrossIndustryShowcase } from '@/components/home/CrossIndustryShowcase';
import { ScrollToTop } from '@/components/common/ScrollToTop';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // State Management
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'vi'>('vi');
  const [claimHandle, setClaimHandle] = useState('');

  // Hydrate theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedLang = localStorage.getItem('soodfolio-lang') as 'en' | 'vi' | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('soodfolio-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'vi' : 'en';
    setLang(next);
    localStorage.setItem('soodfolio-lang', next);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const handle = claimHandle.trim() || 'developer';
    router.push(`/register?username=${encodeURIComponent(handle)}`);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen selection:bg-teal-400 selection:text-slate-950 transition-colors duration-150 ${
        isDark
          ? 'bg-[#080D12] text-slate-100 cyber-grid-dark'
          : 'bg-[#FAFCFC] text-slate-900 tech-grid-light'
      }`}
    >
      {/* =========================================================================
          1. TELEMETRY TOP STRIP (Restrained Matte)
      ========================================================================== */}
      <aside
        className={`w-full border-b text-xs font-sans font-medium py-2 px-4 sm:px-8 select-none transition-colors ${
          isDark
            ? 'bg-[#080D12] border-white/10 text-slate-400'
            : 'bg-[#F4F4F5] border-slate-200 text-slate-500'
        }`}
        data-purpose="telemetry-bar"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Status Left */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-800 font-medium'}>
              Stage 01 • Exhibition Ready
            </span>
            <span className="opacity-30">•</span>
            <span className="hidden sm:inline opacity-60">Runtime: Continuous</span>
          </div>

          {/* Live Audience Right */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>
              {lang === 'en' ? (
                <>
                  Hiring Execs from <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Linear</strong>,{' '}
                  <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Stripe</strong> &{' '}
                  <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Shopee</strong> Live In-Audience
                </>
              ) : (
                <>
                  Lãnh đạo tuyển dụng từ <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Linear</strong>,{' '}
                  <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Stripe</strong> &{' '}
                  <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Shopee</strong> đang theo dõi
                </>
              )}
            </span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN HEADER NAVIGATION (Matte Surface, 1px Razor Border)
      ========================================================================== */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-[#080D12]/90 border-white/10'
            : 'bg-[#FAFCFC]/90 border-slate-200 shadow-xs'
        }`}
        data-purpose="site-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-1.5 group select-none">
            <span
              className={`font-semibold text-sm sm:text-base font-sans transition-colors ${
                isDark
                  ? 'text-white group-hover:text-teal-400'
                  : 'text-slate-950 group-hover:text-teal-600'
              }`}
            >
              SoodFolio
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400" />
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-sans font-medium text-slate-400">
            <a
              href="#stage"
              className={`transition-colors ${
                isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-950 text-slate-600'
              }`}
            >
              {lang === 'en' ? 'The Stage' : 'Sân Khấu'}
            </a>
            <a
              href="#playground"
              className={`transition-colors ${
                isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-950 text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Playground' : 'Tinh Chỉnh'}
            </a>
            <a
              href="#bento"
              className={`transition-colors ${
                isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-950 text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Features' : 'Tính Năng'}
            </a>
            <a
              href="#showcase"
              className={`transition-colors ${
                isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-950 text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Showcase' : 'Mẫu Đa Ngành'}
            </a>
            <a
              href="#comparison"
              className={`transition-colors ${
                isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-950 text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Comparison' : 'So Sánh'}
            </a>
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs font-sans font-medium">
            {/* Language Switcher Pill */}
            <button
              type="button"
              data-testid="lang-toggle"
              aria-label="Toggle language"
              onClick={toggleLang}
              className={`flex items-center space-x-1.5 border rounded px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  : 'border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3 h-3 opacity-60" />
              <span className="font-medium text-[11px] uppercase">{lang}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Chuyển đổi giao diện Sáng / Tối"
              className={`p-1.5 border rounded transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  : 'border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* External Demo Link */}
            <Link
              href="/preview/demo"
              target="_blank"
              className={`hidden sm:inline-flex items-center space-x-1 px-2 py-1 transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Primary Dashboard CTA (Solid Teal Flat Accent, Zero Glow) */}
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans font-medium px-3.5 py-1.5 rounded text-xs tracking-tight transition-colors cursor-pointer"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. HERO STAGE VỚI "FLOATING PORTFOLIO CLOUD"
      ========================================================================== */}
      <section
        id="stage"
        className={`relative pt-16 pb-20 sm:pt-24 sm:pb-32 border-b transition-colors ${
          isDark ? 'bg-[#080D12] border-white/10' : 'bg-[#FAFCFC] border-slate-200'
        }`}
        data-purpose="hero-presentation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Badge (Flat Solid Teal, Zero Glow) */}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-sans font-medium text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Stage 01 • Exhibition Ready</span>
          </div>

          {/* Main Mega Headline */}
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] max-w-4xl mx-auto ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            {lang === 'en' ? (
              <>
                Craft a portfolio that reflects your personal taste.{' '}
                <span className="text-teal-400 block mt-1 sm:inline">Paste the link into your resume.</span>
              </>
            ) : (
              <>
                Tạo Portfolio mang đậm cá tính riêng.{' '}
                <span className="text-teal-400 block mt-1 sm:inline">Lấy link gắn thẳng vào CV của bạn.</span>
              </>
            )}
          </h1>

          {/* Subheadline (Inclusive for all disciplines) */}
          <p
            className={`mt-5 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {lang === 'en'
              ? 'Engineered for designers, marketers, software engineers, product managers, and freelancers who refuse to fit on a flat 1-page PDF. Impress recruiters in the first 10 seconds.'
              : 'Dành cho các Designer, Marketer, Developer, PM và Freelancer từ chối bị gò bó trong trang PDF phẳng. Khiến nhà tuyển dụng nhớ mãi câu chuyện sự nghiệp của bạn.'}
          </p>

          {/* Command Bar: Claim Vanity Link */}
          <div className="mt-8 max-w-xl mx-auto">
            <form
              onSubmit={handleClaimSubmit}
              className={`p-1.5 sm:p-2 rounded-xl border flex flex-col sm:flex-row items-center gap-2 transition-colors ${
                isDark ? 'bg-[#0C131A] border-white/10' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center pl-3 w-full sm:w-auto flex-1 font-mono text-sm overflow-hidden">
                <Terminal className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                <span className={isDark ? 'text-slate-500 select-none' : 'text-slate-400 select-none'}>
                  soodfolio.com/
                </span>
                <input
                  type="text"
                  value={claimHandle}
                  onChange={(e) => setClaimHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="your-name"
                  className={`bg-transparent border-none focus:ring-0 focus:outline-none p-0 ml-1 font-mono text-sm w-full font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto font-sans font-semibold text-sm px-5 py-2.5 rounded transition-colors flex items-center justify-center space-x-1.5 whitespace-nowrap bg-teal-400 hover:bg-teal-300 text-slate-950 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Get Started Free' : 'Bắt Đầu Miễn Phí'}</span>
                <span>→</span>
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center space-x-4 text-xs font-sans font-medium text-slate-400 select-none">
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400 stroke-[2.5]" />
                <span>{lang === 'en' ? 'No Credit Card Required' : 'Không Cần Thẻ Tín Dụng'}</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="text-teal-400 font-medium">
                {lang === 'en' ? 'Instant Live Link' : 'Triển Khai Tức Thì'}
              </span>
            </div>
          </div>

          {/* Central Stage Visual with 4 Floating Cards */}
          <FloatingPortfolioCloud theme={theme} lang={lang} />
        </div>
      </section>

      {/* =========================================================================
          4. PHÂN ĐOẠN 2: "TASTE PLAYGROUND" (BỘ TINH CHỈNH PHONG CÁCH)
      ========================================================================== */}
      <TastePlayground theme={theme} lang={lang} />

      {/* =========================================================================
          5. PHÂN ĐOẠN 3: BENTO GRID - 4 VŨ KHÍ KHI GẮN LINK VÀO CV
      ========================================================================== */}
      <JobWinningBento theme={theme} lang={lang} />

      {/* =========================================================================
          6. PHÂN ĐOẠN 4: CROSS-INDUSTRY SHOWCASE (THƯ VIỆN MẪU ĐA NGÀNH)
      ========================================================================== */}
      <CrossIndustryShowcase theme={theme} lang={lang} />

      {/* =========================================================================
          7. PHÂN ĐOẠN 5: COMPARISON & FINAL CTA
      ========================================================================== */}
      <section
        id="comparison"
        className={`py-20 md:py-28 border-b transition-colors ${
          isDark ? 'bg-[#080D12] border-white/10' : 'bg-[#FAFCFC] border-slate-200'
        }`}
        data-purpose="comparison-table"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-sans font-semibold text-xs text-teal-400">
              Attention Economics
            </span>
            <h2
              className={`mt-3 text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {lang === 'en'
                ? 'The PDF is where great candidates become interchangeable.'
                : 'Trang PDF phẳng là nơi ứng viên xuất sắc bị đồng hóa như nhau.'}
            </h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Traditional PDF resumes get skimmed in 6.2 seconds. A SoodFolio stage drives a 4.8× higher conversion rate into executive onsite interviews.'
                : 'CV PDF truyền thống bị lướt qua trong 6.2 giây rồi biến mất vào hố đen ATS. SoodFolio tạo tỷ lệ nhận lời mời phỏng vấn cao gấp 4.8 lần.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Legacy Format */}
            <div
              className={`rounded-2xl border p-8 flex flex-col justify-between ${
                isDark ? 'bg-[#0C131A] border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-sans text-xs pb-4 border-b border-white/[0.06] text-slate-400">
                  <span className="font-medium">Legacy format</span>
                  <span className="text-rose-400 font-medium">ATS-Void</span>
                </div>

                <h3
                  className={`mt-6 text-xl font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500 line-through'
                  }`}
                >
                  {lang === 'en' ? 'The Flat 1-Page Graveyard' : 'Nghĩa Trang Hồ Sơ Phẳng 1 Trang'}
                </h3>

                <div className="mt-4">
                  <span className="text-5xl font-bold font-mono tracking-tight text-slate-400">
                    6.2s
                  </span>
                  <p className="text-sm text-slate-400 mt-1">
                    {lang === 'en'
                      ? 'Average glance time before a fatigued screener moves to the next pile.'
                      : 'Thời gian lướt qua trung bình trước khi người sàng lọc chuyển sang tập hồ sơ tiếp theo.'}
                  </p>
                </div>

                <ul className="mt-8 space-y-4 text-sm text-slate-400 font-normal">
                  <li className="flex items-start">
                    <span className="text-slate-500 font-mono mr-3">—</span>
                    <span>
                      {lang === 'en'
                        ? 'Zero interactive proof: systems, video walkthroughs, and live products are flattened into plain text.'
                        : 'Không có bằng chứng tương tác: kiến trúc hệ thống, video walkthrough và demo bị bóp nghẹt thành text.'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-500 font-mono mr-3">—</span>
                    <span>
                      {lang === 'en'
                        ? 'Blind submission: you never know if your document was opened, ignored, or forwarded.'
                        : 'Nộp hồ sơ mù: bạn không bao giờ biết tài liệu có được mở, xem hay chuyển tiếp cho ai không.'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-500 font-mono mr-3">—</span>
                    <span>
                      {lang === 'en'
                        ? 'Zero personality: your hard-won taste is forced into Times New Roman and standard margins.'
                        : 'Mất hoàn toàn gu thẩm mỹ: kỹ năng rèn giũa bao năm bị nhồi nhét vào lề Word và font chữ rập khuôn.'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-10 pt-4 border-t border-white/[0.06] text-xs font-sans text-slate-400">
                Tỷ lệ bị loại bỏ: 94.2%
              </div>
            </div>

            {/* Right: SoodFolio Cinematic Stage */}
            <div
              className={`rounded-2xl border p-8 flex flex-col justify-between relative overflow-hidden ${
                isDark ? 'bg-[#0C131A] border-teal-500/40' : 'bg-white border-teal-500/40 shadow-xs'
              }`}
            >
              <div className="absolute top-0 right-0 bg-teal-400 text-slate-950 font-sans text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Recommended Standard
              </div>

              <div>
                <div className="flex items-center justify-between font-sans text-xs pb-4 border-b border-teal-500/20 text-teal-400">
                  <span className="font-medium text-xs font-sans">SoodFolio Standard</span>
                  <span className="font-medium text-xs font-sans">Active Reputation</span>
                </div>

                <h3
                  className={`mt-6 text-xl sm:text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {lang === 'en' ? 'The Cinematic Stage' : 'Sân Khấu Điện Ảnh Đẳng Cấp'}
                </h3>

                <div className="mt-4">
                  <span className="text-5xl font-bold font-mono tracking-tight text-teal-400">
                    4.8×
                  </span>
                  <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {lang === 'en'
                      ? 'Higher invite-to-executive onsite interview conversion rate.'
                      : 'Tỷ lệ chuyển đổi nhận lời mời phỏng vấn trực tiếp từ lãnh đạo cao hơn 4.8 lần.'}
                  </p>
                </div>

                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-teal-400 stroke-[2.5] mr-3 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>
                        {lang === 'en' ? 'Continuous presentation theater:' : 'Trình diễn liền mạch:'}
                      </strong>{' '}
                      {lang === 'en'
                        ? 'recruiters review an intentional story slide-by-slide, not a compressed checklist.'
                        : 'nhà tuyển dụng thưởng thức câu chuyện sự nghiệp từng slide một cách tập trung, không phải bản kiểm tra nén.'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-teal-400 stroke-[2.5] mr-3 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>
                        {lang === 'en' ? 'Embedded dynamic artifacts:' : 'Bằng chứng động nhúng trực tiếp:'}
                      </strong>{' '}
                      {lang === 'en'
                        ? 'high-res case study architectures, prototypes, and verified quantitative KPI badges.'
                        : 'ảnh kiến trúc độ phân giải cao, prototype tương tác và badge số liệu KPI được kiểm chứng.'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-teal-400 stroke-[2.5] mr-3 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>
                        {lang === 'en' ? 'Direct partner contact integration:' : 'Kênh kết nối trực tiếp:'}
                      </strong>{' '}
                      {lang === 'en'
                        ? 'bypass screening email ping-pong directly from your closing slide.'
                        : 'vượt qua chuỗi email lọc rườm rà, kết nối trực tiếp với đối tác ngay từ slide kết thúc.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CALL TO ACTION
      ========================================================================== */}
      <section
        className={`py-20 md:py-32 relative transition-colors ${
          isDark ? 'bg-[#080D12]' : 'bg-[#FAFCFC]'
        }`}
        data-purpose="closing-cta"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-2xl border p-8 sm:p-14 text-center relative overflow-hidden transition-colors ${
              isDark ? 'bg-[#0C131A] border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <span className="font-sans text-xs text-teal-400 font-semibold">
              Khởi tạo slide deck trong tích tắc
            </span>
            <h2
              className={`mt-4 text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {lang === 'en'
                ? 'Elevate your next career chapter.'
                : 'Nâng tầm chương tiếp theo trong sự nghiệp.'}
            </h2>
            <p className={`mt-4 max-w-xl mx-auto text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Stop fading into Applicant Tracking Systems. Stand out with a radiant, full-screen portfolio deck that recruiters actually remember.'
                : 'Đừng để bản thân chìm nghỉm trong các hệ thống lọc hồ sơ tự động. Tỏa sáng với slide deck toàn màn hình khiến nhà tuyển dụng nhớ mãi.'}
            </p>

            {/* Action Buttons (Flat Solid Teal, Zero Glow) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-sans font-medium text-xs">
              <Link
                href="/register"
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Create Your Free Deck →' : 'Khởi Tạo Portfolio Miễn Phí →'}
              </Link>
              <a
                href="#showcase"
                className={`border font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white border-white/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                {lang === 'en' ? 'Explore Showcase Gallery' : 'Xem Thư Viện Mẫu'}
              </a>
            </div>

            {/* Micro Features */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-sans font-medium text-slate-400 select-none">
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400 stroke-[2.5]" />
                <span>{lang === 'en' ? 'No credit card needed' : 'Không cần thẻ tín dụng'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400 stroke-[2.5]" />
                <span>{lang === 'en' ? 'Custom vanity URL included' : 'Tặng kèm link độc quyền'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN FOOTER (1px Razor Border, Matte Finish)
      ========================================================================== */}
      <footer
        className={`border-t py-14 text-xs font-sans transition-colors ${
          isDark ? 'border-white/10 bg-[#080D12] text-slate-400' : 'border-slate-200 bg-[#FAFCFC] text-slate-500'
        }`}
        data-purpose="site-footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Info Column */}
            <div className="col-span-2">
              <Link href="/" className="font-semibold text-base group select-none">
                <span className={isDark ? 'text-white' : 'text-slate-950'}>SoodFolio</span>
                <span className="text-teal-400 ml-0.5">●</span>
              </Link>
              <p className="mt-3 text-slate-400 font-sans text-xs max-w-sm leading-relaxed">
                Unboxed interactive presentation software engineered for discerning designers, engineers, marketers,
                and founders who present with purpose.
              </p>
            </div>

            {/* Link Column 1 */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Curation
              </h4>
              <ul className="space-y-2">
                <li><a className="hover:text-teal-400 transition-colors" href="#stage">The Stage</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#playground">Playground</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#bento">The Bento</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#comparison">Comparison</a></li>
              </ul>
            </div>

            {/* Link Column 2 */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Showcase
              </h4>
              <ul className="space-y-2">
                <li><a className="hover:text-teal-400 transition-colors" href="#showcase">Product Designers</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#showcase">Distributed Systems</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#showcase">Growth Engineering</a></li>
                <li><a className="hover:text-teal-400 transition-colors" href="#showcase">Product Managers</a></li>
              </ul>
            </div>

            {/* Link Column 3 */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Platform
              </h4>
              <ul className="space-y-2">
                <li><Link className="hover:text-teal-400 transition-colors" href="/login">Log In</Link></li>
                <li><Link className="hover:text-teal-400 transition-colors" href="/register">Create Portfolio</Link></li>
                <li><Link className="hover:text-teal-400 transition-colors" href="/preview/demo">Live Demo</Link></li>
                <li className="pt-2 flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>All Systems Normal</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Strip */}
          <div
            className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-sans gap-2 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <div>© 2026 SoodFolio Platform. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}

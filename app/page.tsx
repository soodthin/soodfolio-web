'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowRight, 
  Check, 
  Terminal, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Globe
} from 'lucide-react';

interface RoleProfile {
  id: string;
  tabLabel: string;
  author: string;
  title: string;
  eyebrow: string;
  headline: string;
  narrative: string;
  stat1Value: string;
  stat1Label: string;
  stat1Sub: string;
  stat2Value: string;
  stat2Label: string;
  stat2Sub: string;
  stat3Value: string;
  stat3Label: string;
  stat3Sub: string;
  handle: string;
  captionLeft: string;
  captionRight: string;
  imageUrl: string;
}

const ROLE_PROFILES_EN: Record<string, RoleProfile> = {
  designer: {
    id: 'designer',
    tabLabel: '01 / Product Architecture',
    author: 'Elena Vance',
    title: 'Staff Systems Architect & Designer',
    eyebrow: 'Case Study 01 • Design Systems',
    headline: 'Unified design architecture across 420+ components & 85 squads.',
    narrative: 'Migrated fragmented UI assets into an automated cross-platform token pipeline. Reduced design-to-production handoff time by 64% in one quarter.',
    stat1Value: '+140%',
    stat1Label: 'VELOCITY',
    stat1Sub: 'PR throughput lift',
    stat2Value: '85',
    stat2Label: 'SQUADS',
    stat2Sub: 'Natively unified',
    stat3Value: '0.02%',
    stat3Label: 'DRIFT',
    stat3Sub: 'Token divergence',
    handle: 'elena-vance',
    captionLeft: 'FIG. 01 — DESIGN REPO V4.2',
    captionRight: 'FIGMA TO REACT TOKENS',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  marketer: {
    id: 'marketer',
    tabLabel: '02 / Growth Engineering',
    author: 'Julian Chen',
    title: 'Head of Growth Engineering',
    eyebrow: 'Case Study 02 • Virality Engine',
    headline: '$4.2M to $18M ARR acceleration via product-led viral loops.',
    narrative: 'Built multichannel attribution and onboarding funnels that boosted free-to-paid conversion from 3.8% to 9.2% without added ad spend.',
    stat1Value: '+320%',
    stat1Label: 'FUNNEL',
    stat1Sub: 'Conversion lift',
    stat2Value: '9.2%',
    stat2Label: 'PAID CONV',
    stat2Sub: 'Benchmark rate',
    stat3Value: '$18M',
    stat3Label: 'RUN-RATE',
    stat3Sub: 'ARR scale',
    handle: 'julian-growth',
    captionLeft: 'FIG. 02 — GROWTH PIPELINE',
    captionRight: 'ACTIVATION ENGINE',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  engineer: {
    id: 'engineer',
    tabLabel: '03 / Distributed Systems',
    author: 'Tara Sundaram',
    title: 'Principal Infrastructure Architect',
    eyebrow: 'Case Study 03 • Core Ledger Infra',
    headline: 'High-throughput ledger infra processing 45,000 tx/sec under 12ms.',
    narrative: 'Architected database sharding and memory caching to achieve sub-12ms p99 latency during peak global transaction events with 99.999% SLA.',
    stat1Value: '12ms',
    stat1Label: 'P99 LATENCY',
    stat1Sub: 'Response budget',
    stat2Value: '45k',
    stat2Label: 'PEAK TX/S',
    stat2Sub: 'Zero data drift',
    stat3Value: '99.999%',
    stat3Label: 'UPTIME',
    stat3Sub: 'Multi-region SLA',
    handle: 'tara-infra',
    captionLeft: 'FIG. 03 — DISTRIBUTED LEDGER',
    captionRight: 'POSTGRES + REDIS SHARDS',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  founder: {
    id: 'founder',
    tabLabel: '04 / Zero-to-One Venture',
    author: 'Maya Lin',
    title: 'Founder & CEO (Exited 2024)',
    eyebrow: 'Case Study 04 • Category Creation',
    headline: 'Bootstrapped developer tool from 0 to 120k MAU to successful exit.',
    narrative: 'Grew a command-line developer utility from a weekend prototype into a category-defining workflow suite acquired in 2024.',
    stat1Value: '120k',
    stat1Label: 'ACTIVE MAU',
    stat1Sub: 'Organic operators',
    stat2Value: '$3.4M',
    stat2Label: 'EXIT VALUE',
    stat2Sub: 'Asset acquisition',
    stat3Value: '100%',
    stat3Label: 'BOOTSTRAP',
    stat3Sub: 'Zero dilution',
    handle: 'maya-builds',
    captionLeft: 'FIG. 04 — VENTURE LIFECYCLE',
    captionRight: 'ORGANIC TRAJECTORY',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
};

const ROLE_PROFILES_VI: Record<string, RoleProfile> = {
  designer: {
    id: 'designer',
    tabLabel: '01 / Kiến Trúc Thiết Kế',
    author: 'Elena Vance',
    title: 'Kiến Trúc Sư Hệ Thống Thiết Kế',
    eyebrow: 'Case Study 01 • Design Systems',
    headline: 'Chuẩn hóa thiết kế cho hơn 420 component và 85 nhóm kỹ thuật.',
    narrative: 'Hợp nhất toàn bộ tài nguyên UI thành pipeline token tự động đa nền tảng. Giảm 64% thời gian bàn giao thiết kế sang code trong một quý.',
    stat1Value: '+140%',
    stat1Label: 'TỐC ĐỘ',
    stat1Sub: 'Tăng tốc bàn giao',
    stat2Value: '85',
    stat2Label: 'SQUADS',
    stat2Sub: 'Nhóm đồng bộ',
    stat3Value: '0.02%',
    stat3Label: 'SAI LỆCH',
    stat3Sub: 'Tối thiểu drift',
    handle: 'elena-vance',
    captionLeft: 'HÌNH 01 — KHO THIẾT KẾ V4.2',
    captionRight: 'FIGMA SANG REACT TOKEN',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  marketer: {
    id: 'marketer',
    tabLabel: '02 / Tăng Trưởng & Marketing',
    author: 'Julian Chen',
    title: 'Trưởng Nhóm Growth Engineering',
    eyebrow: 'Case Study 02 • Động Cơ Tăng Trưởng',
    headline: 'Tăng tốc ARR từ $4.2M lên $18M nhờ vòng lặp lan truyền tự nhiên.',
    narrative: 'Xây dựng mô hình phân bổ đa kênh và phễu kích hoạt giúp chuyển đổi từ miễn phí sang trả phí tăng từ 3.8% lên 9.2% không tốn thêm ngân sách quảng cáo.',
    stat1Value: '+320%',
    stat1Label: 'CHUYỂN ĐỔI',
    stat1Sub: 'Tăng trưởng phễu',
    stat2Value: '9.2%',
    stat2Label: 'TRẢ PHÍ',
    stat2Sub: 'Tỷ lệ tiêu chuẩn',
    stat3Value: '$18M',
    stat3Label: 'DOANH THU',
    stat3Sub: 'ARR đạt được',
    handle: 'julian-growth',
    captionLeft: 'HÌNH 02 — PHỄU TĂNG TRƯỞNG',
    captionRight: 'ĐỘNG CƠ KÍCH HOẠT',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  engineer: {
    id: 'engineer',
    tabLabel: '03 / Hệ Thống Phân Tán',
    author: 'Tara Sundaram',
    title: 'Kiến Trúc Sư Hạ Tầng Cốt Lõi',
    eyebrow: 'Case Study 03 • Hạ Tầng Giao Dịch',
    headline: 'Hạ tầng xử lý 45,000 giao dịch/giây với độ trễ phản hồi dưới 12ms.',
    narrative: 'Thiết kế phân vùng database và lớp bộ nhớ đệm tùy chỉnh đạt độ trễ p99 dưới 12ms trong các đợt cao điểm giao dịch toàn cầu, cam kết 99.999% SLA.',
    stat1Value: '12ms',
    stat1Label: 'ĐỘ TRỄ P99',
    stat1Sub: 'Ngân sách phản hồi',
    stat2Value: '45k',
    stat2Label: 'GIAO DỊCH/S',
    stat2Sub: 'Dữ liệu toàn vẹn',
    stat3Value: '99.999%',
    stat3Label: 'UPTIME',
    stat3Sub: 'SLA đa vùng',
    handle: 'tara-infra',
    captionLeft: 'HÌNH 03 — CỤM SỔ CÁI PHÂN TÁN',
    captionRight: 'POSTGRES + REDIS SHARDS',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  founder: {
    id: 'founder',
    tabLabel: '04 / Khởi Nghiệp & Sản Phẩm',
    author: 'Maya Lin',
    title: 'Nhà Sáng Lập & CEO (Đã Thoái Vốn 2024)',
    eyebrow: 'Case Study 04 • Tạo Dựng Danh Mục',
    headline: 'Xây dựng công cụ từ 0 đến 120k người dùng và thoái vốn thành công.',
    narrative: 'Phát triển tiện ích dòng lệnh từ dự án cuối tuần thành bộ giải pháp dẫn đầu thị trường được mua lại thành công vào năm 2024.',
    stat1Value: '120k',
    stat1Label: 'NGƯỜI DÙNG',
    stat1Sub: 'Hoạt động hàng tháng',
    stat2Value: '$3.4M',
    stat2Label: 'THOÁI VỐN',
    stat2Sub: 'Giá trị thương vụ',
    stat3Value: '100%',
    stat3Label: 'TỰ THÂN',
    stat3Sub: 'Không pha loãng vốn',
    handle: 'maya-builds',
    captionLeft: 'HÌNH 04 — CHU KỲ DOANH NGHIỆP',
    captionRight: 'QUỸ ĐẠO TĂNG TRƯỞNG',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
};

const EXHIBITION_CHAPTERS_EN = [
  {
    num: '01',
    tag: 'CHAPTER 01 // ARCHITECTURE',
    title: 'Fullscreen Presentation Deck',
    headline: 'Recruiters and clients step through your accomplishments instead of scanning past.',
    body: 'Fluid keyboard navigation (← / →), slide snap physics, ambient depth transitions, and a cinematic spotlight for every project case study.',
    statValue: '+140%',
    statLabel: 'ENGAGEMENT LIFT',
    statDesc: 'Median acceleration in recruiter dwell time compared to flat document submissions.',
  },
  {
    num: '02',
    tag: 'CHAPTER 02 // VELOCITY',
    title: 'Rapid Synthesis in 180s',
    headline: 'Built in 3 minutes. Zero layout fatigue. Zero templates that feel like templates.',
    body: 'Simply enter your key accomplishments, media assets, or campaign notes. Our layout compositor synthesizes balanced typographical slides with deliberate hierarchy.',
    statValue: '180s',
    statLabel: 'SETUP DURATION',
    statDesc: 'From raw career milestones to a live, responsive exhibition pitch deck.',
  },
  {
    num: '03',
    tag: 'CHAPTER 03 // INTELLIGENCE',
    title: 'Real-time Visitor Radar',
    headline: 'Executive dwell time telemetry. Know the exact moment opportunities open.',
    body: 'Receive live alerts when a hiring director or prospective partner explores your deck. Review slide-by-slide metrics showing which case studies captured their focus.',
    statValue: '3m 48s',
    statLabel: 'AVERAGE DWELL',
    statDesc: 'Executive dwell time vs the industry average of 6.2 seconds on a PDF.',
  },
];

const EXHIBITION_CHAPTERS_VI = [
  {
    num: '01',
    tag: 'PHẦN 01 // KIẾN TRÚC SLIDE',
    title: 'Fullscreen Presentation Deck',
    headline: 'Nhà tuyển dụng và đối tác lật mở từng cột mốc của bạn thay vì cuộn lướt qua.',
    body: 'Điều hướng bằng phím mũi tên (← / →), hiệu ứng trượt mượt mà, chuyển động điện ảnh tôn vinh từng case study dự án.',
    statValue: '+140%',
    statLabel: 'HIỆU QUẢ CHÚ Ý',
    statDesc: 'Gia tăng thời gian quan tâm của nhà tuyển dụng so với các hồ sơ PDF thông thường.',
  },
  {
    num: '02',
    tag: 'PHẦN 02 // TỐC ĐỘ THIẾT LẬP',
    title: 'Khởi Tạo Nhanh Trong 180s',
    headline: 'Hoàn thành chỉ trong 3 phút. Không tốn công căn chỉnh, không gò bó khuôn mẫu.',
    body: 'Chỉ cần nhập các cột mốc, hình ảnh dự án hoặc số liệu nổi bật. Hệ thống tự động dàn trang với tỷ lệ typographic sắc nét.',
    statValue: '180s',
    statLabel: 'THỜI GIAN THIẾT LẬP',
    statDesc: 'Từ ghi chú sự nghiệp thô đến trang portfolio trình chiếu sống động trên web.',
  },
  {
    num: '03',
    tag: 'PHẦN 03 // RADAR THEO DÕI',
    title: 'Radar Nhà Tuyển Dụng',
    headline: 'Đo lường thời gian lưu lại thực tế. Nắm bắt khoảnh khắc cơ hội mở ra.',
    body: 'Nhận thông báo khi giám đốc tuyển dụng hoặc đối tác xem hồ sơ. Xem bản đồ nhiệt từng slide để biết dự án nào giữ chân họ lâu nhất.',
    statValue: '3m 48s',
    statLabel: 'THỜI GIAN XEM',
    statDesc: 'Thời gian lưu lại trên slide deck so với mức 6.2 giây trung bình của CV giấy.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // Theme & Language state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  // Interactive showcase state
  const [activeRoleKey, setActiveRoleKey] = useState<string>('designer');
  const [claimHandle, setClaimHandle] = useState<string>('elena-vance');
  
  // Carousel Chapter State for Section 02
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Initialize theme & language from localStorage and enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }

    const savedLang = localStorage.getItem('soodfolio-lang') as 'en' | 'vi' | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navbarOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('soodfolio-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'vi' : 'en';
    setLang(next);
    localStorage.setItem('soodfolio-lang', next);
  };

  const roles = lang === 'vi' ? ROLE_PROFILES_VI : ROLE_PROFILES_EN;
  const chapters = lang === 'vi' ? EXHIBITION_CHAPTERS_VI : EXHIBITION_CHAPTERS_EN;
  const activeProfile = roles[activeRoleKey] || roles.designer;
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  const handleRoleSelect = (roleKey: string) => {
    setActiveRoleKey(roleKey);
    const selected = roles[roleKey];
    if (selected) {
      setClaimHandle(selected.handle);
    }
  };

  const nextChapter = () => {
    setActiveChapterIndex((prev) => (prev + 1) % chapters.length);
  };

  const prevChapter = () => {
    setActiveChapterIndex((prev) => (prev - 1 + chapters.length) % chapters.length);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimHandle.trim().toLowerCase();
    if (clean) {
      if (isAuthenticated) {
        router.push(`/${encodeURIComponent(clean)}`);
      } else {
        router.push(`/register?username=${encodeURIComponent(clean)}`);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fafcfc] dark:bg-[#080d12] text-[#0f172a] dark:text-[#f8fafc] font-sans antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. ULTRA-CLEAN FLOATING HEADER (ALWAYS INCLUDES THEME & LANG TOGGLES)     */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafcfc]/85 dark:bg-[#080d12]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group tracking-tighter">
            <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white uppercase font-sans">
              SOODFOLIO
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)] group-hover:scale-125 transition-transform" />
          </Link>

          {/* Nav links with Smooth Scrolling */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a 
              href="#stage" 
              onClick={(e) => scrollToSection(e, 'stage')} 
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Sân Khấu' : 'The Stage'}
            </a>
            <a 
              href="#exhibition" 
              onClick={(e) => scrollToSection(e, 'exhibition')} 
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Triển Lãm' : 'Exhibition'}
            </a>
            <a 
              href="#comparison" 
              onClick={(e) => scrollToSection(e, 'comparison')} 
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Kinh Tế Học' : 'Comparison'}
            </a>
            <a 
              href="#manifesto" 
              onClick={(e) => scrollToSection(e, 'manifesto')} 
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Nhận Xét' : 'Citation'}
            </a>
          </nav>

          {/* Right Action Bar (Theme, Lang, Auth) */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            
            {/* Language Toggle (EN / VI) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/10 hover:border-teal-600 dark:hover:border-teal-400 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
              title={lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-black/[0.08] dark:border-white/10 hover:border-teal-600 dark:hover:border-teal-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Chuyển sang Dark Mode'}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-teal-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Live Demo link */}
            <Link
              href="/alex"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/10 hover:border-teal-600 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            </Link>

            {/* Auth actions */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-semibold transition-all shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-2.5 py-1.5 uppercase text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  {lang === 'vi' ? 'Đăng Nhập' : 'Log In'}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <span>{lang === 'vi' ? 'Bắt Đầu' : 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. REFINED HUMAN-SCALE STAGE HERO (BALANCED TYPOGRAPHY, BREATHABLE)       */}
      {/* ========================================================================= */}
      <main className="w-full pt-18">
        <section id="stage" className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden pt-8 pb-14 px-5 sm:px-8 max-w-[1320px] mx-auto scroll-mt-24">
          
          {/* Subtle Luminous Cyan-Teal Ambient Dome */}
          <div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-50 dark:opacity-25 blur-3xl rounded-full" 
            style={{
              background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.22) 0%, rgba(20, 184, 166, 0.18) 35%, rgba(6, 182, 212, 0.08) 60%, transparent 80%)',
            }}
          />

          {/* Telemetry Strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-4 pt-2">
            <div className="flex items-center gap-2.5 font-mono text-xs text-teal-700 dark:text-[#2dd4bf] font-bold">
              <span>{lang === 'vi' ? 'GIAI ĐOẠN 01 // SẴN SÀNG TRÌNH DIỄN' : 'STAGE 01 // EXHIBITION READY'}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                {lang === 'vi' ? 'TRÌNH CHIẾU LIÊN TỤC 4K' : 'PRESENTATION RUNTIME: CONTINUOUS'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600 dark:bg-teal-400" />
              </span>
              <span>
                {lang === 'vi' ? 'Nhà tuyển dụng từ' : 'Hiring Execs from'}{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">Linear, Stripe &amp; Apple</strong>{' '}
                {lang === 'vi' ? 'đang xem trực tiếp' : 'Live In-Audience'}
              </span>
            </div>
          </div>

          {/* Refined Headline & Subtitle (Balanced, not suffocating) */}
          <div className="relative z-10 my-auto py-8 sm:py-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.04] text-slate-950 dark:text-white uppercase font-sans">
                {lang === 'vi' ? 'Tạm biệt bản PDF tẻ nhạt.' : 'Ditch the flat pdf.'}<br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 dark:from-teal-300 dark:via-cyan-300 dark:to-teal-200 bg-clip-text text-transparent">
                  {lang === 'vi' ? 'Trình diễn sự nghiệp của bạn.' : 'Stage your career.'}
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg lg:text-xl font-normal text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {lang === 'vi' 
                  ? 'Biến các cột mốc nghề nghiệp thành bản trình chiếu tương tác toàn màn hình. Dành cho các chuyên gia và lãnh đạo muốn nổi bật hơn một trang giấy in A4.'
                  : 'Transform career milestones into an expansive, interactive presentation. For designers, leaders, builders, and operators who refuse to fit on a flat 8.5×11 sheet.'
                }
              </p>
            </div>

            {/* Unboxed Role Navigation Switcher */}
            <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 shrink-0">
                {lang === 'vi' ? 'Góc nhìn:' : 'Stage View:'}
              </span>
              {Object.keys(roles).map((key) => {
                const isActive = activeRoleKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleSelect(key)}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {roles[key].tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cinematic Presentation Stage Viewport */}
          <div className="relative z-10 w-full pt-6 pb-10 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold">
                    {activeProfile.eyebrow}
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {activeProfile.author}
                  </span>
                  <span className="text-slate-400 font-light text-lg">/</span>
                  <span className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-400">
                    {activeProfile.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span className="hidden md:inline-block tracking-wider uppercase">SLIDE 01 OF 06</span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-6 rounded-full bg-teal-600 dark:bg-teal-400" />
                  <span className="h-1.5 w-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                  <span className="h-1.5 w-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>

            {/* Split Column Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Narrative & Metrics */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-slate-950 dark:text-white font-sans">
                    {activeProfile.headline}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg font-normal text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {activeProfile.narrative}
                  </p>
                </div>

                {/* Freestanding Metrics */}
                <div className="mt-10 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                      {activeProfile.stat1Label}
                    </div>
                    <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-teal-700 dark:text-[#2dd4bf] font-sans">
                      {activeProfile.stat1Value}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {activeProfile.stat1Sub}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                      {activeProfile.stat2Label}
                    </div>
                    <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white font-sans">
                      {activeProfile.stat2Value}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {activeProfile.stat2Sub}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                      {activeProfile.stat3Label}
                    </div>
                    <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white font-sans">
                      {activeProfile.stat3Value}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {activeProfile.stat3Sub}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-black/[0.08] dark:border-white/10 group">
                  <img
                    src={activeProfile.imageUrl}
                    alt={activeProfile.headline}
                    className="w-full h-full object-cover object-center filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-mono border-b border-black/[0.06] dark:border-white/[0.08] pb-2 text-slate-500 dark:text-slate-400">
                  <span className="text-slate-950 dark:text-white uppercase tracking-wider font-bold">
                    {activeProfile.captionLeft}
                  </span>
                  <span className="text-teal-700 dark:text-[#2dd4bf]">
                    {activeProfile.captionRight}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SPOTLIGHT COMMAND BAR */}
          <div className="relative z-20 mt-4 w-full max-w-xl mx-auto">
            <form onSubmit={handleClaimSubmit} className="bg-[#fafcfc]/90 dark:bg-[#0c141d]/90 backdrop-blur-2xl border border-black/[0.1] dark:border-white/15 rounded-full p-1.5 pl-5 flex items-center justify-between shadow-xl hover:border-teal-600 dark:hover:border-teal-400 transition-all">
              <div className="flex items-center gap-2 flex-1 mr-3 overflow-hidden">
                <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-xs text-slate-400 select-none shrink-0">
                  soodfolio.com/
                </span>
                <input
                  type="text"
                  value={claimHandle}
                  onChange={(e) => setClaimHandle(e.target.value)}
                  placeholder="your-name"
                  spellCheck={false}
                  className="bg-transparent border-none p-0 text-xs sm:text-sm font-mono font-semibold text-slate-950 dark:text-white focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-950 px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer font-bold"
              >
                <span>{lang === 'vi' ? 'Giữ Chỗ' : 'Claim'}</span>
                <span className="text-xs">↵</span>
              </button>
            </form>
            <p className="mt-2.5 text-center font-mono text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {lang === 'vi' ? 'Link thương hiệu riêng • Không cần thẻ tín dụng • Xuất bản tức thì' : 'Reserve vanity link • No credit card required • Instant live deployment'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION 02: HORIZONTAL EXHIBITION SLIDER (SLIDES 01 -> 02 -> 03)       */}
        {/* ========================================================================= */}
        <section id="exhibition" className="w-full py-20 px-5 sm:px-8 max-w-[1320px] mx-auto border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
          
          {/* Header with Title and Slide Navigation Arrows */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold">
                {lang === 'vi' ? '[ DANH MỤC TRÌNH DIỄN ]' : '[ EXHIBITION CATALOGUE ]'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-slate-950 dark:text-white mt-2 font-sans">
                {lang === 'vi' 
                  ? 'Chuẩn mực trình diễn xứng tầm với tác phẩm của bạn.' 
                  : 'A presentation standard worthy of what you have built.'}
              </h2>
              <p className="mt-3 text-base sm:text-lg font-normal text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {lang === 'vi'
                  ? 'Không còn những chiếc CV chật chội. Bấm mũi tên bên phải để lật mở từng chương trình diễn.'
                  : 'The PDF graveyard is over. Click the slide arrows to step through the chapters.'}
              </p>
            </div>

            {/* Slider Navigation Arrows & Indicators */}
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="text-xs text-slate-400">
                {lang === 'vi' ? 'CHƯƠNG' : 'CHAPTER'}{' '}
                <strong className="text-slate-900 dark:text-white font-bold">{activeChapter.num}</strong>{' '}
                / 0{chapters.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevChapter}
                  className="p-2.5 rounded-full border border-black/[0.1] dark:border-white/15 hover:border-teal-600 dark:hover:border-teal-400 hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95"
                  aria-label="Previous Chapter"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextChapter}
                  className="p-2.5 rounded-full border border-black/[0.1] dark:border-white/15 hover:border-teal-600 dark:hover:border-teal-400 hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95"
                  aria-label="Next Chapter"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Slide Chapter Canvas (STRICT FIXED HEIGHT & HORIZONTAL SLIDER) */}
          <div className="relative rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-10 lg:p-12 h-[560px] sm:h-[480px] md:h-[430px] lg:h-[390px] flex flex-col justify-between overflow-hidden">
            
            {/* Horizontal Sliding Viewport */}
            <div className="relative w-full overflow-hidden flex-1 flex items-center">
              <div 
                className="flex w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeChapterIndex * 100}%)` }}
              >
                {chapters.map((ch) => (
                  <div 
                    key={ch.num} 
                    className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                  >
                    {/* Left Column: Chapter Title & Body */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                      <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold block mb-2">
                        {ch.tag}
                      </span>
                      
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white font-sans line-clamp-1">
                        {ch.title}
                      </h3>

                      <p className="text-base sm:text-lg lg:text-xl font-normal leading-snug text-slate-800 dark:text-slate-200 mt-2 line-clamp-2">
                        {ch.headline}
                      </p>

                      <p className="text-xs sm:text-sm lg:text-base font-normal text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mt-2 line-clamp-3">
                        {ch.body}
                      </p>
                    </div>

                    {/* Right Column: Quantitative Proof Metric */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-black/[0.06] dark:border-white/[0.08] pt-6 lg:pt-0 lg:pl-10 flex flex-col justify-center">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                        {ch.statLabel}
                      </span>
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-teal-700 dark:text-[#2dd4bf] my-1 font-sans">
                        {ch.statValue}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-snug line-clamp-2">
                        {ch.statDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Segment Dots & Controls */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.num}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`h-1.5 transition-all rounded-full cursor-pointer ${
                      idx === activeChapterIndex 
                        ? 'w-10 bg-teal-600 dark:bg-teal-400' 
                        : 'w-3 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
                    }`}
                    aria-label={`Jump to chapter ${ch.num}`}
                  />
                ))}
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                <span className="hidden sm:inline">Use arrows to step through chapters</span>
                <button
                  type="button"
                  onClick={nextChapter}
                  className="hover:text-teal-600 dark:hover:text-teal-300 inline-flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>{lang === 'vi' ? 'Tiếp Theo' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION 03: ATTENTION ECONOMICS (COMPARISON SPLIT)                     */}
        {/* ========================================================================= */}
        <section id="comparison" className="w-full py-20 px-5 sm:px-8 max-w-[1320px] mx-auto scroll-mt-24">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold">
              {lang === 'vi' ? '[ KINH TẾ HỌC CHÚ Ý ]' : '[ ATTENTION ECONOMICS ]'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-slate-950 dark:text-white mt-2 font-sans">
              {lang === 'vi'
                ? 'Bản PDF là nơi những ứng viên xuất sắc trở nên mờ nhạt như nhau.'
                : 'The PDF is where great candidates become interchangeable.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* The Flat 1-Page Graveyard */}
            <div className="border-t border-black/[0.1] dark:border-white/10 pt-6 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  {lang === 'vi' ? 'ĐỊNH DẠNG CŨ' : 'LEGACY FORMAT'}
                </span>
                <span className="line-through font-mono text-xs text-slate-400">
                  {lang === 'vi' ? 'HỐ ĐEN ATS' : 'ATS VOID'}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-light tracking-tight text-slate-500 dark:text-slate-400 uppercase font-sans">
                {lang === 'vi' ? 'Nghĩa Trang CV 1 Trang' : 'The Flat 1-Page Graveyard'}
              </h3>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-4xl sm:text-6xl font-extralight tracking-tight text-slate-400 line-through">
                    6.2s
                  </div>
                  <p className="mt-1 text-sm text-slate-500 font-light">
                    {lang === 'vi' 
                      ? 'Thời gian lướt qua trung bình trước khi bị chuyển sang hồ sơ kế tiếp.' 
                      : 'Average glance time before a fatigued screener moves to the next pile.'}
                  </p>
                </div>
                <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-5 space-y-3.5 text-sm text-slate-600 dark:text-slate-400 font-light">
                  <p className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-mono">—</span>
                    <span>{lang === 'vi' ? 'Không có bằng chứng tương tác: hệ thống, video demo và sản phẩm thực tế bị biến thành chữ đen đơn điệu.' : 'Zero interactive proof: systems, video walkthroughs, and live products are flattened into plain text.'}</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-mono">—</span>
                    <span>{lang === 'vi' ? 'Nộp hồ sơ mù quáng: không bao giờ biết tài liệu có được mở ra hay bị bỏ qua.' : 'Blind submission: you never know if your document was opened, ignored, or forwarded.'}</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-mono">—</span>
                    <span>{lang === 'vi' ? 'Không có cá tính: hàng năm trời nỗ lực bị ép vào font Times New Roman và lề giấy cố định.' : 'Zero personality: your decade of hard-won taste is forced into Times New Roman and standard margins.'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* The Cinematic Stage */}
            <div className="border-t-2 border-teal-600 dark:border-teal-400 pt-6">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold">
                  {lang === 'vi' ? 'CHUẨN SOODFOLIO' : 'SOODFOLIO STANDARD'}
                </span>
                <span className="text-xs font-mono text-teal-700 dark:text-[#2dd4bf] font-bold tracking-wider uppercase">
                  {lang === 'vi' ? 'DANH TIẾNG TÍCH CỰC' : 'ACTIVE REPUTATION'}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white uppercase font-sans">
                {lang === 'vi' ? 'Sân Khấu Điện Ảnh' : 'The Cinematic Stage'}
              </h3>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-4xl sm:text-6xl font-black tracking-tight text-teal-700 dark:text-[#2dd4bf]">
                    4.8×
                  </div>
                  <p className="mt-1 text-sm text-slate-900 dark:text-white font-medium">
                    {lang === 'vi' ? 'Gia tăng tỷ lệ mời phỏng vấn trực tiếp với cấp quản lý.' : 'Higher invite-to-executive onsite interview conversion rate.'}
                  </p>
                </div>
                <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-5 space-y-3.5 text-sm text-slate-900 dark:text-slate-200">
                  <p className="flex items-start gap-2.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                    <span>{lang === 'vi' ? 'Sân khấu trình diễn liên tục: người xem theo dõi câu chuyện có chủ đích theo từng slide.' : 'Continuous presentation theater: recruiters review an intentional story slide-by-slide, not a compressed checklist.'}</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                    <span>{lang === 'vi' ? 'Tích hợp tài liệu sống: hình ảnh chất lượng cao, video prototype và số liệu KPI định lượng.' : 'Embedded dynamic artifacts: high-res case study architectures, prototypes, and verified quantitative KPI badges.'}</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                    <span>{lang === 'vi' ? 'Đặt lịch hẹn trực tiếp: kết nối ngay với nhà tuyển dụng ngay tại slide cuối cùng.' : 'Direct partner contact integration: bypass screening email ping-pong directly from your closing slide.'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SECTION 04: EDITORIAL CITATION                                        */}
        {/* ========================================================================= */}
        <section id="manifesto" className="w-full py-20 px-5 sm:px-8 max-w-[1320px] mx-auto border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
          <div className="relative">
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-[#2dd4bf] font-bold block mb-8">
              {lang === 'vi' ? '[ NHẬN XÉT CHUYÊN GIA ]' : '[ EXECUTIVE CITATION ]'}
            </span>
            <blockquote className="text-xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-snug text-slate-950 dark:text-white relative z-10 max-w-4xl">
              {lang === 'vi' 
                ? '“Khi ứng viên gửi cho tôi bản SoodFolio deck, tôi không chỉ thấy danh sách công việc. Tôi thấy rõ tư duy quyết định, gu thẩm mỹ và phong thái thuyết trình của họ trước cả khi phỏng vấn.”'
                : '“When candidates send me a SoodFolio deck, I don\'t just see a chronological list of jobs. I see their exact decision rationale, taste level, and executive presentation ability before we ever speak.”'
              }
            </blockquote>
            <div className="mt-10 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden grayscale border border-black/10 dark:border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Marcus H. Thorne portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950 dark:text-white font-sans">
                    Marcus H. Thorne
                  </div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    VP of Product &amp; Design • Former Stripe &amp; Linear
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                VERIFIED INDUSTRY REVIEW • SAN FRANCISCO, CA
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SECTION 05: ELEVATE YOUR NEXT CAREER CHAPTER (EXACT V1 CARD YOU LOVE)   */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 pt-6 w-full">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#f0fdfa] via-[#ffffff] to-[#ccfbf1]/50 dark:from-[#08151a] dark:via-[#091116] dark:to-[#071317] p-8 sm:p-14 lg:p-16 shadow-[0_20px_50px_-12px_rgba(13,148,136,0.18),0_4px_20px_rgba(0,0,0,0.06)] border border-teal-200/60 dark:border-teal-500/20 overflow-hidden flex flex-col items-center text-center">
            
            {/* Soft Ambient Orbs */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-teal-400/20 dark:bg-teal-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/20 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />

            {/* Tagline Badge */}
            <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 tracking-[0.2em] uppercase mb-3">
              {lang === 'vi' ? 'SỞ HỮU SLIDE DECK TRONG VÀI GIÂY' : 'CLAIM YOUR SLIDE DECK IN SECONDS'}
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 dark:text-white max-w-2xl leading-tight font-sans">
              {lang === 'vi' ? 'Nâng tầm chương mới trong sự nghiệp của bạn.' : 'Elevate your next career chapter.'}
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg font-normal text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {lang === 'vi'
                ? 'Đừng để bản thân bị lãng quên trong hòm thư tuyển dụng. Tỏa sáng với trang trình diễn toàn màn hình mà nhà tuyển dụng thực sự nhớ đến.'
                : 'Stop fading into Applicant Tracking Systems. Stand out with a radiant, full-screen portfolio deck that recruiters actually remember.'}
            </p>

            {/* Two Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-sm sm:text-base shadow-[0_6px_20px_rgba(13,148,136,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
              >
                <span>{lang === 'vi' ? 'Tạo Slide Deck Miễn Phí' : 'Create Your Free Deck'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/alex"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-900 dark:text-white font-semibold text-sm sm:text-base border border-slate-200 dark:border-white/10 shadow-sm transition-all w-full sm:w-auto"
              >
                {lang === 'vi' ? 'Xem Thư Viện Mẫu' : 'Explore Showcase Gallery'}
              </Link>
            </div>

            {/* Verification Checkmarks */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
                {lang === 'vi' ? 'Không cần thẻ tín dụng' : 'No credit card needed'}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
                {lang === 'vi' ? 'Bao gồm link tên miền riêng' : 'Custom vanity URL included'}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 7. UNBOXED MINIMAL EDITORIAL FOOTER                                      */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.08] bg-[#fafcfc] dark:bg-[#080d12] transition-colors duration-200">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white uppercase font-sans">
                  SOODFOLIO
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              </div>
              <p className="font-light text-slate-600 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                {lang === 'vi'
                  ? 'Nền tảng trình chiếu hồ sơ năng lực dành cho các nhà thiết kế, kỹ sư, nhà tiếp thị và người sáng lập chuyên nghiệp.'
                  : 'Unboxed interactive presentation software engineered for discerning designers, engineers, marketers, and founders who present with purpose.'}
              </p>
            </div>

            <div className="md:col-span-2">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-3">
                {lang === 'vi' ? 'DANH MỤC' : 'CURATION'}
              </span>
              <div className="flex flex-col space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <Link href="/alex" className="hover:text-slate-950 dark:hover:text-white transition-colors">Showcase Index</Link>
                <a href="#stage" onClick={(e) => scrollToSection(e, 'stage')} className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">Stage Engine</a>
                <a href="#exhibition" onClick={(e) => scrollToSection(e, 'exhibition')} className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">Exhibition</a>
                <a href="#comparison" onClick={(e) => scrollToSection(e, 'comparison')} className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">Comparison</a>
              </div>
            </div>

            <div className="md:col-span-3">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-3">
                {lang === 'vi' ? 'NGÀNH NGHỀ' : 'DISCIPLINES'}
              </span>
              <div className="flex flex-col space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <button type="button" onClick={() => handleRoleSelect('designer')} className="text-left hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">
                  Product Designers
                </button>
                <button type="button" onClick={() => handleRoleSelect('engineer')} className="text-left hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">
                  Distributed Systems Engineers
                </button>
                <button type="button" onClick={() => handleRoleSelect('marketer')} className="text-left hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">
                  Growth &amp; Marketing Leaders
                </button>
                <button type="button" onClick={() => handleRoleSelect('founder')} className="text-left hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer">
                  Venture Founders &amp; Operators
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-3">
                {lang === 'vi' ? 'NỀN TẢNG' : 'PLATFORM'}
              </span>
              <div className="flex flex-col space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <Link href="/login" className="hover:text-slate-950 dark:hover:text-white transition-colors">Log In</Link>
                <Link href="/register" className="hover:text-slate-950 dark:hover:text-white transition-colors">Create Portfolio</Link>
                <a href="#manifesto" className="hover:text-slate-950 dark:hover:text-white transition-colors">Citation</a>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Normal
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-slate-400 dark:text-slate-500">
            <div>© {new Date().getFullYear()} SOODFOLIO PLATFORM.</div>
            <div className="flex items-center gap-4">
              <span>NEXT.JS 16 APP ROUTER</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>SPRING BOOT 3 API ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

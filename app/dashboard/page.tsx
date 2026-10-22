'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';
import { PortfolioData, ProjectDto, ExperienceDto, SkillDto } from '@/types/portfolio';
import { ProjectModal } from '@/components/dashboard/ProjectModal';
import { ExperienceModal } from '@/components/dashboard/ExperienceModal';
import { ProfileModal } from '@/components/dashboard/ProfileModal';
import {
  Layers,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Eye,
  LogOut,
  AlertCircle,
  Loader2,
  User,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Sparkles,
  Briefcase,
  FolderGit2,
  Cpu,
  Sliders,
  MapPin,
  Calendar,
  Globe,
  Share2,
  Monitor,
  EyeOff,
  ArrowRight,
  Code2,
  MoreVertical
} from 'lucide-react';

const SKILL_CATEGORIES = [
  'LANGUAGES',
  'FRAMEWORKS',
  'DATABASES',
  'DEVOPS',
  'AI_ENGINEERING',
  'TOOLS',
];

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGES: 'Languages & Core',
  FRAMEWORKS: 'Frameworks & Libraries',
  DATABASES: 'Databases & Storage',
  DEVOPS: 'DevOps & Cloud',
  AI_ENGINEERING: 'AI & Machine Learning',
  TOOLS: 'Tools & Workflows',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSlide, setActiveSlide] = useState<'cover' | 'projects' | 'experience' | 'skills' | 'settings'>('cover');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Theme switcher state (Dark/Light) & Language state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const isDark = saved ? saved === 'dark' : document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);

    const savedLang = localStorage.getItem('soodfolio-lang') as 'vi' | 'en' | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('soodfolio-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const toggleLang = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    localStorage.setItem('soodfolio-lang', next);
  };

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceDto | null>(null);

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Skills quick add state
  const [newSkillCategory, setNewSkillCategory] = useState('LANGUAGES');
  const [newSkillName, setNewSkillName] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  // Deleting item states
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deletingExperienceId, setDeletingExperienceId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load portfolio from /portfolios/me
  const loadPortfolio = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Failed to load portfolio workspace:', err);
    } finally {
      setLoadingPortfolio(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (isAuthenticated) {
      loadPortfolio();
    }
  }, [authLoading, isAuthenticated, loadPortfolio, router]);

  // Handle visibility toggle (Live vs Draft)
  const handleToggleStatus = async () => {
    if (!portfolio || isUpdatingStatus) return;

    const newStatus = !portfolio.isPublished;
    setPortfolio((prev) => (prev ? { ...prev, isPublished: newStatus } : null));
    setIsUpdatingStatus(true);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPortfolio((prev) =>
          prev
            ? {
                ...prev,
                isPublished: updated.isPublished !== undefined ? updated.isPublished : newStatus,
              }
            : null
        );
        showToast(`Trạng thái trình chiếu: ${newStatus ? 'ĐANG CÔNG KHAI' : 'BẢN NHÁP RIÊNG TƯ'}`);
      } else {
        setPortfolio((prev) => (prev ? { ...prev, isPublished: !newStatus } : null));
        showToast('Không thể cập nhật trạng thái', 'error');
      }
    } catch {
      setPortfolio((prev) => (prev ? { ...prev, isPublished: !newStatus } : null));
      showToast('Lỗi kết nối khi cập nhật trạng thái', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Section visibility toggle in Settings
  const handleToggleSection = async (
    field: 'showExperience' | 'showProjects' | 'showSkills' | 'showEducation' | 'showContact'
  ) => {
    if (!portfolio) return;
    const currentVal = portfolio[field];
    const newVal = !currentVal;

    // Optimistic update
    setPortfolio((prev) => (prev ? { ...prev, [field]: newVal } : null));

    try {
      const payload = {
        title: portfolio.title,
        tagline: portfolio.tagline,
        bio: portfolio.bio,
        statusText: portfolio.statusText,
        resumeUrl: portfolio.resumeUrl,
        themeMode: portfolio.themeMode,
        showExperience: field === 'showExperience' ? newVal : portfolio.showExperience,
        showProjects: field === 'showProjects' ? newVal : portfolio.showProjects,
        showSkills: field === 'showSkills' ? newVal : portfolio.showSkills,
        showEducation: field === 'showEducation' ? newVal : portfolio.showEducation,
        showContact: field === 'showContact' ? newVal : portfolio.showContact,
        socialLinks: portfolio.socialLinks,
      };

      const res = await fetchWithAuth(`${API_BASE}/portfolios/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setPortfolio(updated);
        showToast('Đã lưu cấu hình hiển thị slide.');
      } else {
        setPortfolio((prev) => (prev ? { ...prev, [field]: currentVal } : null));
        showToast('Không thể lưu cài đặt hiển thị.', 'error');
      }
    } catch {
      setPortfolio((prev) => (prev ? { ...prev, [field]: currentVal } : null));
      showToast('Lỗi khi lưu cài đặt.', 'error');
    }
  };

  // Copy public link
  const handleCopyLink = () => {
    const handle = portfolio?.username || user?.username || 'me';
    const liveUrl = `${window.location.origin}/preview/${handle}`;
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    showToast('Đã sao chép liên kết trình chiếu vào clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // --- Project CRUD Handlers ---
  const handleOpenAddProject = () => {
    setSelectedProject(null);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: ProjectDto) => {
    setSelectedProject(proj);
    setProjectModalOpen(true);
  };

  const handleSavedProject = (saved: ProjectDto) => {
    setPortfolio((prev) => {
      if (!prev) return null;
      const exists = prev.projects.some((p) => p.id === saved.id);
      const updatedProjects = exists
        ? prev.projects.map((p) => (p.id === saved.id ? saved : p))
        : [...prev.projects, saved];
      return { ...prev, projects: updatedProjects };
    });
    showToast(selectedProject ? 'Đã cập nhật dự án.' : 'Đã tạo dự án mới.');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá dự án này khỏi slide deck?')) return;
    setDeletingProjectId(projectId);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPortfolio((prev) =>
          prev ? { ...prev, projects: prev.projects.filter((p) => p.id !== projectId) } : null
        );
        showToast('Đã xoá dự án khỏi slide.');
      } else {
        showToast('Không thể xoá dự án.', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi xoá dự án.', 'error');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (!portfolio) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolio.projects.length) return;

    const newProjects = [...portfolio.projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setPortfolio((prev) => (prev ? { ...prev, projects: newProjects } : null));

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/projects/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds: newProjects.map((p) => p.id) }),
      });
      showToast('Đã thay đổi thứ tự dự án.');
    } catch {
      showToast('Không thể lưu thứ tự dự án.', 'error');
    }
  };

  // --- Experience CRUD Handlers ---
  const handleOpenAddExperience = () => {
    setSelectedExperience(null);
    setExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (exp: ExperienceDto) => {
    setSelectedExperience(exp);
    setExperienceModalOpen(true);
  };

  const handleSavedExperience = (saved: ExperienceDto) => {
    setPortfolio((prev) => {
      if (!prev) return null;
      const exists = prev.experiences.some((e) => e.id === saved.id);
      const updatedExperiences = exists
        ? prev.experiences.map((e) => (e.id === saved.id ? saved : e))
        : [...prev.experiences, saved];
      return { ...prev, experiences: updatedExperiences };
    });
    showToast(selectedExperience ? 'Đã cập nhật kinh nghiệm.' : 'Đã thêm kinh nghiệm mới.');
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá mốc sự nghiệp này?')) return;
    setDeletingExperienceId(experienceId);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/${experienceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPortfolio((prev) =>
          prev ? { ...prev, experiences: prev.experiences.filter((e) => e.id !== experienceId) } : null
        );
        showToast('Đã xoá mốc sự nghiệp.');
      } else {
        showToast('Không thể xoá kinh nghiệm.', 'error');
      }
    } catch {
      showToast('Lỗi khi xoá kinh nghiệm.', 'error');
    } finally {
      setDeletingExperienceId(null);
    }
  };

  const handleMoveExperience = async (index: number, direction: 'up' | 'down') => {
    if (!portfolio) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolio.experiences.length) return;

    const newExps = [...portfolio.experiences];
    const temp = newExps[index];
    newExps[index] = newExps[targetIndex];
    newExps[targetIndex] = temp;

    setPortfolio((prev) => (prev ? { ...prev, experiences: newExps } : null));

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceIds: newExps.map((e) => e.id) }),
      });
      showToast('Đã thay đổi thứ tự kinh nghiệm.');
    } catch {
      showToast('Không thể lưu thứ tự kinh nghiệm.', 'error');
    }
  };

  // --- Skills Quick Add & Delete Handlers ---
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsAddingSkill(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newSkillCategory,
          name: newSkillName.trim(),
        }),
      });

      if (res.ok) {
        const addedSkill: SkillDto = await res.json();
        setPortfolio((prev) => (prev ? { ...prev, skills: [...prev.skills, addedSkill] } : null));
        setNewSkillName('');
        showToast(`Đã thêm kỹ năng: ${addedSkill.name}`);
      } else {
        showToast('Không thể thêm kỹ năng.', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi thêm kỹ năng.', 'error');
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setDeletingSkillId(skillId);
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/skills/${skillId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPortfolio((prev) =>
          prev ? { ...prev, skills: prev.skills.filter((s) => s.id !== skillId) } : null
        );
        showToast('Đã gỡ kỹ năng.');
      } else {
        showToast('Không thể gỡ kỹ năng.', 'error');
      }
    } catch {
      showToast('Lỗi khi gỡ kỹ năng.', 'error');
    } finally {
      setDeletingSkillId(null);
    }
  };

  // Profile Save
  const handleSavedProfile = (updated: PortfolioData) => {
    setPortfolio(updated);
    showToast('Đã cập nhật thông tin hồ sơ & slide giới thiệu.');
  };

  const username = portfolio?.username || user?.username || 'member';
  const fullName = portfolio?.fullName || user?.fullName || 'Chuyên gia Sáng tạo';
  const liveUrl = `/preview/${username}`;

  if (authLoading || (loadingPortfolio && !portfolio)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#080d12] text-slate-600 dark:text-slate-300 font-sans text-sm gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="tracking-wide text-xs uppercase font-mono text-slate-500">Đang chuẩn bị không gian Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-600 dark:selection:text-teal-300">
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

      {/* Top Deck Studio Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#080d12]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left Brand & Deck Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Trang chủ SoodFolio">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-transform group-hover:scale-105">
                <Layers className="h-4 w-4" />
              </div>
              <span className="font-extrabold tracking-tight text-sm sm:text-base text-slate-900 dark:text-white flex-shrink-0">
                SOODFOLIO
              </span>
            </Link>

            <span className="hidden sm:inline text-slate-300 dark:text-white/20">/</span>

            {/* Deck Title & Live Link Pill */}
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[110px] md:max-w-[160px] lg:max-w-[200px]">
                {portfolio?.title || `${fullName}'s Deck`}
              </span>

              {/* Tablet (md to lg): Compact Copy Button to prevent header collision */}
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label={`Sao chép link: soodfolio.com/${username}`}
                className="hidden md:flex lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 transition-all cursor-pointer flex-shrink-0"
                title={`Sao chép link: soodfolio.com/${username}`}
              >
                {copiedLink ? (
                  <Check className="h-3.5 w-3.5 text-teal-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Desktop (lg+): Full URL Pill */}
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label={`Sao chép link: soodfolio.com/${username}`}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex-shrink-0"
                title="Sao chép link công khai"
              >
                <span>soodfolio.com/{username}</span>
                {copiedLink ? (
                  <Check className="h-3 w-3 text-teal-500" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Right Controls - Unified, Minimalist & Modern on All Screen Sizes */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Publish Status Toggle (Live vs Draft) */}
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
              aria-label={portfolio?.isPublished ? 'Chuyển về trạng thái bản nháp' : 'Công khai trang portfolio'}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                portfolio?.isPublished
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
              }`}
              title={portfolio?.isPublished ? 'Bấm để chuyển về bản nháp riêng tư' : 'Bấm để công khai slide deck'}
            >
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  portfolio?.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-500'
                }`}
              />
              <span className="hidden xs:inline">{portfolio?.isPublished ? 'Đang Live' : 'Bản nháp'}</span>
            </button>

            {/* View Live Presentation CTA Button */}
            <Link
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Xem trang trình chiếu live công khai"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 transition-colors"
            >
              <span className="hidden sm:inline">Xem Live</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            {/* Unified Profile & Settings Dropdown (Desktop, Tablet, Mobile) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Mở menu hồ sơ và cài đặt"
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-all cursor-pointer group"
              >
                <div className="h-7 w-7 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center overflow-hidden border border-teal-500/30 flex-shrink-0">
                  {portfolio?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={portfolio.avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{fullName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Flyout Dropdown Popover */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200 dark:border-white/10 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  {/* User Profile Card */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04] space-y-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{fullName}</div>
                    <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400 truncate">@{username}</div>
                    {user?.email && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                    )}
                  </div>

                  {/* Quick Action Links */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Copy className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Sao chép liên kết</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">soodfolio.com/{username}</span>
                    </button>

                    <Link
                      href={`/export/${username}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Printer className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Xuất hồ sơ PDF (A4)</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">Dossier</span>
                    </Link>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-1" />

                  {/* Preferences: Theme & Language */}
                  <div className="space-y-1">
                    {/* Theme Switch */}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Sun className="h-3.5 w-3.5 text-[#2dd4bf]" />
                        ) : (
                          <Moon className="h-3.5 w-3.5 text-slate-600" />
                        )}
                        <span>Giao diện</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {theme === 'dark' ? 'Tối (Dark)' : 'Sáng (Light)'}
                      </span>
                    </button>

                    {/* Language Switch */}
                    <button
                      type="button"
                      onClick={toggleLang}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Ngôn ngữ</span>
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {lang === 'vi' ? 'Tiếng Việt' : 'English'}
                      </span>
                    </button>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-1" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Section: Slide Filmstrip Carousel (Pitch / Apple Keynote Style) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <Monitor className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Trình Tự Slide Trình Chiếu</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              5 Slides · Bấm để chọn slide chỉnh sửa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Slide 01: Cover & Intro */}
            <button
              type="button"
              onClick={() => setActiveSlide('cover')}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer relative border ${
                activeSlide === 'cover'
                  ? 'bg-white dark:bg-[#0c141d] border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">SLIDE 01</span>
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                Giới thiệu & Hồ sơ
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {fullName}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Trang bìa</span>
                <span className="text-emerald-600 dark:text-emerald-400">Hiển thị</span>
              </div>
            </button>

            {/* Slide 02: Featured Projects */}
            <button
              type="button"
              onClick={() => setActiveSlide('projects')}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer relative border ${
                activeSlide === 'projects'
                  ? 'bg-white dark:bg-[#0c141d] border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">SLIDE 02</span>
                <span className={`h-1.5 w-1.5 rounded-full ${portfolio?.showProjects ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                Dự án tiêu biểu
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {portfolio?.projects.length || 0} Case studies
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Dự án</span>
                <span className={portfolio?.showProjects ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                  {portfolio?.showProjects ? 'Bật' : 'Ẩn'}
                </span>
              </div>
            </button>

            {/* Slide 03: Career Journey */}
            <button
              type="button"
              onClick={() => setActiveSlide('experience')}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer relative border ${
                activeSlide === 'experience'
                  ? 'bg-white dark:bg-[#0c141d] border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">SLIDE 03</span>
                <span className={`h-1.5 w-1.5 rounded-full ${portfolio?.showExperience ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                Hành trình sự nghiệp
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {portfolio?.experiences.length || 0} Cột mốc vai trò
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Kinh nghiệm</span>
                <span className={portfolio?.showExperience ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                  {portfolio?.showExperience ? 'Bật' : 'Ẩn'}
                </span>
              </div>
            </button>

            {/* Slide 04: Skills & Competencies */}
            <button
              type="button"
              onClick={() => setActiveSlide('skills')}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer relative border ${
                activeSlide === 'skills'
                  ? 'bg-white dark:bg-[#0c141d] border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">SLIDE 04</span>
                <span className={`h-1.5 w-1.5 rounded-full ${portfolio?.showSkills ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                Năng lực cốt lõi
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {portfolio?.skills.length || 0} Kỹ năng
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Ma trận</span>
                <span className={portfolio?.showSkills ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                  {portfolio?.showSkills ? 'Bật' : 'Ẩn'}
                </span>
              </div>
            </button>

            {/* Slide 05: Settings & Preferences */}
            <button
              type="button"
              onClick={() => setActiveSlide('settings')}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer relative border col-span-2 sm:col-span-1 ${
                activeSlide === 'settings'
                  ? 'bg-white dark:bg-[#0c141d] border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">CÀI ĐẶT</span>
                <Sliders className="h-3 w-3 text-slate-400" />
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                Thiết lập hiển thị
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Bật/tắt các phần slide
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Tùy chỉnh</span>
                <span className="text-slate-400">Cấu hình</span>
              </div>
            </button>
          </div>
        </section>

        {/* Section: WYSIWYG Center Stage Canvas (Live 16:9 Presentation View) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {activeSlide === 'cover' && 'Slide 01: Giới thiệu & Bìa trình chiếu'}
                {activeSlide === 'projects' && 'Slide 02: Dự án & Case Studies tiêu biểu'}
                {activeSlide === 'experience' && 'Slide 03: Lịch sử & Cột mốc nghề nghiệp'}
                {activeSlide === 'skills' && 'Slide 04: Ma trận kỹ năng & Năng lực'}
                {activeSlide === 'settings' && 'Slide Cài đặt: Tùy chỉnh hiển thị danh thiếp'}
              </h2>
            </div>

            {/* Quick Action Trigger Button for the Active Slide */}
            <div>
              {activeSlide === 'cover' && (
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  aria-label="Chỉnh sửa thông tin bìa"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Chỉnh sửa bìa</span>
                </button>
              )}
              {activeSlide === 'projects' && (
                <button
                  type="button"
                  onClick={handleOpenAddProject}
                  aria-label="Thêm dự án mới"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Thêm dự án mới</span>
                </button>
              )}
              {activeSlide === 'experience' && (
                <button
                  type="button"
                  onClick={handleOpenAddExperience}
                  aria-label="Thêm mốc sự nghiệp"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Thêm mốc sự nghiệp</span>
                </button>
              )}
            </div>
          </div>

          {/* 16:9 Presentation Canvas Container */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200/90 dark:border-white/[0.08] shadow-sm overflow-hidden p-6 sm:p-10 transition-colors min-h-[380px] flex flex-col justify-center relative">
            
            {/* Visual subtle corner badge (hidden on mobile to prevent overlap with avatar) */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.04] px-2.5 py-0.5 rounded border border-slate-200 dark:border-white/[0.06]">
                Bản xem trước 16:9
              </span>
            </div>

            {/* LIVE STAGE: SLIDE 01 (COVER) */}
            {activeSlide === 'cover' && (
              <div className="max-w-2xl mx-auto w-full text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 animate-in fade-in duration-200">
                {/* Avatar with Ruza Teal Halo border */}
                <div className="relative group flex-shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-teal-400/20 to-teal-600/10 border-2 border-teal-500/50 flex items-center justify-center text-teal-600 dark:text-teal-400 text-2xl font-black shadow-md overflow-hidden">
                    {portfolio?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={portfolio.avatarUrl}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{fullName.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    aria-label="Đổi ảnh đại diện"
                    className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity cursor-pointer backdrop-blur-[2px]"
                  >
                    Đổi ảnh
                  </button>
                </div>

                {/* Identity Information */}
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Status Text Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span>{portfolio?.statusText || 'Sẵn sàng hợp tác & tư vấn'}</span>
                  </div>

                  {/* Full Name & Tagline */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {fullName}
                    </h1>
                    <p className="text-sm sm:text-base font-medium text-teal-600 dark:text-teal-400 mt-1">
                      {portfolio?.tagline || portfolio?.title || 'Chuyên gia Thiết kế & Kỹ thuật'}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {portfolio?.bio || 'Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng.'}
                  </p>

                  {/* Social links row */}
                  {portfolio?.socialLinks && portfolio.socialLinks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {portfolio.socialLinks.map((link, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                        >
                          {link.platform}: {link.label || link.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LIVE STAGE: SLIDE 02 (PROJECTS) */}
            {activeSlide === 'projects' && (
              <div className="w-full space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Selected Case Studies
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Những dự án tiêu biểu minh họa năng lực và quy mô hoàn thiện
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                    {portfolio?.projects.length || 0} Dự án hiển thị
                  </span>
                </div>

                {(!portfolio?.projects || portfolio.projects.length === 0) ? (
                  <div className="py-12 text-center space-y-3">
                    <FolderGit2 className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5]" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chưa có dự án nào trong slide này.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddProject}
                      className="px-4 py-2 rounded-lg bg-teal-500 text-white text-xs font-semibold hover:bg-teal-400 transition-colors cursor-pointer"
                    >
                      + Thêm dự án đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {portfolio.projects.slice(0, 3).map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-teal-500/50 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                            <span>{proj.role || 'Case Study'}</span>
                            <span>{proj.periodText || ''}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {proj.description || 'Hệ thống tối ưu hóa quy trình với kiến trúc hiện đại và trải nghiệm mượt mà.'}
                          </p>
                        </div>

                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/50 dark:border-white/[0.04]">
                            {proj.techStack.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                            {proj.techStack.length > 3 && (
                              <span className="text-[10px] font-mono text-slate-400 self-center">
                                +{proj.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVE STAGE: SLIDE 03 (EXPERIENCE) */}
            {activeSlide === 'experience' && (
              <div className="w-full space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Professional Track Record
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Hành trình cống hiến, vị trí quản trị và các cột mốc thực thi
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                    {portfolio?.experiences.length || 0} Vị trí công tác
                  </span>
                </div>

                {(!portfolio?.experiences || portfolio.experiences.length === 0) ? (
                  <div className="py-12 text-center space-y-3">
                    <Briefcase className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5]" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chưa có dữ liệu kinh nghiệm làm việc trong slide này.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddExperience}
                      className="px-4 py-2 rounded-lg bg-teal-500 text-white text-xs font-semibold hover:bg-teal-400 transition-colors cursor-pointer"
                    >
                      + Thêm mốc kinh nghiệm đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {portfolio.experiences.slice(0, 3).map((exp) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {exp.roleTitle}
                            </span>
                            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                              @ {exp.companyName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {exp.description || 'Chịu trách nhiệm thiết kế hệ thống và định hướng kỹ thuật cho toàn bộ nhóm.'}
                          </p>
                        </div>
                        <div className="text-right text-[11px] font-mono text-slate-600 dark:text-slate-400 flex-shrink-0">
                          {exp.periodText || 'Hiện tại'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVE STAGE: SLIDE 04 (SKILLS) */}
            {activeSlide === 'skills' && (
              <div className="w-full space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Core Competencies & Capabilities
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ma trận năng lực kỹ thuật và công cụ chuyên môn
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                    {portfolio?.skills.length || 0} Kỹ năng kích hoạt
                  </span>
                </div>

                {(!portfolio?.skills || portfolio.skills.length === 0) ? (
                  <div className="py-12 text-center space-y-3">
                    <Code2 className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5]" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chưa có kỹ năng nào được thêm vào ma trận.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {SKILL_CATEGORIES.map((cat) => {
                      const catSkills = portfolio.skills.filter((s) => s.category === cat);
                      if (catSkills.length === 0) return null;
                      return (
                        <div
                          key={cat}
                          className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-2"
                        >
                          <div className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                            {CATEGORY_LABELS[cat] || cat}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {catSkills.map((skill) => (
                              <span
                                key={skill.id}
                                className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* LIVE STAGE: SLIDE 05 (SETTINGS) */}
            {activeSlide === 'settings' && (
              <div className="w-full space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Kiểm soát hiển thị các slide
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bật hoặc ẩn các slide khi người khác xem portfolio của bạn
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Projects Slide */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Slide Dự án (Case Studies)</p>
                      <p className="text-[10px] text-slate-400">Trình chiếu các sản phẩm đã hoàn thành</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showProjects')}
                      className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        portfolio?.showProjects
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-white/[0.04] text-slate-500 border border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {portfolio?.showProjects ? 'BẬT' : 'ẨN'}
                    </button>
                  </div>

                  {/* Experience Slide */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Slide Kinh nghiệm làm việc</p>
                      <p className="text-[10px] text-slate-400">Dòng thời gian sự nghiệp</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showExperience')}
                      className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        portfolio?.showExperience
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-white/[0.04] text-slate-500 border border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {portfolio?.showExperience ? 'BẬT' : 'ẨN'}
                    </button>
                  </div>

                  {/* Skills Slide */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Slide Kỹ năng chuyên môn</p>
                      <p className="text-[10px] text-slate-400">Ma trận phân loại năng lực</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showSkills')}
                      className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        portfolio?.showSkills
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-white/[0.04] text-slate-500 border border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {portfolio?.showSkills ? 'BẬT' : 'ẨN'}
                    </button>
                  </div>

                  {/* Contact Slide */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Slide Liên hệ & Mạng xã hội</p>
                      <p className="text-[10px] text-slate-400">Kênh kết nối trực tiếp</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showContact')}
                      className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        portfolio?.showContact
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-white/[0.04] text-slate-500 border border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {portfolio?.showContact ? 'BẬT' : 'ẨN'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section: Slide Content Management Panel (Granular Actions & Data Management) */}
        <section className="rounded-2xl bg-white dark:bg-[#0c141d] border border-slate-200/90 dark:border-white/[0.08] shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* TAB 1 CONTENT MANAGEMENT: COVER / PROFILE */}
          {activeSlide === 'cover' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Thông tin định danh & Trang bìa
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Quản lý tên hiển thị, chức danh, đoạn giới thiệu và liên kết xã hội
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  aria-label="Chỉnh sửa thông tin hồ sơ chi tiết"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Pencil className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              </div>

              {/* Profile Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Họ và tên</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{fullName}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Định danh (Handle)</span>
                  <div className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400 mt-1">@{username}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Chức danh / Tiêu đề</span>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">
                    {portfolio?.tagline || portfolio?.title || 'Chưa cập nhật'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Lượt xem hồ sơ</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {portfolio?.totalViews || 0} lượt
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT MANAGEMENT: PROJECTS LIST */}
          {activeSlide === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Quản lý danh sách dự án ({portfolio?.projects.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sắp xếp thứ tự hiển thị, chỉnh sửa nội dung hoặc thêm dự án mới
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm dự án mới</span>
                </button>
              </div>

              {(!portfolio?.projects || portfolio.projects.length === 0) ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có dự án nào trong slide này.
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Left: Reorder Controls & Details */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        {/* Reorder Up/Down */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveProject(idx, 'up')}
                            aria-label={`Di chuyển dự án ${proj.title} lên trên`}
                            className="p-1 rounded bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Di chuyển lên trên"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === portfolio.projects.length - 1}
                            onClick={() => handleMoveProject(idx, 'down')}
                            aria-label={`Di chuyển dự án ${proj.title} xuống dưới`}
                            className="p-1 rounded bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Di chuyển xuống dưới"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Title & Tech stack */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {proj.title}
                            </span>
                            {proj.role && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                                {proj.role}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {proj.description || 'Chưa có mô tả chi tiết'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProject(proj)}
                          aria-label={`Chỉnh sửa dự án ${proj.title}`}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          disabled={deletingProjectId === proj.id}
                          onClick={() => handleDeleteProject(proj.id)}
                          aria-label={`Xoá dự án ${proj.title}`}
                          className="p-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Xoá dự án"
                        >
                          {deletingProjectId === proj.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3 CONTENT MANAGEMENT: EXPERIENCE LIST */}
          {activeSlide === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Hành trình sự nghiệp ({portfolio?.experiences.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Thêm các cột mốc công tác, vị trí lãnh đạo và thời gian làm việc
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddExperience}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm mốc sự nghiệp</span>
                </button>
              </div>

              {(!portfolio?.experiences || portfolio.experiences.length === 0) ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có kinh nghiệm nào được ghi nhận.
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Left: Reorder & Role Info */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveExperience(idx, 'up')}
                            aria-label={`Di chuyển mốc kinh nghiệm ${exp.roleTitle} lên trên`}
                            className="p-1 rounded bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Di chuyển lên trên"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === portfolio.experiences.length - 1}
                            onClick={() => handleMoveExperience(idx, 'down')}
                            aria-label={`Di chuyển mốc kinh nghiệm ${exp.roleTitle} xuống dưới`}
                            className="p-1 rounded bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Di chuyển xuống dưới"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {exp.roleTitle}
                            </span>
                            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                              @ {exp.companyName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {exp.periodText || 'Hiện tại'} {exp.location ? `· ${exp.location}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditExperience(exp)}
                          aria-label={`Chỉnh sửa kinh nghiệm ${exp.roleTitle} tại ${exp.companyName}`}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          disabled={deletingExperienceId === exp.id}
                          onClick={() => handleDeleteExperience(exp.id)}
                          aria-label={`Xoá kinh nghiệm ${exp.roleTitle} tại ${exp.companyName}`}
                          className="p-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Xoá kinh nghiệm"
                        >
                          {deletingExperienceId === exp.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4 CONTENT MANAGEMENT: SKILLS MATRIX */}
          {activeSlide === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Quản lý ma trận kỹ năng & Năng lực ({portfolio?.skills.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Phân loại kỹ năng theo nhóm chuyên môn để slide trình chiếu rõ ràng và ấn tượng
                  </p>
                </div>
              </div>

              {/* Fast Add Skill Form */}
              <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full sm:w-56 h-10 px-3 rounded-lg bg-white dark:bg-[#12141d] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat] || cat}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Ví dụ: TypeScript, Figma, Next.js, Strategic Roadmap..."
                  className="flex-1 w-full h-10 px-3.5 rounded-lg bg-white dark:bg-[#12141d] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500"
                />

                <button
                  type="submit"
                  disabled={isAddingSkill || !newSkillName.trim()}
                  className="w-full sm:w-auto h-10 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAddingSkill ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <span>Thêm kỹ năng</span>
                </button>
              </form>

              {/* Categorized Skills Cloud with 1-Click Delete */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SKILL_CATEGORIES.map((cat) => {
                  const catSkills = portfolio?.skills.filter((s) => s.category === cat) || [];
                  return (
                    <div
                      key={cat}
                      className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          {CATEGORY_LABELS[cat] || cat}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {catSkills.length} mục
                        </span>
                      </div>

                      {catSkills.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Chưa có kỹ năng trong nhóm này</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {catSkills.map((skill) => (
                            <span
                              key={skill.id}
                              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 group"
                            >
                              <span>{skill.name}</span>
                              <button
                                type="button"
                                disabled={deletingSkillId === skill.id}
                                onClick={() => handleDeleteSkill(skill.id)}
                                aria-label={`Xoá kỹ năng ${skill.name}`}
                                className="p-0.5 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                                title={`Xoá kỹ năng ${skill.name}`}
                              >
                                {deletingSkillId === skill.id ? (
                                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                ) : (
                                  <X className="h-2.5 w-2.5" />
                                )}
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5 CONTENT MANAGEMENT: SETTINGS & VISIBILITY */}
          {activeSlide === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Cài đặt trình chiếu & Liên kết công khai
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Định dạng liên kết chia sẻ, trạng thái phát hành và các tuỳ chọn của danh thiếp
                </p>
              </div>

              {/* Public link share banner */}
              <div className="p-5 rounded-2xl bg-teal-500/10 dark:bg-teal-400/5 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                    ĐƯỜNG DẪN TRÌNH CHIẾU CÔNG KHAI
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white font-mono break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/preview/${username}` : `soodfolio.com/preview/${username}`}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Bất kỳ ai có liên kết này đều có thể xem slide presentation của bạn (nếu đã bật Live).
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? 'Đã sao chép' : 'Sao chép link'}</span>
                  </button>
                  <Link
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Mở trang trình chiếu live trong tab mới"
                    className="p-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title="Mở tab mới"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/export/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Xuất hồ sơ Dossier hoặc In PDF chuẩn A4"
                    className="px-3.5 py-2 rounded-xl bg-amber-100/70 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 border border-amber-300/80 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    title="Xuất hồ sơ Dossier / In PDF chuẩn A4"
                  >
                    <Printer className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    <span>Xuất PDF</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Slide Modals */}
      <ProjectModal
        key={selectedProject?.id || (projectModalOpen ? 'new-proj' : 'closed-proj')}
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={selectedProject}
        onSaved={handleSavedProject}
      />

      <ExperienceModal
        key={selectedExperience?.id || (experienceModalOpen ? 'new-exp' : 'closed-exp')}
        isOpen={experienceModalOpen}
        onClose={() => setExperienceModalOpen(false)}
        experience={selectedExperience}
        onSaved={handleSavedExperience}
      />

      <ProfileModal
        key={profileModalOpen ? 'open-prof' : 'closed-prof'}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        portfolio={portfolio}
        onSaved={handleSavedProfile}
      />
    </div>
  );
}



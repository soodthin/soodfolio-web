'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';
import { PortfolioData, ProjectDto, ExperienceDto, SkillDto } from '@/types/portfolio';
import {
  StudioSlideKey,
  STUDIO_SLIDES,
  StageZoom,
  StageViewportMode,
  StudioHeader,
  SlideInspector,
  StudioCommandPalette,
  SnapshotHistoryModal,
  PreviewModal,
  useStudioShortcuts,
} from '@/components/dashboard/studio';
import {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Sliders,
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();

  // Core Data & API States
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedText, setLastSavedText] = useState('Đã lưu');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Two-way synchronization & Click-to-edit state
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Modals & Command Palette States
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Studio Interactive States
  const [activeSlide, setActiveSlide] = useState<StudioSlideKey>('cover');
  const [stageZoom, setStageZoom] = useState<StageZoom>('fit');
  const [stageTheme, setStageTheme] = useState<'dark' | 'light'>('dark');
  const [stageViewportMode, setStageViewportMode] = useState<StageViewportMode>('16:9');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // App Theme & Language
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  // Keyboard Shortcuts Hook
  useStudioShortcuts({
    activeSlide,
    onSelectSlide: setActiveSlide,
    onToggleFullscreen: () => setIsFullscreen((prev) => !prev),
    onToggleCommandPalette: () => setCommandPaletteOpen((prev) => !prev),
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const notifySaved = () => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setLastSavedText(`Đã lưu ${time}`);
  };

  // Click-to-edit on preview stage handler (Bidirectional Sync)
  const handleFieldClick = (fieldId: string) => {
    if (
      fieldId === 'fullName' ||
      fieldId === 'title' ||
      fieldId === 'tagline' ||
      fieldId === 'bio' ||
      fieldId === 'statusText' ||
      fieldId === 'avatarUrl'
    ) {
      setActiveSlide('cover');
    } else if (fieldId === 'projects') {
      setActiveSlide('projects');
    } else if (fieldId === 'experience') {
      setActiveSlide('experience');
    } else if (fieldId === 'skills') {
      setActiveSlide('skills');
    }

    setFocusedField(fieldId);

    // Scroll to input and focus after render
    setTimeout(() => {
      const el = document.getElementById(`field-${fieldId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 100);
  };

  // Starter template fallback when backend is offline or portfolio is empty
  const getStarterPortfolio = useCallback((): PortfolioData => ({
    id: user?.id || 'demo-preview',
    username: user?.username || 'member',
    fullName: user?.fullName || 'Chuyên gia Sáng tạo',
    avatarUrl: user?.avatarUrl || null,
    title: 'Kỹ sư Phần mềm',
    tagline: 'Full-Stack Engineer & Product Builder',
    bio: 'Tập trung kiến tạo các sản phẩm số tinh tế, hiệu năng vượt trội và mang lại giá trị bền vững cho người dùng.',
    statusText: 'Sẵn sàng hợp tác & tư vấn',
    resumeUrl: null,
    themeMode: 'DARK',
    isPublished: true,
    totalViews: 0,
    showExperience: true,
    showProjects: true,
    showSkills: true,
    showEducation: true,
    showContact: true,
    socialLinks: [
      { platform: 'GitHub', url: `https://github.com/${user?.username || 'developer'}`, label: `@${user?.username || 'developer'}` },
    ],
    experiences: [],
    projects: [],
    skills: [],
    educations: [],
  }), [user]);

  // Load portfolio from API
  const loadPortfolio = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
        setBackendOffline(false);
      } else {
        if (res.status === 503) {
          setBackendOffline(true);
        }
        setPortfolio((prev) => prev || getStarterPortfolio());
      }
    } catch (err) {
      console.warn('Không thể kết nối đến máy chủ Backend (Offline mode):', err);
      setBackendOffline(true);
      setPortfolio((prev) => prev || getStarterPortfolio());
    } finally {
      setLoadingPortfolio(false);
    }
  }, [getStarterPortfolio]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (isAuthenticated) {
      loadPortfolio();
    }
  }, [authLoading, isAuthenticated, loadPortfolio, router]);

  // Sync theme with localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('soodfolio-theme') as 'dark' | 'light' | null;
    const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    setStageTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);

    const savedLang = localStorage.getItem('soodfolio-lang') as 'vi' | 'en' | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setStageTheme(next);
    localStorage.setItem('soodfolio-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const toggleLang = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    localStorage.setItem('soodfolio-lang', next);
  };

  // Copy public link
  const handleCopyLink = () => {
    const handle = portfolio?.username || user?.username || 'member';
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

  // Handle Publish action (creates immutable snapshot and sets isPublished true)
  const handlePublish = async () => {
    if (!portfolio || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    setPortfolio((prev) => (prev ? { ...prev, isPublished: true } : null));

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: true }),
      });

      if (res.ok) {
        showToast('Đã phát hành slide deck công khai thành công!');
      } else {
        showToast('Đã lưu bản phát hành cục bộ');
      }
    } catch {
      showToast('Đã lưu bản phát hành vào bản xem trước');
    } finally {
      setIsUpdatingStatus(false);
      notifySaved();
    }
  };

  // Generic in-memory portfolio field update (WYSIWYG)
  const handleUpdatePortfolioField = (field: keyof PortfolioData, value: any) => {
    setPortfolio((prev) => (prev ? { ...prev, [field]: value } : null));
    notifySaved();
  };

  // Save profile & hero settings to backend
  const handleSaveProfile = async (updated: Partial<PortfolioData>) => {
    if (!portfolio) return;
    setIsSaving(true);
    const payload = {
      title: updated.title ?? portfolio.title,
      fullName: updated.fullName ?? portfolio.fullName,
      tagline: updated.tagline ?? portfolio.tagline,
      bio: updated.bio ?? portfolio.bio,
      statusText: updated.statusText ?? portfolio.statusText,
      avatarUrl: updated.avatarUrl ?? portfolio.avatarUrl,
      resumeUrl: updated.resumeUrl ?? portfolio.resumeUrl,
      themeMode: updated.themeMode ?? portfolio.themeMode,
      themeConfig: updated.themeConfig ?? portfolio.themeConfig,
      socialLinks: updated.socialLinks ?? portfolio.socialLinks,
      showExperience: portfolio.showExperience,
      showProjects: portfolio.showProjects,
      showSkills: portfolio.showSkills,
      showEducation: portfolio.showEducation,
      showContact: portfolio.showContact,
    };

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setPortfolio(saved);
        showToast('Đã lưu thông tin hồ sơ & slide.');
      } else {
        showToast('Đã lưu thông tin vào bản xem trước Studio');
      }
    } catch {
      showToast('Đã lưu thông tin vào bản xem trước Studio');
    } finally {
      setIsSaving(false);
      notifySaved();
    }
  };

  // --- Project CRUD Operations ---
  const handleAddProject = async (newProj: Omit<ProjectDto, 'id'>) => {
    if (!portfolio) return;
    setIsSaving(true);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj),
      });

      if (res.ok) {
        const created: ProjectDto = await res.json();
        setPortfolio((prev) => (prev ? { ...prev, projects: [...prev.projects, created] } : null));
        showToast('Đã thêm dự án mới thành công.');
      } else {
        const localId = `proj-${Date.now()}`;
        const localProj: ProjectDto = { ...newProj, id: localId };
        setPortfolio((prev) => (prev ? { ...prev, projects: [...prev.projects, localProj] } : null));
        showToast('Đã thêm dự án vào bản xem trước Studio');
      }
    } catch {
      const localId = `proj-${Date.now()}`;
      const localProj: ProjectDto = { ...newProj, id: localId };
      setPortfolio((prev) => (prev ? { ...prev, projects: [...prev.projects, localProj] } : null));
      showToast('Đã thêm dự án vào bản xem trước Studio');
    } finally {
      setIsSaving(false);
      notifySaved();
    }
  };

  const handleUpdateProject = async (id: string, updated: Partial<ProjectDto>) => {
    if (!portfolio) return;
    setPortfolio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
      };
    });

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // In-memory update already applied
    }
    notifySaved();
  };

  const handleDeleteProject = async (id: string) => {
    if (!portfolio) return;
    setPortfolio((prev) =>
      prev ? { ...prev, projects: prev.projects.filter((p) => p.id !== id) } : null
    );

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/projects/${id}`, {
        method: 'DELETE',
      });
      showToast('Đã xoá dự án khỏi slide deck.');
    } catch {
      showToast('Đã xoá dự án khỏi bản xem trước Studio');
    }
    notifySaved();
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
    } catch {
      // In-memory update applied
    }
    notifySaved();
  };

  const handleProjectImported = (project: ProjectDto) => {
    setPortfolio((prev) => {
      if (!prev) return null;
      if (prev.projects.some((p) => p.id === project.id)) return prev;
      return {
        ...prev,
        projects: [...prev.projects, project],
      };
    });
    showToast(`Đã import thành công dự án "${project.title}" từ GitHub!`);
    notifySaved();
  };

  // --- Experience CRUD Operations ---
  const handleAddExperience = async (newExp: Omit<ExperienceDto, 'id'>) => {
    if (!portfolio) return;
    setIsSaving(true);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      });

      if (res.ok) {
        const created: ExperienceDto = await res.json();
        setPortfolio((prev) => (prev ? { ...prev, experiences: [...prev.experiences, created] } : null));
        showToast('Đã thêm kinh nghiệm sự nghiệp.');
      } else {
        const localId = `exp-${Date.now()}`;
        const localExp: ExperienceDto = { ...newExp, id: localId };
        setPortfolio((prev) => (prev ? { ...prev, experiences: [...prev.experiences, localExp] } : null));
        showToast('Đã thêm kinh nghiệm vào bản xem trước');
      }
    } catch {
      const localId = `exp-${Date.now()}`;
      const localExp: ExperienceDto = { ...newExp, id: localId };
      setPortfolio((prev) => (prev ? { ...prev, experiences: [...prev.experiences, localExp] } : null));
      showToast('Đã thêm kinh nghiệm vào bản xem trước');
    } finally {
      setIsSaving(false);
      notifySaved();
    }
  };

  const handleUpdateExperience = async (id: string, updated: Partial<ExperienceDto>) => {
    if (!portfolio) return;
    setPortfolio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      };
    });

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // In-memory update applied
    }
    notifySaved();
  };

  const handleDeleteExperience = async (id: string) => {
    if (!portfolio) return;
    setPortfolio((prev) =>
      prev ? { ...prev, experiences: prev.experiences.filter((e) => e.id !== id) } : null
    );

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/${id}`, {
        method: 'DELETE',
      });
      showToast('Đã xoá mốc sự nghiệp.');
    } catch {
      showToast('Đã xoá khỏi bản xem trước');
    }
    notifySaved();
  };

  const handleMoveExperience = async (index: number, direction: 'up' | 'down') => {
    if (!portfolio) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolio.experiences.length) return;

    const newExperiences = [...portfolio.experiences];
    const temp = newExperiences[index];
    newExperiences[index] = newExperiences[targetIndex];
    newExperiences[targetIndex] = temp;

    setPortfolio((prev) => (prev ? { ...prev, experiences: newExperiences } : null));

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceIds: newExperiences.map((e) => e.id) }),
      });
    } catch {
      // In-memory update applied
    }
    notifySaved();
  };

  // --- Skill CRUD Operations ---
  const handleAddSkill = async (category: string, name: string) => {
    if (!portfolio || !name.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name: name.trim() }),
      });

      if (res.ok) {
        const created: SkillDto = await res.json();
        setPortfolio((prev) => (prev ? { ...prev, skills: [...prev.skills, created] } : null));
        showToast(`Đã thêm kỹ năng "${name.trim()}".`);
      } else {
        const localId = `skill-${Date.now()}`;
        const localSkill: SkillDto = { id: localId, category, name: name.trim() };
        setPortfolio((prev) => (prev ? { ...prev, skills: [...prev.skills, localSkill] } : null));
        showToast('Đã thêm kỹ năng vào bản xem trước');
      }
    } catch {
      const localId = `skill-${Date.now()}`;
      const localSkill: SkillDto = { id: localId, category, name: name.trim() };
      setPortfolio((prev) => (prev ? { ...prev, skills: [...prev.skills, localSkill] } : null));
      showToast('Đã thêm kỹ năng vào bản xem trước');
    } finally {
      setIsSaving(false);
      notifySaved();
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!portfolio) return;
    setPortfolio((prev) =>
      prev ? { ...prev, skills: prev.skills.filter((s) => s.id !== id) } : null
    );

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me/skills/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // In-memory update applied
    }
    notifySaved();
  };

  // --- Settings Visibility Toggles ---
  const handleToggleSection = async (
    field: 'showExperience' | 'showProjects' | 'showSkills' | 'showEducation' | 'showContact'
  ) => {
    if (!portfolio) return;
    const currentVal = portfolio[field];
    const newVal = !currentVal;

    setPortfolio((prev) => (prev ? { ...prev, [field]: newVal } : null));

    try {
      await fetchWithAuth(`${API_BASE}/portfolios/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...portfolio, [field]: newVal }),
      });
      showToast('Đã lưu cấu hình hiển thị slide.');
    } catch {
      showToast('Đã lưu cấu hình vào bản xem trước');
    }
    notifySaved();
  };

  if (authLoading || (loadingPortfolio && !portfolio)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#080d12] text-slate-600 dark:text-slate-300 font-sans text-sm gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="text-xs font-sans font-medium text-slate-500">
          Đang khởi tạo SoodFolio Deck Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen w-full bg-[#f8fafc] dark:bg-[#080d12] text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-sans font-medium backdrop-blur-md ${
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

      {/* Top Navbar */}
      <StudioHeader
        portfolio={portfolio}
        user={user}
        theme={theme}
        lang={lang}
        backendOffline={backendOffline}
        onRetryConnection={loadPortfolio}
        isUpdatingStatus={isUpdatingStatus}
        onPublish={handlePublish}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
        onCopyLink={handleCopyLink}
        copiedLink={copiedLink}
        onLogout={handleLogout}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenSnapshots={() => setSnapshotModalOpen(true)}
      />

      {/* Main Studio Flexible Workspace (Full Height Scrollable) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0 bg-[#f8fafc] dark:bg-[#080d12]">
        {/* Horizontal Slide Category Navigation Bar - Fully Responsive & Flexible */}
        <div className="w-full border-b border-slate-200/80 dark:border-white/[0.07] bg-white/95 dark:bg-[#080d12]/95 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
            {/* Horizontal Slide Tabs: 01 Cover · 02 Projects · 03 Exp · 04 Skills · 05 Config */}
            <nav aria-label="Danh mục Slide" className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
              {STUDIO_SLIDES.map((slide) => {
                const Icon = ICON_MAP[slide.iconName] || User;
                const isActive = activeSlide === slide.key;

                return (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={() => setActiveSlide(slide.key)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-teal-500/15 dark:bg-teal-400/15 text-teal-800 dark:text-teal-300 border border-teal-500/40 dark:border-teal-400/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <span className="tabular-nums font-bold text-xs opacity-75">{slide.number}</span>
                    <Icon className="h-4 w-4 text-current flex-shrink-0" />
                    <span className="font-semibold">{slide.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Autosave Status & Quick Preview Trigger */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-slate-500 dark:text-slate-400">
                {isSaving ? (
                  <span className="flex items-center gap-1.5 text-teal-500 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                    <span>Đang đồng bộ...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{lastSavedText}</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs"
                title="Mở Sân khấu trình chiếu Preview 16:9"
                aria-label="Xem Preview"
              >
                <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
                <span>Xem Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Flexible Workspace Canvas Container */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 py-6 pb-20 flex-1 flex flex-col min-h-0">
          <SlideInspector
            portfolio={portfolio}
            activeSlide={activeSlide}
            onUpdatePortfolioField={handleUpdatePortfolioField}
            onSaveProfile={handleSaveProfile}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onMoveProject={handleMoveProject}
            onProjectImported={handleProjectImported}
            onAddExperience={handleAddExperience}
            onUpdateExperience={handleUpdateExperience}
            onDeleteExperience={handleDeleteExperience}
            onMoveExperience={handleMoveExperience}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            onToggleSection={handleToggleSection}
            isSaving={isSaving}
            lastSavedText={lastSavedText}
            focusedField={focusedField}
            onFocusField={setFocusedField}
            onBlurField={() => setFocusedField(null)}
          />
        </div>
      </main>

      {/* Fullscreen Review Preview Overlay Modal */}
      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        portfolio={portfolio}
        activeSlide={activeSlide}
        onSelectSlide={setActiveSlide}
        stageTheme={stageTheme}
        onToggleStageTheme={() =>
          setStageTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
        zoom={stageZoom}
        onSetZoom={setStageZoom}
        viewportMode={stageViewportMode}
        onSetViewportMode={setStageViewportMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        onFieldClick={handleFieldClick}
      />

      {/* Command Palette Modal (Cmd+K / Ctrl+K) */}
      <StudioCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectSlide={setActiveSlide}
        onPublish={handlePublish}
        onCopyLink={handleCopyLink}
        onToggleTheme={toggleTheme}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        onOpenSnapshots={() => setSnapshotModalOpen(true)}
        onOpenPreview={() => setPreviewModalOpen(true)}
        username={portfolio?.username || user?.username || 'member'}
        theme={theme}
      />

      {/* Immutable Snapshot History Modal */}
      <SnapshotHistoryModal
        isOpen={snapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        username={portfolio?.username || user?.username || 'member'}
      />
    </div>
  );
}

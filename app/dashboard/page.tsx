'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Layers,
  Cpu,
  Briefcase,
  Globe,
  Code2,
  Sliders,
  LogOut,
  AlertCircle,
  Loader2,
  User,
  Terminal,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';


const SKILL_CATEGORIES = [
  'LANGUAGES',
  'FRAMEWORKS',
  'DATABASES',
  'DEVOPS',
  'AI_ENGINEERING',
  'TOOLS',
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'skills' | 'settings'>('overview');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        showToast(`Deck status changed to ${newStatus ? 'LIVE' : 'DRAFT'}`);
      } else {
        setPortfolio((prev) => (prev ? { ...prev, isPublished: !newStatus } : null));
        showToast('Failed to update status', 'error');
      }
    } catch {
      setPortfolio((prev) => (prev ? { ...prev, isPublished: !newStatus } : null));
      showToast('Network error updating status', 'error');
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
        showToast('Section visibility updated.');
      } else {
        setPortfolio((prev) => (prev ? { ...prev, [field]: currentVal } : null));
        showToast('Failed to save section setting.', 'error');
      }
    } catch {
      setPortfolio((prev) => (prev ? { ...prev, [field]: currentVal } : null));
      showToast('Error saving section setting.', 'error');
    }
  };

  // Copy public link
  const handleCopyLink = () => {
    const handle = portfolio?.username || user?.username || 'me';
    const liveUrl = `${window.location.origin}/preview/${handle}`;
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    showToast('Portfolio link copied to clipboard!');
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
    showToast(selectedProject ? 'Project slide updated.' : 'New project slide created.');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project slide?')) return;
    setDeletingProjectId(projectId);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPortfolio((prev) =>
          prev ? { ...prev, projects: prev.projects.filter((p) => p.id !== projectId) } : null
        );
        showToast('Project slide removed.');
      } else {
        showToast('Failed to delete project slide.', 'error');
      }
    } catch {
      showToast('Error deleting project slide.', 'error');
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
      showToast('Project slides reordered.');
    } catch {
      showToast('Could not save slide order.', 'error');
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
    showToast(selectedExperience ? 'Experience updated.' : 'New experience added.');
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (!window.confirm('Are you sure you want to delete this role from your timeline?')) return;
    setDeletingExperienceId(experienceId);

    try {
      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/experiences/${experienceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPortfolio((prev) =>
          prev ? { ...prev, experiences: prev.experiences.filter((e) => e.id !== experienceId) } : null
        );
        showToast('Experience role removed.');
      } else {
        showToast('Failed to delete experience.', 'error');
      }
    } catch {
      showToast('Error deleting experience.', 'error');
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
      showToast('Experience timeline reordered.');
    } catch {
      showToast('Could not save timeline order.', 'error');
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
        showToast(`Added skill: ${addedSkill.name}`);
      } else {
        showToast('Failed to add skill.', 'error');
      }
    } catch {
      showToast('Error adding skill.', 'error');
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
        showToast('Skill removed.');
      } else {
        showToast('Failed to remove skill.', 'error');
      }
    } catch {
      showToast('Error deleting skill.', 'error');
    } finally {
      setDeletingSkillId(null);
    }
  };

  // Profile Save
  const handleSavedProfile = (updated: PortfolioData) => {
    setPortfolio(updated);
    showToast('Identity profile and hero slide updated.');
  };

  const username = portfolio?.username || user?.username || 'developer';
  const fullName = portfolio?.fullName || user?.fullName || 'Senior Engineer';
  const liveUrl = `/preview/${username}`;

  if (authLoading || (loadingPortfolio && !portfolio)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#090a0f] text-slate-300 font-mono text-xs gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-teal-400" />
        <p className="tracking-wider uppercase text-slate-400">Loading SoodFolio Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#090a0f] text-slate-200 selection:bg-teal-400/20 selection:text-teal-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl border font-mono text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#11131a] border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
              : 'bg-[#11131a] border-rose-500/40 text-rose-300 shadow-rose-500/10'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Mechanical Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-[#141722] border border-white/10 group-hover:border-teal-500/40 flex items-center justify-center transition-colors">
                <Sparkles className="h-4 w-4 text-teal-400" />
              </div>
              <span className="font-bold tracking-tight text-white text-base">SOODFOLIO</span>
            </Link>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-white/[0.04] border border-white/[0.08] text-teal-400/90 font-semibold">
              OPERATE MODE
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-lg bg-[#11131a] border border-white/[0.08] border-t-white/[0.12] p-0.5 font-mono text-xs shadow-sm">
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-8 px-2.5 rounded-md hover:bg-white/[0.06] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy live portfolio link"
              >
                {copiedLink ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span className="hidden md:inline font-mono text-[11px] text-teal-400/90">
                  soodfolio.dev/{username}
                </span>
              </button>

              <div className="w-[1px] h-4 bg-white/10 my-auto" />

              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-2.5 rounded-md hover:bg-teal-400/10 text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
                title="View live portfolio slide deck"
              >
                <span className="text-[11px]">View Live</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="h-9 w-9 rounded-lg bg-[#11131a] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Creator Identity & Status Bento */}
        <section className="rounded-2xl bg-[#11131a] border border-white/[0.08] border-t-white/[0.14] border-b-black/50 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#181b26] border border-white/10 border-t-white/20 flex items-center justify-center text-teal-400 font-bold text-xl shrink-0 shadow-inner overflow-hidden">
                {portfolio?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={portfolio.avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {fullName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 font-mono text-[11px] text-slate-400">
                    @{username}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-400/10 border border-teal-500/30 font-mono text-[11px] text-teal-400 font-medium">
                    {user?.authProvider || 'PRO CREATOR'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  {portfolio?.title || 'Lead Software Engineer & System Architect'}
                </p>
                {portfolio?.tagline && (
                  <p className="text-xs text-slate-400 italic font-mono max-w-xl">
                    &quot;{portfolio.tagline}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Visibility & Publish Switch */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#161923] border border-white/[0.08] self-start lg:self-center shrink-0">
              <div className="space-y-0.5">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  DECK VISIBILITY
                </p>
                <p className="text-xs font-mono font-medium text-slate-200">
                  {portfolio?.isPublished ? 'Publicly Live' : 'Draft Mode'}
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleToggleStatus}
                className={`h-9 px-3.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
                  portfolio?.isPublished
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-teal-500/15 border border-teal-500/40 text-teal-300 hover:bg-teal-500/20'
                }`}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      portfolio?.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-teal-400'
                    }`}
                  />
                )}
                <span>{portfolio?.isPublished ? 'LIVE' : 'DRAFT'}</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06]">
            <div className="p-3.5 rounded-xl bg-[#161923] border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                  Audience Views
                </span>
                <Eye className="h-3.5 w-3.5 text-teal-400" />
              </div>
              <p className="text-lg font-bold font-mono text-white">
                {portfolio?.totalViews ?? 0}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Live portfolio impressions</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161923] border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                  Project Slides
                </span>
                <Layers className="h-3.5 w-3.5 text-teal-400" />
              </div>
              <p className="text-lg font-bold font-mono text-white">
                {portfolio?.projects?.length ?? 0}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Interactive showcases</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161923] border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                  Core Skills
                </span>
                <Cpu className="h-3.5 w-3.5 text-teal-400" />
              </div>
              <p className="text-lg font-bold font-mono text-white">
                {portfolio?.skills?.length ?? 0}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Verified competencies</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161923] border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                  API & Engine
                </span>
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <p className="text-sm font-bold font-mono text-emerald-400 pt-0.5">
                Next.js 16 App Router
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Spring Boot 3.4 API Active</p>
            </div>
          </div>
        </section>

        {/* Workspace Management Tabs */}
        <section className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/[0.08] font-mono text-xs">
            {[
              { id: 'overview' as const, label: '1. Identity & Hero', icon: User },
              { id: 'projects' as const, label: '2. Slide Decks (Projects)', icon: Layers },
              { id: 'experience' as const, label: '3. Professional Path', icon: Briefcase },
              { id: 'skills' as const, label: '4. Skills Matrix', icon: Cpu },
              { id: 'settings' as const, label: '5. Deck Settings', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-10 px-4 rounded-t-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap font-medium ${
                    isActive
                      ? 'bg-[#11131a] border-t border-l border-r border-white/10 text-teal-400 font-bold border-b-2 border-b-teal-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-[#11131a] border border-white/[0.08] p-6 sm:p-8 space-y-6">
            {/* Tab 1: Overview & Bio */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Identity & Hero Slide
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Your introductory elevator statement and professional title.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="h-9 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-400/10 active:scale-95 self-start sm:self-center"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Hero Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Professional Title</span>
                    <p className="text-sm font-semibold text-white">{portfolio?.title || 'Not configured'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Hero Tagline</span>
                    <p className="text-sm font-semibold text-teal-400">{portfolio?.tagline || 'Not configured'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Status / Availability</span>
                    <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {portfolio?.statusText || 'AVAILABLE FOR WORK'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Resume Link / Action</span>
                    <p className="text-sm font-mono text-slate-300 truncate">
                      {portfolio?.resumeUrl || 'Not configured'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-2 md:col-span-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Elevator Bio</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                      {portfolio?.bio || 'No bio configured yet.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] space-y-3">
                  <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider block">
                    Connected Networks ({portfolio?.socialLinks?.length ?? 0})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {portfolio?.socialLinks && portfolio.socialLinks.length > 0 ? (
                      portfolio.socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#11131a] hover:bg-white/[0.08] border border-white/10 hover:border-teal-500/30 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Globe className="h-3 w-3 text-teal-400" />
                          <span>{link.platform}: {link.label || link.url}</span>
                        </a>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 font-mono">No social links linked yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Projects Slides */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Slide Decks (Projects)
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Each production system transformed into a dedicated presentation slide.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddProject}
                    className="h-9 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-400/10 active:scale-95 self-start sm:self-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project Slide</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio?.projects && portfolio.projects.length > 0 ? (
                    portfolio.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="p-5 rounded-xl bg-[#161923] border border-white/[0.06] hover:border-teal-500/30 transition-all space-y-3 flex flex-col justify-between group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-teal-400 font-bold">
                                  #{idx + 1}
                                </span>
                                <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                                  {proj.title}
                                </h3>
                              </div>
                              {proj.subtitle && (
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{proj.subtitle}</p>
                              )}
                              {proj.role && (
                                <p className="text-[11px] text-teal-400/80 font-mono mt-0.5">Role: {proj.role}</p>
                              )}
                            </div>
                            {proj.periodText && (
                              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-slate-400 shrink-0">
                                {proj.periodText}
                              </span>
                            )}
                          </div>

                          {proj.description && (
                            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                              {proj.description}
                            </p>
                          )}

                          {proj.highlights && proj.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 font-mono pt-1">
                              {proj.highlights.slice(0, 2).map((h, i) => (
                                <li key={i} className="line-clamp-1">{h}</li>
                              ))}
                            </ul>
                          )}

                          {proj.techStack && proj.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proj.techStack.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-[#11131a] border border-white/[0.08] text-[10px] font-mono text-teal-400/90"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                          <div className="flex items-center gap-3">
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                              >
                                <span>Demo</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                              >
                                <Code2 className="h-3 w-3" />
                                <span>Code</span>
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveProject(idx, 'up')}
                              className="p-1 rounded bg-[#11131a] hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Move Slide Up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (portfolio.projects.length - 1)}
                              onClick={() => handleMoveProject(idx, 'down')}
                              className="p-1 rounded bg-[#11131a] hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Move Slide Down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1 rounded bg-[#11131a] hover:bg-teal-400/20 text-slate-300 hover:text-teal-300 transition-colors cursor-pointer ml-1"
                              title="Edit Slide"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={deletingProjectId === proj.id}
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 rounded bg-[#11131a] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Slide"
                            >
                              {deletingProjectId === proj.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="md:col-span-2 py-12 text-center text-slate-400 font-mono text-xs">
                      No project slides created yet. Click &quot;+ Add Project Slide&quot; above.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Professional Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Professional Path (Timeline Track)
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Roles, technical achievements, and engineering deliverables.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddExperience}
                    className="h-9 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-400/10 active:scale-95 self-start sm:self-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio?.experiences && portfolio.experiences.length > 0 ? (
                    portfolio.experiences.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="p-5 rounded-xl bg-[#161923] border border-white/[0.06] hover:border-teal-500/30 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-teal-400 font-bold">
                              #{idx + 1}
                            </span>
                            <h3 className="font-bold text-sm text-white">
                              {exp.roleTitle} <span className="text-teal-400">@ {exp.companyName}</span>
                            </h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-400">{exp.periodText}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveExperience(idx, 'up')}
                                className="p-1 rounded bg-[#11131a] hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (portfolio.experiences.length - 1)}
                                onClick={() => handleMoveExperience(idx, 'down')}
                                className="p-1 rounded bg-[#11131a] hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditExperience(exp)}
                                className="p-1 rounded bg-[#11131a] hover:bg-teal-400/20 text-slate-300 hover:text-teal-300 transition-colors cursor-pointer ml-1"
                                title="Edit Role"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingExperienceId === exp.id}
                                onClick={() => handleDeleteExperience(exp.id)}
                                className="p-1 rounded bg-[#11131a] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Role"
                              >
                                {deletingExperienceId === exp.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {exp.location && (
                          <p className="text-[11px] text-slate-400 font-mono">{exp.location}</p>
                        )}

                        {exp.description && (
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{exp.description}</p>
                        )}

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pt-1 font-mono">
                            {exp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}

                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.04]">
                            {exp.skillsUsed.map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-[#11131a] border border-white/[0.08] text-[10px] font-mono text-teal-400"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400 font-mono text-xs">
                      No experience records found. Click &quot;+ Add Role&quot; to record your history.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Skills Matrix */}
            {activeTab === 'skills' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Skills Matrix & Technical Arsenal
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Categorized competencies displayed in your presentation slide deck.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-teal-400/10 border border-teal-500/20 text-teal-400 font-mono text-[11px] self-start sm:self-center">
                    {portfolio?.skills?.length ?? 0} VERIFIED SKILLS
                  </span>
                </div>

                {/* Inline Quick Add Skill Bar */}
                <form
                  onSubmit={handleAddSkill}
                  className="p-4 rounded-xl bg-[#161923] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-3"
                >
                  <div className="w-full sm:w-48 shrink-0">
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#11131a] border border-white/10 text-white font-mono text-xs focus:border-teal-400/60 focus:outline-none"
                    >
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full flex-1">
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Docker, GraphQL, Kubernetes, Redis..."
                      className="w-full h-10 px-3.5 rounded-xl bg-[#11131a] border border-white/10 text-white font-mono text-xs focus:border-teal-400/60 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingSkill || !newSkillName.trim()}
                    className="w-full sm:w-auto h-10 px-5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isAddingSkill ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    <span>Add Skill</span>
                  </button>
                </form>

                {/* Grouped Skills Matrix */}
                <div className="space-y-4">
                  {SKILL_CATEGORIES.map((category) => {
                    const categorySkills =
                      portfolio?.skills?.filter((s) => s.category.toUpperCase() === category) || [];
                    if (categorySkills.length === 0) return null;

                    return (
                      <div
                        key={category}
                        className="p-5 rounded-xl bg-[#161923] border border-white/[0.06] space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                          <span className="text-xs font-mono font-bold tracking-wider text-teal-400 uppercase">
                            {category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {categorySkills.length} SKILLS
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="px-3 py-1.5 rounded-lg bg-[#11131a] border border-white/[0.08] hover:border-teal-500/40 text-xs font-mono flex items-center gap-2 group transition-all"
                            >
                              <span className="text-white font-medium">{skill.name}</span>
                              <button
                                type="button"
                                disabled={deletingSkillId === skill.id}
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Remove skill"
                              >
                                {deletingSkillId === skill.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 5: Deck Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Slide Deck Section Visibility & Architecture
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Enable or disable slide sections live on your public portfolio deck.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Projects Toggle */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Project Slide Decks</p>
                      <p className="text-[10px] text-slate-400">Display production systems slide</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showProjects')}
                      className={`h-8 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        portfolio?.showProjects
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.04] border border-white/10 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          portfolio?.showProjects ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{portfolio?.showProjects ? 'ENABLED' : 'HIDDEN'}</span>
                    </button>
                  </div>

                  {/* Experience Toggle */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Professional Experience</p>
                      <p className="text-[10px] text-slate-400">Display timeline track slide</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showExperience')}
                      className={`h-8 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        portfolio?.showExperience
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.04] border border-white/10 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          portfolio?.showExperience ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{portfolio?.showExperience ? 'ENABLED' : 'HIDDEN'}</span>
                    </button>
                  </div>

                  {/* Skills Toggle */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Skills Matrix</p>
                      <p className="text-[10px] text-slate-400">Display categorized competencies</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showSkills')}
                      className={`h-8 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        portfolio?.showSkills
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.04] border border-white/10 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          portfolio?.showSkills ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{portfolio?.showSkills ? 'ENABLED' : 'HIDDEN'}</span>
                    </button>
                  </div>

                  {/* Education Toggle */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Education & Academics</p>
                      <p className="text-[10px] text-slate-400">Display university and coursework</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showEducation')}
                      className={`h-8 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        portfolio?.showEducation
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.04] border border-white/10 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          portfolio?.showEducation ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{portfolio?.showEducation ? 'ENABLED' : 'HIDDEN'}</span>
                    </button>
                  </div>

                  {/* Contact Toggle */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Contact & Transmission</p>
                      <p className="text-[10px] text-slate-400">Display direct reach slide</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection('showContact')}
                      className={`h-8 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        portfolio?.showContact
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.04] border border-white/10 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          portfolio?.showContact ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{portfolio?.showContact ? 'ENABLED' : 'HIDDEN'}</span>
                    </button>
                  </div>

                  {/* Theme Mode Card */}
                  <div className="p-4 rounded-xl bg-[#161923] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Visual Design System</p>
                      <p className="text-[10px] text-slate-400">Active presentation theme</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-teal-400/10 border border-teal-500/30 text-teal-400 font-bold text-[11px]">
                      NEO-KINPAKU OBSIDIAN
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
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

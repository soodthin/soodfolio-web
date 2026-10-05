'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'skills' | 'settings'>('profile');
  const [isPublished, setIsPublished] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1124] text-[#8cb0fd] font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-[#f8c076] animate-pulse mr-2" />
        Loading your command center...
      </div>
    );
  }

  const livePortfolioUrl = `/${user?.username || 'alex'}`;

  return (
    <div className="min-h-screen w-full bg-[#0b1124] text-[#ebe7ff] overflow-y-auto selection:bg-[#32235c] selection:text-[#f8c076]">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-5%,rgba(95,75,170,0.35),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_35%_at_90%_50%,rgba(48,72,148,0.25),transparent)] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-20 border-b border-[#1c274a] bg-[#070b18]/85 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-mono text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            <span className="text-[#f8c076]">SOODFOLIO</span>
            <span className="text-[#3b528a]">/</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-[#2b417e] bg-[#132047] text-[#8cb0fd]">
              COMMAND CENTER
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href={livePortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg border border-[#f8c076]/50 bg-[#172552] text-[#f8c076] hover:bg-[#f8c076] hover:text-[#0b1124] transition-all font-semibold flex items-center gap-1.5"
            >
              <span>[ View Live: @{user?.username} ]</span>
              <span className="text-xs">↗</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-[#2d3e70] bg-[#0c142b] hover:border-rose-500/50 hover:text-rose-400 text-[#90a6d5] transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Welcome & Live Status Banner */}
        <div className="rounded-2xl border border-[#283e7a] bg-[#0c142e]/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_50px_rgba(8,14,35,0.95)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#f8c076] uppercase tracking-widest font-semibold block">
                CREATOR DASHBOARD
              </span>
              <h1 className="text-2xl sm:text-4xl font-sans font-bold text-white mt-1 uppercase">
                Welcome back, {user?.fullName || 'Developer'}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[#8cb0fd] mt-1">
                Your portfolio is live at{' '}
                <a
                  href={livePortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:text-[#f8c076] transition-colors"
                >
                  soodfolio.com/{user?.username}
                </a>
              </p>
            </div>

            {/* Quick Status Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-[#213364] bg-[#080e22] font-mono text-xs shrink-0">
              <span className="text-[#8cb0fd] uppercase tracking-wider">Visibility:</span>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isPublished
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400'
                    : 'bg-amber-500/10 border border-amber-500/40 text-amber-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isPublished ? 'LIVE & PUBLISHED' : 'DRAFT MODE'}</span>
              </button>
            </div>
          </div>

          <div className="border-b border-[#1c274a]" />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-[#213467] bg-[#0e193d] p-3.5 space-y-1">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">Portfolio Handle</div>
              <div className="text-sm font-bold text-[#f8c076]">@{user?.username}</div>
            </div>
            <div className="rounded-xl border border-[#213467] bg-[#0e193d] p-3.5 space-y-1">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">Role Access</div>
              <div className="text-sm font-bold text-[#8cb0fd]">{user?.role || 'CREATOR'}</div>
            </div>
            <div className="rounded-xl border border-[#213467] bg-[#0e193d] p-3.5 space-y-1">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">Total Views</div>
              <div className="text-sm font-bold text-[#ddd7ff]">0 (Fresh Launch)</div>
            </div>
            <div className="rounded-xl border border-[#213467] bg-[#0e193d] p-3.5 space-y-1">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">Slide Deck Engine</div>
              <div className="text-sm font-bold text-emerald-400">Next.js 16 SSR</div>
            </div>
          </div>
        </div>

        {/* Section Management Tabs (Prepares for Phase 3 Slide Editor) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs border-b border-[#1c274a]">
            {[
              { id: 'profile', label: '1. Profile & Hero' },
              { id: 'projects', label: '2. Projects (Slides)' },
              { id: 'experience', label: '3. Experience' },
              { id: 'skills', label: '4. Skills & Education' },
              { id: 'settings', label: '5. Deck Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-t border-l border-r border-[#2d4380] bg-[#0d1633] text-[#f8c076] font-bold'
                    : 'text-[#8cb0fd] hover:text-white hover:bg-[#0c142b]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="rounded-2xl border border-[#233568] bg-[#0d1736]/90 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-sans font-bold text-white uppercase tracking-wider">
                  {activeTab === 'profile' && 'Hero & About Information'}
                  {activeTab === 'projects' && 'Project Slides Showcase'}
                  {activeTab === 'experience' && 'Work Experience & Highlights'}
                  {activeTab === 'skills' && 'Skills & Education Slides'}
                  {activeTab === 'settings' && 'Slide Deck Toggles & Theme'}
                </h3>
                <p className="text-xs font-mono text-[#8cb0fd] mt-0.5">
                  Phase 3 Editor: Live interactive editing will save directly to PostgreSQL
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <a
                  href={livePortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#f8c076] text-[#0b1124] font-bold hover:bg-[#ffcf8e] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Preview Full Slide Deck ↗</span>
                </a>
              </div>
            </div>

            {/* Informational Readiness Box */}
            <div className="rounded-xl border border-dashed border-[#344b88] bg-[#091126] p-6 text-center space-y-3 font-mono">
              <div className="w-10 h-10 rounded-full bg-[#15234d] border border-[#2f4684] text-[#f8c076] flex items-center justify-center mx-auto text-lg">
                ⚡
              </div>
              <h4 className="text-sm font-bold text-white uppercase">
                {activeTab.toUpperCase()} MODULE READY
              </h4>
              <p className="text-xs text-[#9fb3dd] max-w-md mx-auto leading-relaxed">
                Your portfolio backend is active and fully configured. In Phase 3, we will add the live form inputs and instant preview sync.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

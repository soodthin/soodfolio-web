'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [searchUsername, setSearchUsername] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/${encodeURIComponent(searchUsername.trim().toLowerCase())}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b1124] text-[#ebe7ff] overflow-y-auto selection:bg-[#32235c] selection:text-[#f8c076]">
      {/* Background radial effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(95,75,170,0.4),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_60%,rgba(48,72,148,0.3),transparent)] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 border-b border-[#1c274a] bg-[#070b18]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-base font-bold tracking-widest text-white uppercase">
            <span className="text-[#f8c076]">SOODFOLIO</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-[#2b417e] bg-[#132047] text-[#8cb0fd]">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href="/alex"
              className="hidden sm:inline-block px-3.5 py-1.5 rounded-lg border border-[#2b3f78] bg-[#0e193d] hover:border-[#8cb0fd] text-[#8cb0fd] transition-colors"
            >
              [ Live Demo: @alex ]
            </a>

            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-lg bg-[#f8c076] text-[#0b1124] font-bold hover:bg-[#ffcf8e] transition-colors"
              >
                Dashboard (@{user?.username}) ↗
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-[#8cb0fd] hover:text-white transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[#f8c076] text-[#0b1124] font-bold hover:bg-[#ffcf8e] transition-colors"
                >
                  Create Portfolio ↗
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center space-y-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2b417e] bg-[#0e183a] text-xs font-mono text-[#8cb0fd]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f8c076] animate-pulse" />
          <span>PRESENTATION-FIRST DEVELOPER PORTFOLIO PLATFORM</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white uppercase leading-[1.08]">
            DITCH THE BORING RESUME.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8c076] via-[#f1edff] to-[#8cb0fd]">
              PRESENT YOUR WORK.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#b8ccf4] font-sans leading-relaxed max-w-2xl mx-auto">
            SoodFolio turns your developer profile into a high-impact, fullscreen slide deck.
            Built with Spring Boot 3 &amp; Next.js 16 for zero-flicker speed and recruiter conversion.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          <a
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f8c076] text-[#0b1124] font-bold hover:bg-[#ffcf8e] transition-all shadow-[0_0_25px_rgba(248,192,118,0.3)] text-sm"
          >
            [ Create Your Free Portfolio ↗ ]
          </a>
          <a
            href="/alex"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#3b5394] bg-[#101b3d] hover:border-[#8cb0fd] text-[#8cb0fd] hover:text-white transition-all text-sm font-semibold"
          >
            [ View Demo Slide Deck: @alex ]
          </a>
        </div>

        {/* Quick Search Handle Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md space-y-2 pt-2">
          <div className="relative flex items-center rounded-2xl border border-[#314a88] bg-[#0d1633] p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] focus-within:border-[#f8c076] transition-colors">
            <span className="pl-3.5 font-mono text-sm text-[#7a90c5]">soodfolio.com/</span>
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="username (try 'alex')"
              className="flex-1 bg-transparent px-2 py-2 font-mono text-sm text-white placeholder-[#4b6094] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#f8c076] text-[#0b1124] font-mono text-xs font-bold hover:bg-[#ffcf8e] transition-colors cursor-pointer"
            >
              View ↗
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#6c82b5]">
            Or view verified sample portfolio:{' '}
            <a href="/alex" className="text-[#f8c076] hover:underline font-bold">
              @alex
            </a>
          </p>
        </form>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 w-full text-left font-mono">
          <div className="rounded-2xl p-5 border border-[#233568] bg-[#0d1736]/90 space-y-2">
            <div className="text-xs text-[#f8c076] font-bold">[ 01 ] FULLSCREEN DECK</div>
            <div className="text-sm text-white font-sans font-bold">Slide Snap Navigation</div>
            <p className="text-xs text-[#95abdc] font-sans leading-relaxed">
              Keyboard arrows, scroll snap, and full-screen spotlights for each individual project and experience.
            </p>
          </div>

          <div className="rounded-2xl p-5 border border-[#233568] bg-[#0d1736]/90 space-y-2">
            <div className="text-xs text-[#8cb0fd] font-bold">[ 02 ] CLEAN ARCHITECTURE</div>
            <div className="text-sm text-white font-sans font-bold">Java 17 + Spring Boot 3</div>
            <p className="text-xs text-[#95abdc] font-sans leading-relaxed">
              Backed by PostgreSQL, SOLID service contracts, JJWT authentication, and strict REST design.
            </p>
          </div>

          <div className="rounded-2xl p-5 border border-[#233568] bg-[#0d1736]/90 space-y-2">
            <div className="text-xs text-[#ddd7ff] font-bold">[ 03 ] ZERO-FLICKER SSR</div>
            <div className="text-sm text-white font-sans font-bold">Next.js 16 App Router</div>
            <p className="text-xs text-[#95abdc] font-sans leading-relaxed">
              Instant HTML delivery with dynamic OpenGraph meta tags tailored for every developer handle.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#182344] py-8 text-center font-mono text-xs text-[#6377a7]">
        <p>SoodFolio Platform © 2026 • Built with Spring Boot 3, Next.js 16 &amp; PostgreSQL</p>
      </footer>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { PortfolioData } from '@/types/portfolio';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { DeveloperNotFound } from '@/components/developer-not-found';
import { API_BASE, hasSessionFlag } from '@/lib/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PreviewDraftVerifierProps {
  username: string;
}

export function PreviewDraftVerifier({ username }: PreviewDraftVerifierProps) {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If not authenticated via session cookie, immediately fail to 404
    if (!hasSessionFlag()) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDraftPortfolio = async () => {
      try {
        // Step 1: Silent refresh to acquire fresh in-memory access token
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        if (!refreshRes.ok) {
          if (isMounted) setNotFound(true);
          return;
        }

        const authData = await refreshRes.json();
        const accessToken = authData.accessToken;

        // Step 2: Fetch portfolio using Bearer token for draft/owner authorization
        const portRes = await fetch(`${API_BASE}/portfolios/${encodeURIComponent(username)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        if (!portRes.ok) {
          if (isMounted) setNotFound(true);
          return;
        }

        const data: PortfolioData = await portRes.json();
        if (isMounted) {
          setPortfolio(data);
        }
      } catch (err) {
        console.warn('Failed to verify draft portfolio ownership:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDraftPortfolio();

    return () => {
      isMounted = false;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-[#080d12] text-slate-300 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
        <p className="text-xs font-mono text-slate-400">Đang đồng bộ dữ liệu bản xem trước...</p>
      </div>
    );
  }

  if (notFound || !portfolio) {
    return <DeveloperNotFound username={username} />;
  }

  return (
    <div className="relative w-full">
      {/* Matte Draft Banner */}
      <div className="sticky top-0 z-50 w-full px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md flex items-center justify-between text-xs font-sans text-amber-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-300">Đang xem trước chế độ Bản Nháp (DRAFT)</span>
          <span className="hidden sm:inline text-amber-200/60 font-normal">· Chỉ chủ tài khoản mới có quyền xem</span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Studio</span>
        </Link>
      </div>

      <VerticalStackDeck data={portfolio} variant={portfolio.themeConfig} />
    </div>
  );
}

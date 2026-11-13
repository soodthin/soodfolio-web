import type { Metadata } from 'next';
import { PortfolioData } from '@/types/portfolio';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { PreviewDraftVerifier } from '@/components/preview/PreviewDraftVerifier';
import { DEMO_PORTFOLIO } from '@/lib/demoPortfolio';

const API_BASE = process.env.API_INTERNAL_URL || 'http://localhost:8080/api/v1';

async function getPortfolio(username: string): Promise<PortfolioData | null> {
  try {
    const res = await fetch(`${API_BASE}/portfolios/${encodeURIComponent(username)}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch preview portfolio for '${username}':`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  let portfolio = await getPortfolio(username);

  if (username === 'demo' && !portfolio) {
    portfolio = DEMO_PORTFOLIO;
  }

  if (!portfolio) {
    return {
      title: `@${username} Preview | SoodFolio`,
      description: 'Đang xem trước hồ sơ trên SoodFolio.',
    };
  }

  return {
    title: `${portfolio.title} | ${portfolio.tagline}`,
    description: portfolio.bio || undefined,
    openGraph: {
      title: `${portfolio.title} (@${portfolio.username}) - Portfolio Preview`,
      description: portfolio.bio || undefined,
      type: 'profile',
      username: portfolio.username,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.title} | SoodFolio`,
      description: portfolio.bio || undefined,
    },
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let portfolio = await getPortfolio(username);

  // Demo Fallback: When username is 'demo' and backend is unreachable or returns null
  if (username === 'demo' && !portfolio) {
    portfolio = DEMO_PORTFOLIO;
  }

  // If public portfolio found or demo fallback active, render directly
  if (portfolio) {
    return <VerticalStackDeck data={portfolio} variant={portfolio.themeConfig} />;
  }

  // For other usernames: If SSR returns 404, check client session for draft preview
  return <PreviewDraftVerifier username={username} />;
}

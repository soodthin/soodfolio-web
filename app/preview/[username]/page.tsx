import type { Metadata } from 'next';
import { PortfolioData } from '@/types/portfolio';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { DeveloperNotFound } from '@/components/developer-not-found';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

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
    console.error(`Failed to fetch portfolio for '${username}':`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return {
      title: `@${username} Not Found | SoodFolio`,
      description: 'The requested developer portfolio was not found on SoodFolio.',
    };
  }

  return {
    title: `${portfolio.title} | ${portfolio.tagline}`,
    description: portfolio.bio || undefined,
    openGraph: {
      title: `${portfolio.title} (@${portfolio.username}) - Portfolio`,
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

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return <DeveloperNotFound username={username} />;
  }

  return <VerticalStackDeck data={portfolio} />;
}

import type { Metadata } from 'next';
import { PortfolioData } from '@/types/portfolio';
import { PortfolioPrintDossier } from '@/components/export/PortfolioPrintDossier';
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
    title: `Export PDF • ${portfolio.fullName || portfolio.title} (@${portfolio.username}) | SoodFolio`,
    description: `A4 Executive Portfolio Dossier / CV for ${portfolio.fullName || portfolio.title}.`,
  };
}

export default async function ExportPortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { username } = await params;
  const sParams = await searchParams;
  const autoPrint = sParams.print === 'true' || sParams.auto === 'true';

  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return <DeveloperNotFound username={username} />;
  }

  return <PortfolioPrintDossier data={portfolio} autoPrint={autoPrint} />;
}

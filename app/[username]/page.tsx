import type { Metadata } from 'next';
import { PortfolioData } from '@/types/portfolio';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { DeveloperNotFound } from '@/components/developer-not-found';

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
      robots: { index: false, follow: false },
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://soodfolio.com';
  const canonicalUrl = `${appUrl}/${encodeURIComponent(portfolio.username)}`;
  const cleanTagline = (portfolio.tagline || 'Software Engineer').replace(/\s*\/\/\s*/g, ' · ');
  const title = `${portfolio.title} | ${cleanTagline}`;
  const description =
    portfolio.bio || `${portfolio.title}'s developer portfolio and production systems.`;

  // Dynamically compile SEO keywords from skills and roles
  const skillKeywords = portfolio.skills?.map((s) => s.name) || [];
  const keywords = Array.from(
    new Set([
      portfolio.title,
      portfolio.username,
      'Software Engineer',
      'Full-Stack Developer',
      'Backend Engineer',
      'Frontend Developer',
      ...skillKeywords,
      'Developer Portfolio',
      'Production Systems',
    ])
  );

  const images = portfolio.avatarUrl
    ? [
        {
          url: portfolio.avatarUrl.startsWith('http')
            ? portfolio.avatarUrl
            : `${appUrl}${portfolio.avatarUrl}`,
          width: 800,
          height: 800,
          alt: `${portfolio.title} Profile Photo`,
        },
      ]
    : [];

  return {
    metadataBase: new URL(appUrl),
    title,
    description,
    keywords,
    authors: [{ name: portfolio.title, url: canonicalUrl }],
    creator: portfolio.title,
    alternates: {
      canonical: `/${encodeURIComponent(portfolio.username)}`,
    },
    openGraph: {
      title: `${portfolio.title} — ${cleanTagline}`,
      description,
      url: canonicalUrl,
      siteName: 'SoodFolio',
      images,
      type: 'profile',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((img) => img.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://soodfolio.com';
  const canonicalUrl = `${appUrl}/${encodeURIComponent(portfolio.username)}`;
  const cleanTagline = (portfolio.tagline || 'Software Engineer').replace(/\s*\/\/\s*/g, ' · ');

  // JSON-LD Schema.org structured data for Google Knowledge Graph & Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.title,
    alternateName: portfolio.username,
    jobTitle: cleanTagline,
    description: portfolio.bio,
    url: canonicalUrl,
    image: portfolio.avatarUrl
      ? portfolio.avatarUrl.startsWith('http')
        ? portfolio.avatarUrl
        : `${appUrl}${portfolio.avatarUrl}`
      : undefined,
    sameAs: [
      'https://github.com/soodthin',
      'https://linkedin.com/in/thinhthai',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Ho Chi Minh City Open University (HCMCOU)',
    },
    knowsAbout: portfolio.skills?.map((s) => s.name) || [
      'Java',
      'Spring Boot',
      'React',
      'TypeScript',
      'FastAPI',
      'Python',
      'PostgreSQL',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerticalStackDeck data={portfolio} variant={portfolio.themeConfig} />
    </>
  );
}

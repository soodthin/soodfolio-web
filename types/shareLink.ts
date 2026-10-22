import { PortfolioData } from './portfolio';

export type TemplateLayout = 'CINEMATIC_DECK' | 'MINIMALIST_DOC';

export interface ShareLinkDto {
  id: string;
  portfolioId: string;
  companyName: string;
  slugAlias?: string | null;
  customLayout: TemplateLayout;
  allowedSlideIds?: string[] | null;
  expiresAt?: string | null;
  maxViews?: number | null;
  viewCount: number;
  isRevoked: boolean;
  createdAt: string;
  updatedAt?: string;
  token?: string; // Only present when newly created
  shareUrl?: string;
}

export interface CreateShareLinkRequest {
  companyName: string;
  slugAlias?: string | null;
  customLayout: TemplateLayout;
  allowedSlideIds?: string[] | null;
  expiresAt?: string | null;
  maxViews?: number | null;
}

export interface SlideDwellMetric {
  slideKey: string;
  label: string;
  dwellSeconds: number;
  percentage: number;
  interestLevel: 'high' | 'medium' | 'low';
}

export interface ShareLinkAnalyticsDto {
  linkId: string;
  companyName: string;
  totalViews: number;
  totalDwellSeconds: number;
  completionRate: number; // 0 to 100
  lastViewedAt?: string | null;
  deviceBreakdown: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  slideHeatmap: SlideDwellMetric[];
}

export interface PublicShareLinkData {
  companyName: string;
  customLayout: TemplateLayout;
  allowedSlideIds?: string[] | null;
  expiresAt?: string | null;
  isExpired: boolean;
  isRevoked: boolean;
  portfolio: PortfolioData;
}

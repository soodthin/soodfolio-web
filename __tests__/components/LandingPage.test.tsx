import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '@/app/page';
import * as authContext from '@/context/AuthContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LandingPage Pitch-Inspired & SoodFolio Matte Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      token: null,
      refreshSession: vi.fn(),
      login: vi.fn(),
      isAuthenticated: false,
      isLoading: false,
      logout: vi.fn(),
    });
  });

  it('renders headline and exhibition ready badge', () => {
    render(<LandingPage />);

    // Default language is 'vi'
    expect(screen.getAllByText(/Tạo Portfolio mang đậm cá tính riêng/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stage 01 • Exhibition Ready/i).length).toBeGreaterThan(0);
  });

  it('interacts with Taste Playground switchers (Layout, Accent, Font)', () => {
    render(<LandingPage />);

    // Verify Playground section header
    expect(screen.getAllByText(/THỬ NGHIỆM GU THẨM MỸ|TEST-DRIVE YOUR SIGNATURE AESTHETIC/i).length).toBeGreaterThan(0);

    // Switch to Minimalist CV layout
    const cvLayoutBtn = screen.getByTestId('layout-cv');
    fireEvent.click(cvLayoutBtn);

    // Should now show CV Header with Alexa Chen
    expect(screen.getByText(/Linear Payments Inc\./i)).toBeDefined();

    // Switch back to Slide Deck
    const deckLayoutBtn = screen.getByTestId('layout-deck');
    fireEvent.click(deckLayoutBtn);

    expect(screen.getByText(/SLIDE 03 • ARCHITECTURE & METRICS/i)).toBeDefined();
  });

  it('switches targeted company in Job-Winning Bento', () => {
    render(<LandingPage />);

    expect(screen.getByText(/THE JOB-WINNING BENTO/i)).toBeDefined();

    // Default company is @shopee
    const targetLink = screen.getByTestId('bento-target-link');
    expect(targetLink.textContent).toContain('shopee');

    // Click @vng company button
    const vngBtn = screen.getByText(/@vng/i);
    fireEvent.click(vngBtn);

    expect(targetLink.textContent).toContain('vng');
  });

  it('filters blueprints in Cross-Industry Showcase', () => {
    render(<LandingPage />);

    expect(screen.getAllByText(/THƯ VIỆN MẪU ĐA NGÀNH|CROSS-INDUSTRY SHOWCASE/i).length).toBeGreaterThan(0);

    // Default shows all templates (including Elena Vance and Tara Sundaram)
    expect(screen.getAllByText(/Elena Vance/i).length).toBeGreaterThan(0);

    // Filter by Engineering
    const engineeringTab = screen.getByText(/Lập trình & Hạ tầng|Software & Infra/i);
    fireEvent.click(engineeringTab);

    // Should still display Tara Sundaram or Minh Quan
    expect(screen.getAllByText(/Tara Sundaram/i).length).toBeGreaterThan(0);
  });

  it('toggles language between VI and EN', () => {
    render(<LandingPage />);

    const langBtn = screen.getByTestId('lang-toggle');
    fireEvent.click(langBtn);

    // Switches to EN
    expect(screen.getByText('en')).toBeDefined();
    expect(screen.getAllByText(/Craft a portfolio that reflects your personal taste/i).length).toBeGreaterThan(0);
  });
});

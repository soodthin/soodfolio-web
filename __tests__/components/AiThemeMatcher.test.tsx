import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsInspector } from '@/components/dashboard/studio/inspectors/SettingsInspector';
import { PortfolioData } from '@/types/portfolio';
import * as apiClient from '@/lib/apiClient';

describe('AI Theme Matcher in SettingsInspector Unit & Anti-Pattern Tests', () => {
  const mockOnToggleSection = vi.fn().mockResolvedValue(undefined);
  const mockOnUpdateField = vi.fn();
  const mockOnSaveProfile = vi.fn().mockResolvedValue(undefined);

  const mockPortfolio: PortfolioData = {
    id: 'port-ai-matcher-1',
    username: 'architect_alice',
    fullName: 'Alice Nguyen',
    title: 'Distributed Systems & Cloud Architect',
    tagline: 'High-throughput low-latency microservices',
    bio: 'Experienced backend specialist with focus on Linux internals, Kubernetes, and distributed consensus.',
    statusText: 'Open to principal architecture roles',
    avatarUrl: null,
    resumeUrl: null,
    themeMode: 'DARK',
    themeConfig: 'classic-deck',
    isPublished: true,
    totalViews: 350,
    showExperience: true,
    showProjects: true,
    showSkills: true,
    showEducation: true,
    showContact: true,
    socialLinks: [],
    projects: [],
    experiences: [],
    skills: [
      { id: 's1', name: 'Go', category: 'LANGUAGES' },
      { id: 's2', name: 'Kubernetes', category: 'DEVOPS' },
      { id: 's3', name: 'PostgreSQL', category: 'DATABASES' },
    ],
    educations: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Auto-Fetch on Mount & Payload Verification', () => {
    it('returns null and does not invoke API when portfolio is null', () => {
      const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth');

      const { container } = render(
        <SettingsInspector
          portfolio={null}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      expect(container.firstChild).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('automatically dispatches POST /api/v1/ai/suggest-theme on mount with user profile payload', async () => {
      const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'terminal',
            reason: 'Phù hợp với chuyên môn hạ tầng phân tán và Linux internals.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/ai/suggest-theme'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: mockPortfolio.title,
            bio: mockPortfolio.bio,
            skills: ['Go', 'Kubernetes', 'PostgreSQL'],
          }),
        })
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });
    });

    it('displays loading indicator while waiting for AI theme suggestion', async () => {
      let resolvePromise: (value: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.spyOn(apiClient, 'fetchWithAuth').mockReturnValue(pendingResponse);

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      expect(screen.getByText('AI Đang đề xuất...')).toBeDefined();

      resolvePromise!(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'terminal',
            reason: 'Phù hợp với chuyên môn hạ tầng.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      await waitFor(() => {
        expect(screen.queryByText('AI Đang đề xuất...')).toBeNull();
      });
    });
  });

  describe('Template Matching & AI Recommendation Badge Rendering', () => {
    it('matches "terminal" to "terminal-matrix" and renders badge and reason on Terminal Matrix card', async () => {
      const mockReason = 'Đặc thù kỹ sư hạ tầng phân tán và Cloud Native tối ưu nhất với bố cục dòng lệnh Terminal Matrix.';
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'terminal',
            reason: mockReason,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      expect(screen.getByText(mockReason)).toBeDefined();

      // Find the card containing Terminal Matrix and verify it holds the badge
      const terminalTitle = screen.getByText('Terminal Matrix');
      const terminalCard = terminalTitle.closest('button');
      expect(terminalCard).toBeDefined();
      expect(terminalCard?.textContent).toContain('AI Đề xuất');
      expect(terminalCard?.textContent).toContain(mockReason);

      // Verify other templates do NOT have AI Đề xuất badge
      const classicCard = screen.getByText('Classic Deck').closest('button');
      expect(classicCard?.textContent).not.toContain('AI Đề xuất');

      const spotlightCard = screen.getByText('Spotlight Focus').closest('button');
      expect(spotlightCard?.textContent).not.toContain('AI Đề xuất');

      const editorialCard = screen.getByText('Editorial Clean').closest('button');
      expect(editorialCard?.textContent).not.toContain('AI Đề xuất');
    });

    it('matches "spotlight" to "spotlight-focus" and renders badge on Spotlight Focus card', async () => {
      const mockReason = 'Thích hợp cho Product Engineer và Demo tương tác trực tiếp.';
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'spotlight',
            reason: mockReason,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const spotlightTitle = screen.getByText('Spotlight Focus');
      const spotlightCard = spotlightTitle.closest('button');
      expect(spotlightCard?.textContent).toContain('AI Đề xuất');
      expect(spotlightCard?.textContent).toContain(mockReason);
    });

    it('matches "editorial" to "editorial-clean" and renders badge on Editorial Clean card', async () => {
      const mockReason = 'Định dạng bài viết chuyên sâu và kiến trúc bài thuyết trình.';
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'editorial',
            reason: mockReason,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const editorialTitle = screen.getByText('Editorial Clean');
      const editorialCard = editorialTitle.closest('button');
      expect(editorialCard?.textContent).toContain('AI Đề xuất');
      expect(editorialCard?.textContent).toContain(mockReason);
    });

    it('matches "classic" to "classic-deck" and renders badge on Classic Deck card', async () => {
      const mockReason = 'Bố cục cân bằng chuẩn mực cho mọi vị trí công nghệ.';
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'classic',
            reason: mockReason,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const classicTitle = screen.getByText('Classic Deck');
      const classicCard = classicTitle.closest('button');
      expect(classicCard?.textContent).toContain('AI Đề xuất');
      expect(classicCard?.textContent).toContain(mockReason);
    });
  });

  describe('User Interaction & Template Selection', () => {
    it('updates themeConfig and calls onSaveProfile when user selects recommended template', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'terminal',
            reason: 'Tối ưu cho kỹ sư Linux.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const terminalCard = screen.getByText('Terminal Matrix').closest('button');
      fireEvent.click(terminalCard!);

      expect(mockOnUpdateField).toHaveBeenCalledWith('themeConfig', 'terminal-matrix');
      expect(mockOnSaveProfile).toHaveBeenCalledWith({ themeConfig: 'terminal-matrix' });
    });
  });

  describe('Defensive Graceful Fallback on API Failures', () => {
    it('handles HTTP 429 rate limit gracefully without crashing or throwing', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 429,
            message: 'Rate limit exceeded: 15 req/min',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('AI Đang đề xuất...')).toBeNull();
      });

      // Verify template selector still renders all 4 options
      expect(screen.getByText('Classic Deck')).toBeDefined();
      expect(screen.getByText('Spotlight Focus')).toBeDefined();
      expect(screen.getByText('Terminal Matrix')).toBeDefined();
      expect(screen.getByText('Editorial Clean')).toBeDefined();

      // Ensure no recommendation badge is shown
      expect(screen.queryByText('AI Đề xuất')).toBeNull();
    });

    it('handles HTTP 503 service unavailable gracefully without breaking UI', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 503,
            message: 'Service Unavailable',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('AI Đang đề xuất...')).toBeNull();
      });

      expect(screen.getByText('Classic Deck')).toBeDefined();
      expect(screen.queryByText('AI Đề xuất')).toBeNull();
    });

    it('handles network error (rejection) cleanly via catch block', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockRejectedValue(
        new Error('Failed to fetch from backend')
      );

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('AI Đang đề xuất...')).toBeNull();
      });

      expect(screen.getByText('Bộ chọn Template Trình chiếu')).toBeDefined();
      expect(screen.queryByText('AI Đề xuất')).toBeNull();
    });
  });

  describe('UI Anti-Pattern & Design Discipline Verification', () => {
    it('contains strictly ZERO emojis across all rendered SettingsInspector content', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'terminal',
            reason: 'Tối ưu cho kiến trúc phân tán.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const { container } = render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      const text = container.textContent || '';
      expect(emojiRegex.test(text)).toBe(false);
      expect(text.includes('\u2713')).toBe(false);
    });

    it('ensures badges and buttons use font-sans and avoid square brackets [ ] or slashes //', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            recommendedTemplateId: 'spotlight',
            reason: 'Tối ưu cho sản phẩm trình diễn.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const { container } = render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={mockOnToggleSection}
          onUpdateField={mockOnUpdateField}
          onSaveProfile={mockOnSaveProfile}
          isSaving={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('AI Đề xuất')).toBeDefined();
      });

      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        const text = (btn.textContent || '').trim();
        expect(text).not.toMatch(/\[.*\]/);
        expect(text).not.toContain('//');

        if (text.length > 0) {
          const classAttr = btn.getAttribute('class') || '';
          const hasFontSans =
            classAttr.includes('font-sans') ||
            Array.from(btn.querySelectorAll('*')).some((el) => {
              const attr = el.getAttribute('class') || '';
              return attr.includes('font-sans');
            });
          expect(hasFontSans).toBe(true);
        }
      });
    });
  });
});

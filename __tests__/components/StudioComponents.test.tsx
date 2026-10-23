import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlideRail } from '@/components/dashboard/studio/SlideRail';
import { StageToolbar } from '@/components/dashboard/studio/StageToolbar';
import { StudioHeader } from '@/components/dashboard/studio/StudioHeader';
import { PortfolioData } from '@/types/portfolio';

const mockPortfolio: PortfolioData = {
  id: 'p1',
  username: 'testdev',
  fullName: 'Test Developer',
  title: 'Senior Software Engineer',
  tagline: 'Building High-Performance Distributed Systems',
  bio: 'Passionate about engineering excellence and clean architectures.',
  statusText: 'Available for hire',
  avatarUrl: null,
  resumeUrl: null,
  themeMode: 'DARK',
  isPublished: true,
  totalViews: 42,
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  socialLinks: [{ platform: 'GitHub', url: 'https://github.com/testdev', label: 'GitHub' }],
  projects: [
    {
      id: 'proj1',
      title: 'SoodFolio Studio',
      subtitle: 'Deck Platform',
      role: 'Lead Architect',
      techStack: ['Next.js', 'Spring Boot'],
    },
  ],
  experiences: [
    {
      id: 'exp1',
      roleTitle: 'Staff Engineer',
      companyName: 'Tech Corp',
      periodText: '2022 - Present',
      highlights: ['Optimized API throughput by 40%'],
    },
  ],
  skills: [
    { id: 'sk1', name: 'TypeScript', category: 'LANGUAGES' },
    { id: 'sk2', name: 'Spring Boot', category: 'FRAMEWORKS' },
  ],
  educations: [],
};

describe('Studio Subcomponents Unit Tests', () => {
  describe('SlideRail Component', () => {
    it('renders all 5 slide rail items with shortcuts in vertical mode', () => {
      const onSelectSlide = vi.fn();
      render(<SlideRail activeSlide="cover" onSelectSlide={onSelectSlide} orientation="vertical" />);

      expect(screen.getByText('01')).toBeDefined();
      expect(screen.getByText('02')).toBeDefined();
      expect(screen.getByText('03')).toBeDefined();
      expect(screen.getByText('04')).toBeDefined();
      expect(screen.getByText('05')).toBeDefined();

      const projectsBtn = screen.getByTitle(/02 - Selected Case Studies/i);
      fireEvent.click(projectsBtn);
      expect(onSelectSlide).toHaveBeenCalledWith('projects');
    });

    it('renders horizontal navigation bar for mobile viewports', () => {
      const onSelectSlide = vi.fn();
      render(<SlideRail activeSlide="experience" onSelectSlide={onSelectSlide} orientation="horizontal" />);

      const expBtn = screen.getByText('Exp');
      expect(expBtn).toBeDefined();
      fireEvent.click(expBtn);
      expect(onSelectSlide).toHaveBeenCalledWith('experience');
    });
  });

  describe('StageToolbar Component', () => {
    it('handles next and previous slide navigation buttons', () => {
      const onSelectSlide = vi.fn();
      const onSetZoom = vi.fn();
      const onToggleStageTheme = vi.fn();
      const onToggleFullscreen = vi.fn();
      const onSetViewportMode = vi.fn();

      render(
        <StageToolbar
          activeSlide="projects"
          onSelectSlide={onSelectSlide}
          zoom="fit"
          onSetZoom={onSetZoom}
          stageTheme="dark"
          onToggleStageTheme={onToggleStageTheme}
          isFullscreen={false}
          onToggleFullscreen={onToggleFullscreen}
          viewportMode="16:9"
          onSetViewportMode={onSetViewportMode}
        />
      );

      expect(screen.getByText(/SLIDE 02 · 05/i)).toBeDefined();

      const nextBtn = screen.getByTitle(/Slide kế tiếp/i);
      fireEvent.click(nextBtn);
      expect(onSelectSlide).toHaveBeenCalledWith('experience');

      const prevBtn = screen.getByTitle(/Slide trước/i);
      fireEvent.click(prevBtn);
      expect(onSelectSlide).toHaveBeenCalledWith('cover');
    });
  });

  describe('StudioHeader Component', () => {
    it('renders brand, deck title, public copy link and live switch pill', () => {
      const onToggleStatus = vi.fn();
      const onToggleTheme = vi.fn();
      const onToggleLang = vi.fn();
      const onCopyLink = vi.fn();
      const onLogout = vi.fn();

      render(
        <StudioHeader
          portfolio={mockPortfolio}
          user={{ id: 'u1', username: 'testdev', fullName: 'Test Developer', email: 'test@example.com', role: 'USER' }}
          theme="dark"
          lang="vi"
          isUpdatingStatus={false}
          onToggleStatus={onToggleStatus}
          onToggleTheme={onToggleTheme}
          onToggleLang={onToggleLang}
          onCopyLink={onCopyLink}
          copiedLink={false}
          onLogout={onLogout}
        />
      );

      expect(screen.getByText('SOODFOLIO')).toBeDefined();
      expect(screen.getByText(/Senior Software Engineer/i)).toBeDefined();
      expect(screen.getByText('LIVE')).toBeDefined();

      const liveBtn = screen.getByTitle(/Trạng thái: Công khai/i);
      fireEvent.click(liveBtn);
      expect(onToggleStatus).toHaveBeenCalled();
    });
  });
});

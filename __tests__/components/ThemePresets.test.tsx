import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { THEME_PRESETS, getThemePreset, DEFAULT_PRESET, ThemePresetKey } from '@/lib/themePresets';
import { SettingsInspector } from '@/components/dashboard/studio/inspectors/SettingsInspector';
import { PresentationStage } from '@/components/dashboard/studio/PresentationStage';
import { VerticalStackDeck } from '@/components/deck/VerticalStackDeck';
import { PortfolioData } from '@/types/portfolio';
import fs from 'fs';
import path from 'path';

const mockPortfolio: PortfolioData = {
  id: 'p-theme-test',
  username: 'themetester',
  fullName: 'Theme Tester',
  title: 'Senior Frontend Architect',
  tagline: 'Design Tokens & Multi-Preset Systems',
  bio: 'Specialist in CSS design tokens and resilient layout architecture.',
  statusText: 'Testing themes',
  avatarUrl: null,
  resumeUrl: null,
  themeMode: 'DARK',
  themeConfig: 'classic-deck',
  isPublished: true,
  totalViews: 100,
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  socialLinks: [],
  projects: [
    {
      id: 'p1',
      title: 'Theme Engine',
      subtitle: 'CSS Tokens',
      role: 'Lead Architect',
      techStack: ['Next.js', 'Tailwind CSS'],
    },
  ],
  experiences: [],
  skills: [
    { id: 'sk1', name: 'TypeScript', category: 'LANGUAGES' },
    { id: 'sk2', name: 'React', category: 'FRAMEWORKS' },
  ],
  educations: [],
};

describe('Theme Presets & Design Tokens Comprehensive Test Suite', () => {
  describe('lib/themePresets.ts Unit Tests & Fallback Resilience', () => {
    it('contains all 4 required template presets with exact colors and fonts', () => {
      const keys = Object.keys(THEME_PRESETS);
      expect(keys).toHaveLength(4);
      expect(keys).toEqual(
        expect.arrayContaining([
          'classic-deck',
          'spotlight-focus',
          'terminal-matrix',
          'editorial-clean',
        ])
      );

      // Classic Deck
      expect(THEME_PRESETS['classic-deck'].accentHex).toBe('#2DD4BF');
      expect(THEME_PRESETS['classic-deck'].bgHex).toBe('#080D12');
      expect(THEME_PRESETS['classic-deck'].surfaceHex).toBe('#0D131A');
      expect(THEME_PRESETS['classic-deck'].fontName).toBe('Inter');
      expect(THEME_PRESETS['classic-deck'].fontVar).toBe('var(--font-inter)');

      // Spotlight Focus
      expect(THEME_PRESETS['spotlight-focus'].accentHex).toBe('#818CF8');
      expect(THEME_PRESETS['spotlight-focus'].bgHex).toBe('#0B0F19');
      expect(THEME_PRESETS['spotlight-focus'].surfaceHex).toBe('#111827');
      expect(THEME_PRESETS['spotlight-focus'].fontName).toBe('Outfit');
      expect(THEME_PRESETS['spotlight-focus'].fontVar).toBe('var(--font-outfit)');

      // Terminal Matrix
      expect(THEME_PRESETS['terminal-matrix'].accentHex).toBe('#34D399');
      expect(THEME_PRESETS['terminal-matrix'].bgHex).toBe('#05080A');
      expect(THEME_PRESETS['terminal-matrix'].surfaceHex).toBe('#0A0F13');
      expect(THEME_PRESETS['terminal-matrix'].fontName).toBe('JetBrains Mono');
      expect(THEME_PRESETS['terminal-matrix'].fontVar).toBe('var(--font-jetbrains-mono)');

      // Editorial Clean
      expect(THEME_PRESETS['editorial-clean'].accentHex).toBe('#F59E0B');
      expect(THEME_PRESETS['editorial-clean'].bgHex).toBe('#121110');
      expect(THEME_PRESETS['editorial-clean'].surfaceHex).toBe('#1A1918');
      expect(THEME_PRESETS['editorial-clean'].fontName).toBe('Inter');
      expect(THEME_PRESETS['editorial-clean'].fontVar).toBe('var(--font-inter)');
    });

    it('validates DEFAULT_PRESET constant is classic-deck', () => {
      expect(DEFAULT_PRESET).toBe('classic-deck');
    });

    it('returns requested preset for all valid keys', () => {
      const presets: ThemePresetKey[] = [
        'classic-deck',
        'spotlight-focus',
        'terminal-matrix',
        'editorial-clean',
      ];
      presets.forEach((key) => {
        const preset = getThemePreset(key);
        expect(preset.id).toBe(key);
        expect(preset.name).toBeTruthy();
        expect(preset.layoutDescription).toBeTruthy();
      });
    });

    it('robustly falls back to classic-deck for null, undefined, empty string, or invalid input', () => {
      expect(getThemePreset(null).id).toBe(DEFAULT_PRESET);
      expect(getThemePreset(undefined).id).toBe(DEFAULT_PRESET);
      expect(getThemePreset('').id).toBe(DEFAULT_PRESET);
      expect(getThemePreset('   ').id).toBe(DEFAULT_PRESET);
      expect(getThemePreset('cyberpunk-glitch').id).toBe(DEFAULT_PRESET);
      expect(getThemePreset('undefined').id).toBe(DEFAULT_PRESET);
      expect(getThemePreset('null').id).toBe(DEFAULT_PRESET);
    });
  });

  describe('globals.css Design Tokens Specification Tests', () => {
    it('defines required root tokens, dark mode tokens, and 4 preset attribute selectors', () => {
      const cssPath = path.resolve(__dirname, '../../app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Check root tokens
      expect(cssContent).toContain('--accent-primary');
      expect(cssContent).toContain('--accent-muted');
      expect(cssContent).toContain('--font-heading');

      // Check 4 presets in css
      expect(cssContent).toContain('[data-theme-preset="classic-deck"]');
      expect(cssContent).toContain('[data-theme-preset="spotlight-focus"]');
      expect(cssContent).toContain('[data-theme-preset="terminal-matrix"]');
      expect(cssContent).toContain('[data-theme-preset="editorial-clean"]');

      // Check colors and font variables in selectors
      expect(cssContent).toContain('#2DD4BF');
      expect(cssContent).toContain('#818CF8');
      expect(cssContent).toContain('#34D399');
      expect(cssContent).toContain('#F59E0B');
    });
  });

  describe('SettingsInspector Template Selector Component Tests', () => {
    it('returns null when portfolio prop is null', () => {
      const { container } = render(
        <SettingsInspector
          portfolio={null}
          onToggleSection={vi.fn()}
          onUpdateField={vi.fn()}
          onSaveProfile={vi.fn()}
          isSaving={false}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders all 4 template cards with font tags, titles, and layout descriptions', () => {
      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={vi.fn()}
          onUpdateField={vi.fn()}
          onSaveProfile={vi.fn()}
          isSaving={false}
        />
      );

      // Verify template names
      expect(screen.getByText('Classic Deck')).toBeDefined();
      expect(screen.getByText('Spotlight Focus')).toBeDefined();
      expect(screen.getByText('Terminal Matrix')).toBeDefined();
      expect(screen.getByText('Editorial Clean')).toBeDefined();

      // Verify font badges
      expect(screen.getAllByText('Inter')).toHaveLength(2); // Classic Deck and Editorial Clean
      expect(screen.getByText('Outfit')).toBeDefined();
      expect(screen.getByText('JetBrains Mono')).toBeDefined();

      // Verify layout descriptions
      expect(screen.getByText(THEME_PRESETS['classic-deck'].layoutDescription)).toBeDefined();
      expect(screen.getByText(THEME_PRESETS['spotlight-focus'].layoutDescription)).toBeDefined();
      expect(screen.getByText(THEME_PRESETS['terminal-matrix'].layoutDescription)).toBeDefined();
      expect(screen.getByText(THEME_PRESETS['editorial-clean'].layoutDescription)).toBeDefined();
    });

    it('highlights currently selected template card and shows active indicator', () => {
      render(
        <SettingsInspector
          portfolio={{ ...mockPortfolio, themeConfig: 'editorial-clean' }}
          onToggleSection={vi.fn()}
          onUpdateField={vi.fn()}
          onSaveProfile={vi.fn()}
          isSaving={false}
        />
      );

      const editorialBtn = screen.getByText('Editorial Clean').closest('button');
      expect(editorialBtn).not.toBeNull();
      // Should have active highlight classes
      expect(editorialBtn?.className).toContain('ring-teal-500/30');

      const classicBtn = screen.getByText('Classic Deck').closest('button');
      expect(classicBtn?.className).not.toContain('ring-teal-500/30');
    });

    it('defaults active state to classic-deck when portfolio.themeConfig is null or undefined', () => {
      render(
        <SettingsInspector
          portfolio={{ ...mockPortfolio, themeConfig: null }}
          onToggleSection={vi.fn()}
          onUpdateField={vi.fn()}
          onSaveProfile={vi.fn()}
          isSaving={false}
        />
      );

      const classicBtn = screen.getByText('Classic Deck').closest('button');
      expect(classicBtn?.className).toContain('ring-teal-500/30');
    });

    it('triggers onUpdateField and onSaveProfile with correct payload for each template card', () => {
      const onToggleSection = vi.fn();
      const onUpdateField = vi.fn();
      const onSaveProfile = vi.fn().mockResolvedValue(undefined);

      render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={onToggleSection}
          onUpdateField={onUpdateField}
          onSaveProfile={onSaveProfile}
          isSaving={false}
        />
      );

      // Click Spotlight Focus
      const spotlightBtn = screen.getByText('Spotlight Focus').closest('button');
      if (spotlightBtn) {
        fireEvent.click(spotlightBtn);
        expect(onUpdateField).toHaveBeenCalledWith('themeConfig', 'spotlight-focus');
        expect(onSaveProfile).toHaveBeenCalledWith({ themeConfig: 'spotlight-focus' });
      }

      // Click Terminal Matrix
      const terminalBtn = screen.getByText('Terminal Matrix').closest('button');
      if (terminalBtn) {
        fireEvent.click(terminalBtn);
        expect(onUpdateField).toHaveBeenCalledWith('themeConfig', 'terminal-matrix');
        expect(onSaveProfile).toHaveBeenCalledWith({ themeConfig: 'terminal-matrix' });
      }

      // Click Editorial Clean
      const editorialBtn = screen.getByText('Editorial Clean').closest('button');
      if (editorialBtn) {
        fireEvent.click(editorialBtn);
        expect(onUpdateField).toHaveBeenCalledWith('themeConfig', 'editorial-clean');
        expect(onSaveProfile).toHaveBeenCalledWith({ themeConfig: 'editorial-clean' });
      }
    });

    it('renders color preview dots with proper canvas and accent styles', () => {
      const { container } = render(
        <SettingsInspector
          portfolio={mockPortfolio}
          onToggleSection={vi.fn()}
          onUpdateField={vi.fn()}
          onSaveProfile={vi.fn()}
          isSaving={false}
        />
      );

      const canvasSwatches = container.querySelectorAll('[title^="Canvas:"]');
      expect(canvasSwatches).toHaveLength(4);

      // Verify swatch titles match preset hexes
      const titles = Array.from(canvasSwatches).map((el) => el.getAttribute('title'));
      expect(titles).toContain(`Canvas: ${THEME_PRESETS['classic-deck'].bgHex}`);
      expect(titles).toContain(`Canvas: ${THEME_PRESETS['spotlight-focus'].bgHex}`);
      expect(titles).toContain(`Canvas: ${THEME_PRESETS['terminal-matrix'].bgHex}`);
      expect(titles).toContain(`Canvas: ${THEME_PRESETS['editorial-clean'].bgHex}`);
    });
  });

  describe('PresentationStage variant Prop & Theme Integration Tests', () => {
    it('renders loading placeholder when portfolio is null', () => {
      render(
        <PresentationStage
          portfolio={null}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
        />
      );
      expect(screen.getByText('Đang nạp sân khấu trình chiếu...')).toBeDefined();
    });

    it('applies data-theme-preset and fontVar from variant prop', () => {
      const { container } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="spotlight-focus"
        />
      );

      const stageCanvas = container.querySelector('[data-theme-preset="spotlight-focus"]');
      expect(stageCanvas).not.toBeNull();
      expect((stageCanvas as HTMLElement).style.fontFamily).toBe('var(--font-outfit)');
    });

    it('falls back to portfolio.themeConfig when variant is null or undefined', () => {
      const { container } = render(
        <PresentationStage
          portfolio={{ ...mockPortfolio, themeConfig: 'terminal-matrix' }}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant={null}
        />
      );

      const stageCanvas = container.querySelector('[data-theme-preset="terminal-matrix"]');
      expect(stageCanvas).not.toBeNull();
      expect((stageCanvas as HTMLElement).style.fontFamily).toBe('var(--font-jetbrains-mono)');
    });

    it('defaults to classic-deck when both variant and portfolio.themeConfig are absent', () => {
      const { container } = render(
        <PresentationStage
          portfolio={{ ...mockPortfolio, themeConfig: null }}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
        />
      );

      const stageCanvas = container.querySelector('[data-theme-preset="classic-deck"]');
      expect(stageCanvas).not.toBeNull();
      expect((stageCanvas as HTMLElement).style.fontFamily).toBe('var(--font-inter)');
    });

    it('variant prop takes precedence over portfolio.themeConfig', () => {
      const { container } = render(
        <PresentationStage
          portfolio={{ ...mockPortfolio, themeConfig: 'classic-deck' }}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="editorial-clean"
        />
      );

      const stageCanvas = container.querySelector('[data-theme-preset="editorial-clean"]');
      expect(stageCanvas).not.toBeNull();
      expect((stageCanvas as HTMLElement).style.fontFamily).toBe('var(--font-inter)');
    });
  });

  describe('VerticalStackDeck variant Prop & Preset Integration Tests', () => {
    it('applies data-theme-preset and fontVar on main container from variant prop', () => {
      const { container } = render(
        <VerticalStackDeck
          data={mockPortfolio}
          variant="editorial-clean"
        />
      );

      const mainEl = container.querySelector('main[data-theme-preset="editorial-clean"]');
      expect(mainEl).not.toBeNull();
      expect((mainEl as HTMLElement).style.fontFamily).toBe('var(--font-inter)');
    });

    it('falls back to data.themeConfig when variant is omitted', () => {
      const { container } = render(
        <VerticalStackDeck
          data={{ ...mockPortfolio, themeConfig: 'terminal-matrix' }}
        />
      );

      const mainEl = container.querySelector('main[data-theme-preset="terminal-matrix"]');
      expect(mainEl).not.toBeNull();
      expect((mainEl as HTMLElement).style.fontFamily).toBe('var(--font-jetbrains-mono)');
    });

    it('falls back to classic-deck when both variant and data.themeConfig are null', () => {
      const { container } = render(
        <VerticalStackDeck
          data={{ ...mockPortfolio, themeConfig: null }}
          variant={null}
        />
      );

      const mainEl = container.querySelector('main[data-theme-preset="classic-deck"]');
      expect(mainEl).not.toBeNull();
      expect((mainEl as HTMLElement).style.fontFamily).toBe('var(--font-inter)');
    });

    it('variant prop overrides data.themeConfig in VerticalStackDeck', () => {
      const { container } = render(
        <VerticalStackDeck
          data={{ ...mockPortfolio, themeConfig: 'classic-deck' }}
          variant="spotlight-focus"
        />
      );

      const mainEl = container.querySelector('main[data-theme-preset="spotlight-focus"]');
      expect(mainEl).not.toBeNull();
      expect((mainEl as HTMLElement).style.fontFamily).toBe('var(--font-outfit)');

      // Verify Spotlight styling is active (summary section has text-center)
      const summarySection = container.querySelector('#summary');
      expect(summarySection?.className).toContain('text-center');
    });

    it('renders distinct layout and styling elements for Terminal Matrix', () => {
      const { container } = render(
        <VerticalStackDeck
          data={mockPortfolio}
          variant="terminal-matrix"
        />
      );

      // Main element has font-mono
      const mainEl = container.querySelector('main[data-theme-preset="terminal-matrix"]');
      expect(mainEl?.className).toContain('font-mono');
      expect((mainEl as HTMLElement).style.backgroundColor).toBe('rgb(5, 8, 10)'); // #05080A

      // Terminal CLI banners exist
      expect(screen.getByText(/soodfolio@production:~\$ init/)).toBeDefined();
      expect(screen.getByText(/\$ git show project-01 --stat/)).toBeDefined();
      expect(screen.getByText(/TTY: \/dev\/pts\/0/)).toBeDefined();
      expect(screen.getByText(/SYS_REG\.METRIC_01:/)).toBeDefined();
      expect(screen.getByText(/SYS_RES\.LANGUAGES:/)).toBeDefined();
      expect(screen.getByText(/├── backend\/spring-boot-api\//)).toBeDefined();
      expect(screen.getByText(/\.\/run-demo\.sh/)).toBeDefined();
    });

    it('renders distinct editorial rhythm and typography for Editorial Clean', () => {
      const { container } = render(
        <VerticalStackDeck
          data={mockPortfolio}
          variant="editorial-clean"
        />
      );

      // Main element has Warm Charcoal background (#121110)
      const mainEl = container.querySelector('main[data-theme-preset="editorial-clean"]');
      expect((mainEl as HTMLElement).style.backgroundColor).toBe('rgb(18, 17, 16)'); // #121110

      // Editorial monograph markers
      expect(screen.getByText(/Volume 2026 · Curated Monograph/)).toBeDefined();
      expect(screen.getByText(/Feature Story · Project 01/)).toBeDefined();
      expect(screen.getByText(/THE MONOGRAPH/)).toBeDefined();
      expect(screen.getByText(/CHAPTER 01 · ARCHITECTURAL PROLOGUE/)).toBeDefined();
      expect(screen.getByText(/SECTION 04 · INDEX OF PROFICIENCIES/)).toBeDefined();
    });

    it('renders distinct full-width showcase layout for Spotlight Focus', () => {
      const { container } = render(
        <VerticalStackDeck
          data={mockPortfolio}
          variant="spotlight-focus"
        />
      );

      // Main element has Deep Navy background (#0B0F19)
      const mainEl = container.querySelector('main[data-theme-preset="spotlight-focus"]');
      expect((mainEl as HTMLElement).style.backgroundColor).toBe('rgb(11, 15, 25)'); // #0B0F19

      // Project 01 has full-width flex container
      const project01 = container.querySelector('#project-01');
      expect(project01?.className).toContain('flex flex-col gap-8 w-full');

      // Keynote elements
      expect(screen.getByText(/STAGE 01 · KEYNOTE SHOWCASE/)).toBeDefined();
      expect(screen.getByText(/Keynote Speaker & Builder/)).toBeDefined();
      expect(screen.getByText(/KEYNOTE ACT 02 · CAREER TRAJECTORY/)).toBeDefined();
      expect(screen.getByText(/KEYNOTE CURTAIN CALL · GRAND FINALE/)).toBeDefined();
    });
  });

  describe('PresentationStage Layout & Token Distinction Tests', () => {
    it('applies preset background on outer viewport in dark mode', () => {
      const { container } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="terminal-matrix"
        />
      );

      const viewportContainer = container.querySelector('.custom-scrollbar');
      expect((viewportContainer as HTMLElement).style.backgroundColor).toBe('rgb(5, 8, 10)'); // #05080A
    });

    it('renders 1-column project grid in Spotlight Focus on Slide 02', () => {
      const { container } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="projects"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="spotlight-focus"
        />
      );

      const projectGrid = container.querySelector('.grid');
      expect(projectGrid?.className).toContain('grid-cols-1');
      expect(projectGrid?.className).not.toContain('md:grid-cols-2');
    });

    it('renders terminal command prompts in Terminal Matrix on Slide 02', () => {
      render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="projects"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="terminal-matrix"
        />
      );

      expect(screen.getByText('> projects --selected')).toBeDefined();
      expect(screen.getByText('> proj_01')).toBeDefined();
    });

    it('renders authentic art direction signatures across studio slides', () => {
      // Slide 01 Terminal
      const { unmount: unmount1 } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="terminal-matrix"
        />
      );
      expect(screen.getByText(/\[SYS_STAT\] TTY: \/dev\/pts\/0/)).toBeDefined();
      unmount1();

      // Slide 01 Editorial
      const { unmount: unmount2 } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="editorial-clean"
        />
      );
      expect(screen.getByText(/Plate 01 · Studio Monograph/)).toBeDefined();
      unmount2();

      // Slide 01 Spotlight
      const { unmount: unmount3 } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="cover"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="spotlight-focus"
        />
      );
      expect(screen.getByText(/Keynote Spotlight · WWDC Edition/)).toBeDefined();
      unmount3();

      // Slide 05 Settings
      const { unmount: unmount4 } = render(
        <PresentationStage
          portfolio={mockPortfolio}
          activeSlide="settings"
          zoom="fit"
          stageTheme="dark"
          viewportMode="16:9"
          isFullscreen={false}
          variant="terminal-matrix"
        />
      );
      expect(screen.getByText(/> sysctl --load \/etc\/soodfolio\/config\.conf/)).toBeDefined();
      unmount4();
    });
  });
});


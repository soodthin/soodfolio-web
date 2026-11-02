import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const MOCK_PORTFOLIO = {
  id: 'port_qa_theme_1',
  userId: 'usr_e2e_1',
  username: 'qalead',
  fullName: 'QA Lead Architect',
  title: 'QA LEAD ARCHITECT',
  tagline: 'AUTOMATED QUALITY ENGINEERING · LIGHT THEME AUDIT',
  bio: 'Building comprehensive test automation suites and auditing design systems with precision.',
  statusText: 'AVAILABLE FOR AUDIT · DEPLOY READY',
  themeMode: 'LIGHT',
  themeConfig: 'classic-deck',
  isPublished: true,
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  projects: [
    {
      id: 'proj-1',
      title: 'SoodFolio Deck Studio',
      subtitle: 'Keynote IDE for Senior Engineers',
      role: 'Staff Architect',
      periodText: '2025 - Present',
      description: 'Zero-latency spatial editor with real-time typography binding.',
      techStack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Spring Boot 3'],
      liveUrl: 'https://soodfolio.dev',
      githubUrl: 'https://github.com/soodfolio/studio',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      companyName: 'BW Industrial Development',
      roleTitle: 'Senior Software Engineer',
      periodText: '2024 - 2026',
      location: 'Ho Chi Minh City, VN',
      description: 'Architected critical micro-frontends and real-time data pipelines.',
      highlights: [
        'Reduced initial page load latency by 48% via server-driven component streaming.',
        'Engineered automated quality gate with 95% branch coverage on core flows.',
      ],
      skillsUsed: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript', category: 'LANGUAGES' },
    { id: 'sk-2', name: 'Next.js', category: 'FRAMEWORKS' },
    { id: 'sk-3', name: 'PostgreSQL', category: 'DATABASES' },
    { id: 'sk-4', name: 'Docker', category: 'DEVOPS' },
    { id: 'sk-5', name: 'LangChain', category: 'AI_ENGINEERING' },
    { id: 'sk-6', name: 'Git', category: 'TOOLS' },
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/qalead', label: '@qalead' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/qalead', label: 'in/qalead' },
  ],
};

const SCREENSHOT_DIR = path.join(process.cwd(), 'e2e', 'screenshots', 'light-mode');

export interface ThemeAuditRecord {
  category: string;
  element: string;
  property: string;
  actualValue: string;
  expectedValue: string;
  defectSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

export const auditFindings: ThemeAuditRecord[] = [];

test.describe('Comprehensive Light Theme & Contrast Audit Test Suite', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test.beforeEach(async ({ page, context }) => {
    // Stub clipboard API to prevent errors in headless mode
    await page.addInitScript(() => {
      const mockClipboard = {
        writeText: async () => Promise.resolve(),
        readText: async () => Promise.resolve(''),
      };
      try {
        Object.defineProperty(navigator, 'clipboard', {
          value: mockClipboard,
          configurable: true,
        });
      } catch {
        (navigator as any).clipboard = mockClipboard;
      }
    });

    // Mock API endpoints
    await page.route('**/api/v1/portfolios/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PORTFOLIO),
      });
    });

    await page.route('**/api/v1/portfolios/me/projects', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PORTFOLIO.projects[0]),
      });
    });

    await page.route('**/api/v1/portfolios/me/status', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.route('**/api/v1/ai/suggest-theme', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendedTemplateId: 'classic-deck',
          reason: 'Phong cách tối ưu nhất cho cấu trúc năng lực và định vị nghề nghiệp của bạn.',
        }),
      });
    });

    await page.route('**/api/v1/ai/polish', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metricXyz: 'Tối ưu hóa thời gian tải trang 42% bằng Next.js App Router.',
          architectural: 'Thiết kế kiến trúc hệ thống phân tán chịu tải cao.',
          concise: 'Chủ trì kiến trúc và phát triển nền tảng SoodFolio Studio.',
        }),
      });
    });

    await page.route('**/api/v1/portfolios/me/github/repos*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            name: 'soodfolio-core',
            description: 'Core presentation engine with interactive keynote slides.',
            language: 'TypeScript',
            stargazersCount: 58,
            forksCount: 14,
            htmlUrl: 'https://github.com/qalead/soodfolio-core',
          },
        ]),
      });
    });
  });

  // Helper to authenticate user for dashboard tests
  const authenticateUser = async (context: any) => {
    await context.addCookies([
      {
        name: 'soodfolio_token',
        value: 'mock-valid-e2e-studio-token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'soodfolio_refresh_token',
        value: 'mock-valid-e2e-refresh-token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'soodfolio_user',
        value: JSON.stringify({
          id: 'usr_e2e_1',
          email: 'qa@soodfolio.dev',
          fullName: 'QA Lead Architect',
          username: 'qalead',
          role: 'USER',
        }),
        domain: 'localhost',
        path: '/',
      },
    ]);
  };

  // =========================================================================
  // A. DASHBOARD WORKSPACE AUDIT: LIGHT THEME SWITCH & ZONE 2 / 3 DEFECTS
  // =========================================================================
  test('A1: switches to Light Theme on Dashboard and audits html class', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check if html root class has 'dark' removed
    const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    
    if (hasDarkClass) {
      const funcZoneBtn = page.getByRole('button', { name: /Vùng Chức Năng/i });
      await funcZoneBtn.click();
      const themeToggleBtn = page.locator('button').filter({ hasText: /Giao diện/i });
      await themeToggleBtn.click();
      await page.waitForTimeout(300);
    }

    const isLightNow = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
    expect(isLightNow).toBe(true);
  });

  test('A2: audits Zone 2 Center Stage background color in Light Mode (reproduces black box bug)', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(400);

    // Capture Slide 01 screenshot evidence FIRST before assertions
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'dashboard-light-slide-01.png'),
      fullPage: true,
    });

    // Zone 2 center stage container selector in app/dashboard/page.tsx:722
    const stageSection = page.locator('section').filter({ hasText: /SLIDE/i }).first();
    await expect(stageSection).toBeVisible();

    const stageSectionBg = await stageSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log(`[AUDIT] Zone 2 Stage Container background-color: ${stageSectionBg}`);

    const isDarkStageBox = stageSectionBg === 'rgb(8, 13, 18)' || stageSectionBg === '#080d12';
    if (isDarkStageBox) {
      auditFindings.push({
        category: 'Zone 2 Center Stage',
        element: 'section.bg-[#080d12] (app/dashboard/page.tsx:723)',
        property: 'background-color',
        actualValue: stageSectionBg,
        expectedValue: 'rgb(248, 250, 252) (#f8fafc) or light slate surface',
        defectSeverity: 'CRITICAL',
        description: 'Hardcoded dark background #080d12 creates an enormous black container wrapping around light presentation slides.',
      });
    }

    // Falsifiable assertion demonstrating the defect
    expect(stageSectionBg).not.toBe('rgb(8, 13, 18)');
  });

  test('A3: audits Zone 3 Inspector inputs in Light Mode (reproduces black input holes bug)', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    const inputFields = [
      { id: 'field-fullName', label: 'Họ và tên' },
      { id: 'field-title', label: 'Tiêu đề Slide Deck' },
      { id: 'field-tagline', label: 'Định vị chuyên môn' },
      { id: 'field-statusText', label: 'Trạng thái hợp tác' },
      { id: 'field-bio', label: 'Tuyên ngôn Bio' },
    ];

    for (const field of inputFields) {
      const inputEl = page.locator(`#${field.id}`);
      if (await inputEl.isVisible()) {
        const styles = await inputEl.evaluate((el) => {
          const comp = window.getComputedStyle(el);
          return {
            bg: comp.backgroundColor,
            color: comp.color,
            borderColor: comp.borderColor,
          };
        });

        console.log(`[AUDIT] Input #${field.id} styles:`, styles);

        const isDarkInput =
          styles.bg.includes('oklab(0 0 0') ||
          styles.bg.includes('rgba(0, 0, 0') ||
          styles.bg === 'rgb(0, 0, 0)';

        if (isDarkInput) {
          auditFindings.push({
            category: 'Zone 3 Cover Inspector',
            element: `#${field.id} (CoverInspector.tsx)`,
            property: 'background-color',
            actualValue: styles.bg,
            expectedValue: 'rgb(248, 250, 252) or rgb(255, 255, 255) with border-slate-200',
            defectSeverity: 'CRITICAL',
            description: `Input field #${field.id} has hardcoded dark class bg-black/40 and border-white/10 causing black hollow holes on a white sidebar.`,
          });
        }

        // Falsifiable check: input background should not be dark transparent black
        expect(styles.bg).not.toContain('oklab(0 0 0');
        expect(styles.bg).not.toContain('rgba(0, 0, 0');
      }
    }
  });

  test('A4: audits Slide 02 (Projects) Inspector cards and modal in Light Mode', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    // Switch to Slide 02 via SlideRail
    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await slideRail.getByText('Case Studies', { exact: false }).first().click();
    await page.waitForTimeout(400);

    // Capture Slide 02 projects screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'dashboard-light-slide-02-projects.png'),
      fullPage: true,
    });

    // Check project card description text contrast (hardcoded text-slate-300 in ProjectsInspector.tsx:281)
    const descEl = page.locator('p.text-slate-300, p.text-slate-400').first();
    if (await descEl.isVisible()) {
      const textColor = await descEl.evaluate((el) => window.getComputedStyle(el).color);
      console.log(`[AUDIT] ProjectsInspector description color: ${textColor}`);
      if (textColor.includes('203, 213, 225') || textColor.includes('0.85')) {
        auditFindings.push({
          category: 'Zone 3 Projects Inspector',
          element: 'p.text-slate-300 (ProjectsInspector.tsx:281)',
          property: 'color',
          actualValue: textColor,
          expectedValue: 'rgb(71, 85, 105) (text-slate-600) or darker',
          defectSeverity: 'HIGH',
          description: 'Hardcoded text-slate-300 on white card surface results in unreadable low-contrast text.',
        });
      }
    }
  });

  test('A5: audits Slide 04 (Skills) Inspector tags and quick add input in Light Mode', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    // Switch to Slide 04 via SlideRail
    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await slideRail.getByText('System Matrix', { exact: false }).first().click();
    await page.waitForTimeout(400);

    // Capture Slide 04 skills screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'dashboard-light-slide-04-skills.png'),
      fullPage: true,
    });

    const tagInput = page.locator('input[placeholder*="Thêm tag"]').first();
    if (await tagInput.isVisible()) {
      const styles = await tagInput.evaluate((el) => {
        const comp = window.getComputedStyle(el);
        return {
          bg: comp.backgroundColor,
          color: comp.color,
          border: comp.borderColor,
        };
      });

      console.log('[AUDIT] Skills tag input styles:', styles);
      if (styles.bg.includes('oklab(0 0 0') || styles.bg.includes('rgba(0, 0, 0')) {
        auditFindings.push({
          category: 'Zone 3 Skills Inspector',
          element: 'input[placeholder*="Thêm tag"] (SkillsInspector.tsx:176)',
          property: 'background-color',
          actualValue: styles.bg,
          expectedValue: 'rgb(248, 250, 252) or rgb(255, 255, 255) with slate border',
          defectSeverity: 'CRITICAL',
          description: 'Skills quick add input retains bg-black/40 and border-white/10 on light sidebar.',
        });
      }

      // Assert that input is not dark
      expect(styles.bg).not.toContain('oklab(0 0 0');
      expect(styles.bg).not.toContain('rgba(0, 0, 0');
    }
  });

  test('A6: audits Slide 05 (Settings) Inspector template picker and toggles in Light Mode', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    // Switch to Slide 05 via SlideRail
    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await slideRail.getByText('Contact', { exact: false }).first().click();
    await page.waitForTimeout(400);

    // Capture Slide 05 settings / contact screenshot as required by spec
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'dashboard-light-slide-05-settings.png'),
      fullPage: true,
    });

    // Verify Slide 05 Contact inspector or status text input is visible
    const statusField = page.locator('#field-statusText');
    await expect(statusField).toBeVisible();
  });

  test('A7: audits Modals (GitHubImportModal, SnapshotHistoryModal, AiPolishDialog) in Light Mode', async ({ page, context }) => {
    await authenticateUser(context);
    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    // 1. Audit GitHubImportModal
    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await slideRail.getByText('Case Studies', { exact: false }).first().click();
    await page.waitForTimeout(300);

    const ghImportBtn = page.locator('button[aria-label="Import từ GitHub"]');
    if (await ghImportBtn.isVisible()) {
      await ghImportBtn.click();
      await page.waitForTimeout(300);

      const modalDialog = page.locator('div[role="dialog"] div.rounded-3xl').first();
      if (await modalDialog.isVisible()) {
        const modalBg = await modalDialog.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        console.log(`[AUDIT] GitHubImportModal background: ${modalBg}`);

        if (modalBg === 'rgb(12, 19, 26)' || modalBg === '#0c131a') {
          auditFindings.push({
            category: 'GitHubImportModal',
            element: 'div.bg-[#0c131a] (GitHubImportModal.tsx:201)',
            property: 'background-color',
            actualValue: modalBg,
            expectedValue: 'rgb(255, 255, 255) in light theme',
            defectSeverity: 'CRITICAL',
            description: 'GitHubImportModal has hardcoded dark styling bg-[#0c131a] without light mode counterpart.',
          });
        }

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'modal-github-import-light.png'),
        });

        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }

    // 2. Audit SnapshotHistoryModal
    const funcZoneBtn = page.getByRole('button', { name: /Vùng Chức Năng/i });
    await funcZoneBtn.click();
    await page.waitForTimeout(200);

    const snapshotMenuBtn = page.locator('button').filter({ hasText: /Lịch sử Snapshot/i });
    if (await snapshotMenuBtn.isVisible()) {
      await snapshotMenuBtn.click();
      await page.waitForTimeout(300);

      const snapshotDialog = page.locator('div[aria-label="Lịch sử phiên bản hồ sơ"] div.rounded-2xl').first();
      if (await snapshotDialog.isVisible()) {
        const snapshotBg = await snapshotDialog.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        console.log(`[AUDIT] SnapshotHistoryModal background: ${snapshotBg}`);
        expect(snapshotBg).toBe('rgb(255, 255, 255)');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }
  });

  // =========================================================================
  // B. LANDING PAGE AUDIT (`/`) IN LIGHT MODE
  // =========================================================================
  test('B: audits Landing Page in Light Mode and Bento Grid cards', async ({ page, context }) => {
    // Clear cookies so we see the unauthenticated landing view
    await context.clearCookies();

    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(300);

    // Capture Landing Page Light screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'landing-light.png'),
      fullPage: true,
    });

    // Check JobWinningBento target link container in JobWinningBento.tsx line 112:
    const bentoLinkBox = page.locator('div.border-white\\/10.bg-black\\/40, [data-testid="bento-target-link"]').first();
    if (await bentoLinkBox.isVisible()) {
      const linkBoxBg = await bentoLinkBox.evaluate((el) => {
        const parent = el.closest('div.bg-black\\/40') || el;
        return window.getComputedStyle(parent).backgroundColor;
      });
      console.log(`[AUDIT] Landing Bento Target Link Box bg: ${linkBoxBg}`);

      if (linkBoxBg.includes('oklab(0 0 0') || linkBoxBg.includes('rgba(0, 0, 0')) {
        auditFindings.push({
          category: 'Landing Page JobWinningBento',
          element: 'div.bg-black/40 (JobWinningBento.tsx:112)',
          property: 'background-color',
          actualValue: linkBoxBg,
          expectedValue: 'rgb(241, 245, 249) (bg-slate-100) on light theme',
          defectSeverity: 'HIGH',
          description: 'Bento Grid vanity URL box retains hardcoded bg-black/40 and border-white/10 inside light card.',
        });
      }
    }
  });

  // =========================================================================
  // C. AUTHENTICATION PAGES AUDIT (`/login` & `/register`) IN LIGHT MODE
  // =========================================================================
  test('C1: audits /login page in Light Mode and StageGate layout', async ({ page, context }) => {
    // Crucial: clear token cookies to prevent middleware redirect to /dashboard
    await context.clearCookies();

    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(400);

    // Capture Login screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'login-light.png'),
      fullPage: true,
    });

    // Verify login title exists
    await expect(page.locator('h1').first()).toBeVisible();

    // Check Right Pane in StageGateAuthLayout.tsx line 177:
    const rightPane = page.locator('div.min-h-\\[460px\\]').first();
    if (await rightPane.isVisible()) {
      const rightPaneBg = await rightPane.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      console.log(`[AUDIT] Login Right Pane LiveCompilingStage bg: ${rightPaneBg}`);

      if (rightPaneBg === 'rgb(6, 10, 14)') {
        auditFindings.push({
          category: 'Authentication StageGate Layout',
          element: 'div.bg-[#060a0e] (StageGateAuthLayout.tsx:177)',
          property: 'background-color',
          actualValue: rightPaneBg,
          expectedValue: 'rgb(241, 245, 249) (light blueprint grid) in light mode',
          defectSeverity: 'MEDIUM',
          description: 'LiveCompilingStage right pane is hardcoded dark bg-[#060a0e] across both themes.',
        });
      }
    }
  });

  test('C2: audits /register page in Light Mode', async ({ page, context }) => {
    // Clear cookies to prevent middleware redirect to /dashboard
    await context.clearCookies();

    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soodfolio-theme', 'light');
    });
    await page.waitForTimeout(400);

    // Capture Register screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'register-light.png'),
      fullPage: true,
    });

    const registerTitle = page.locator('h1').first();
    await expect(registerTitle).toBeVisible();
  });

  // =========================================================================
  // D. PUBLIC DECK AUDIT (`/[username]` & `/preview/[username]`)
  // =========================================================================
  test('D: audits Public Preview Deck with themeMode LIGHT', async ({ page, context }) => {
    await context.clearCookies();

    await page.addInitScript(() => {
      localStorage.setItem('soodfolio-theme', 'light');
    });

    // Use live public profile 'soodthin' which exists on backend
    await page.goto('/preview/soodthin');
    await page.waitForLoadState('networkidle');

    // Check if main deck container renders
    const deckMain = page.locator('main[data-theme-preset]');
    await expect(deckMain).toBeVisible({ timeout: 10000 });

    const mainBg = await deckMain.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log(`[AUDIT] Public Deck preview main background: ${mainBg}`);

    // Capture Public Deck screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'public-deck-light.png'),
      fullPage: true,
    });

    // Check if themeMode sync works or if dark class is forced
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark) {
      auditFindings.push({
        category: 'Public Deck Presentation',
        element: 'VerticalStackDeck.tsx (line 297-303)',
        property: 'themeMode synchronization',
        actualValue: 'Defaults to dark regardless of author theme preference',
        expectedValue: 'Respects light theme and does not force dark mode',
        defectSeverity: 'HIGH',
        description: 'VerticalStackDeck initializes dark class if localStorage has no prior override.',
      });
    }
  });

  test.afterAll(() => {
    const reportPath = path.join(process.cwd(), 'e2e', 'light-mode-audit-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditFindings, null, 2), 'utf-8');
    console.log(`[AUDIT COMPLETED] ${auditFindings.length} defect findings recorded into ${reportPath}`);
  });
});

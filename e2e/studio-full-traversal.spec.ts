import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const MOCK_PORTFOLIO = {
  id: 'port_1',
  username: 'soodthin',
  fullName: 'Thai Do Thinh',
  title: 'THAI DO THINH',
  tagline: 'SOFTWARE ENGINEER · FULL-STACK DEVELOPER',
  bio: 'Final-year Computer Science student...',
  statusText: 'AVAILABLE FOR DEVELOPER ROLES · READY TO DEPLOY',
  themeMode: 'DARK',
  themeConfig: 'classic-deck',
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  projects: [
    {
      id: 'p1',
      title: 'SoodFolio Studio',
      subtitle: 'Keynote IDE',
      role: 'Full-stack',
      periodText: '2026',
      description: 'Next.js App',
      techStack: ['Next.js', 'Spring Boot'],
    },
  ],
  experiences: [
    {
      id: 'e1',
      companyName: 'BW Industrial',
      roleTitle: 'Software Engineer',
      periodText: '2025-2026',
      location: 'HCM',
      highlights: ['Led development'],
    },
  ],
  skills: [
    { id: 's1', name: 'TypeScript', category: 'LANGUAGES' },
    { id: 's2', name: 'Next.js', category: 'FRAMEWORKS' },
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/soodthin', label: 'soodthin' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/thinhthai', label: 'thinhthai' },
  ],
};

test.describe('SoodFolio Studio Full Traversal E2E Test Suite', () => {
  // Global error & log collection arrays
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  const failedRequests: string[] = [];

  test.beforeAll(() => {
    // Ensure screenshot directory exists
    const screenshotsDir = path.join(process.cwd(), 'e2e', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    const logFile = path.join(process.cwd(), 'e2e', 'traversal-diagnostics.jsonl');
    if (fs.existsSync(logFile)) {
      try {
        fs.unlinkSync(logFile);
      } catch {
        // ignore
      }
    }
  });

  test.beforeEach(async ({ page, context }) => {
    // Reset collection arrays
    pageErrors.length = 0;
    consoleErrors.length = 0;
    consoleWarnings.length = 0;
    failedRequests.length = 0;

    // Attach listeners for automated error & log collection
    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
      if (msg.type() === 'warning') consoleWarnings.push(msg.text());
    });
    page.on('requestfailed', (req) =>
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`)
    );

    // Grant clipboard permissions for copy operations
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {
      // Ignore if not supported in current environment
    }

    // Stub clipboard API to prevent permission / focus errors in headless mode
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

    // Set authenticated cookies
    await context.addCookies([
      {
        name: 'soodfolio_token',
        value: 'mock-valid-e2e-studio-token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'soodfolio_refresh_token',
        value: 'mock-valid-e2e-studio-refresh-token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'soodfolio_user',
        value: JSON.stringify({
          id: 'usr_studio_1',
          email: 'soodthin@example.com',
          fullName: 'Thái Đỗ Thịnh',
          username: 'soodthin',
          role: 'USER',
        }),
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Mock API Routes
    await page.route('**/api/v1/portfolios/me', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PORTFOLIO),
        });
      } else if (route.request().method() === 'PUT') {
        const postData = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...MOCK_PORTFOLIO, ...postData }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/v1/portfolios/me/publish', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'LIVE' }),
      });
    });

    await page.route('**/api/v1/portfolios/me/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isPublished: true }),
      });
    });

    await page.route('**/api/v1/portfolios/me/snapshots', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/portfolios/me/telemetry/shares', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/ai/suggest-theme', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendedTemplateId: 'spotlight',
          reason: 'Focus on high impact',
        }),
      });
    });

    await page.route('**/api/v1/portfolios/me/projects/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  });

  test.afterEach(async () => {
    // Persist diagnostic logs for test reporting
    const runLog = {
      testName: test.info().title,
      pageErrors: pageErrors.map((e) => e.message || String(e)),
      consoleErrors: [...consoleErrors],
      consoleWarnings: [...consoleWarnings],
      failedRequests: [...failedRequests],
    };
    fs.appendFileSync(
      path.join(process.cwd(), 'e2e', 'traversal-diagnostics.jsonl'),
      JSON.stringify(runLog) + '\n'
    );
  });

  // =========================================================================
  // TEST SUITE 1: Thanh Topbar (StudioHeader)
  // =========================================================================
  test('Suite 1: StudioHeader - slug copy, theme presets, publish & function menu dropdown', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 1. Thao tác Slug: Click nút copy cạnh slug soodfolio.com/soodthin
    const slugCopyBtn = page.getByRole('button', { name: /Sao chép link chia sẻ soodfolio\.com\/soodthin/i });
    await expect(slugCopyBtn).toBeVisible();
    await slugCopyBtn.click();
    await expect(page.locator('text=Đã sao chép liên kết').first()).toBeVisible({ timeout: 5000 });

    // 2. Bộ Theme Switcher: Click 4 pill Classic, Spotlight, Terminal, Editorial
    const stageContainer = page.locator('[data-theme-preset]');
    await expect(stageContainer).toBeVisible();

    // Spotlight
    const spotlightPill = page.getByRole('button', { name: 'Theme Spotlight' });
    await spotlightPill.click();
    await expect(page.locator('[data-theme-preset="spotlight-focus"]')).toBeVisible();

    // Terminal
    const terminalPill = page.getByRole('button', { name: 'Theme Terminal' });
    await terminalPill.click();
    await expect(page.locator('[data-theme-preset="terminal-matrix"]')).toBeVisible();

    // Editorial
    const editorialPill = page.getByRole('button', { name: 'Theme Editorial' });
    await editorialPill.click();
    await expect(page.locator('[data-theme-preset="editorial-clean"]')).toBeVisible();

    // Classic
    const classicPill = page.getByRole('button', { name: 'Theme Classic' });
    await classicPill.click();
    await expect(page.locator('[data-theme-preset="classic-deck"]')).toBeVisible();

    // 3. Nút "Phát Hành" (Publish)
    const publishBtn = page.getByRole('button', { name: 'Phát Hành' });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();
    await expect(page.locator('text=Đã phát hành slide deck công khai thành công!')).toBeVisible({ timeout: 5000 });

    // 4. Menu "Vùng Chức Năng" (Dropdown)
    const funcMenuBtn = page.getByRole('button', { name: /Vùng Chức Năng/i });
    await funcMenuBtn.click();

    const dropdown = page.locator('header .absolute.right-0');

    // 4.1 Sao chép liên kết
    const copyLinkItem = dropdown.getByRole('button', { name: /Sao chép liên kết/i });
    await expect(copyLinkItem).toBeVisible();
    await copyLinkItem.click();
    await expect(page.locator('text=Đã sao chép liên kết').first()).toBeVisible();

    // 4.2 Lịch sử Snapshot
    await funcMenuBtn.click();
    const snapshotItem = dropdown.getByRole('button', { name: /Lịch sử Snapshot/i });
    await expect(snapshotItem).toBeVisible();
    await snapshotItem.click();

    // Modal Snapshot opens
    const snapshotModal = page.getByRole('dialog', { name: /Lịch sử phiên bản hồ sơ/i });
    await expect(snapshotModal).toBeVisible();
    await expect(page.getByText('Lịch Sử Phiên Bản & Immutable Snapshots')).toBeVisible();

    // Close Snapshot Modal via close button
    const closeSnapshotBtn = snapshotModal.locator('button').first();
    await closeSnapshotBtn.click();
    await expect(snapshotModal).not.toBeVisible();

    // 4.3 Toggle Theme (Tối / Sáng)
    if (!(await dropdown.isVisible())) await funcMenuBtn.click();
    const themeToggleItem = dropdown.getByRole('button', { name: /Giao diện/i });
    await expect(themeToggleItem).toBeVisible();
    await themeToggleItem.click();

    // 4.4 Toggle Ngôn ngữ Studio
    if (!(await dropdown.isVisible())) await funcMenuBtn.click();
    const langToggleItem = dropdown.getByRole('button', { name: /Ngôn ngữ Studio/i });
    await expect(langToggleItem).toBeVisible();
    await langToggleItem.click();

    // 4.5 Escape key closes dropdown
    if (!(await dropdown.isVisible())) await funcMenuBtn.click();
    await expect(dropdown.getByRole('button', { name: /Sao chép liên kết/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dropdown.getByRole('button', { name: /Sao chép liên kết/i })).not.toBeVisible();
  });

  // =========================================================================
  // TEST SUITE 2: Dock Điều Khiển Dưới Sân Khấu (StageToolbar)
  // =========================================================================
  test('Suite 2: StageToolbar - viewports, zoom, slide navigation arrows & fullscreen', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 1. Viewport Switchers
    const desktopBtn = page.locator('button[title*="16:9 Desktop"]');
    const tabletBtn = page.locator('button[title*="Tablet"]');
    const mobileBtn = page.locator('button[title*="Mobile"]');

    // Tablet mode
    await tabletBtn.click();
    const tabletStage = page.locator('[data-theme-preset]');
    await expect(tabletStage).toHaveClass(/aspect-\[4\/3\]/);

    // Mobile mode
    await mobileBtn.click();
    const mobileStage = page.locator('[data-theme-preset]');
    await expect(mobileStage).toHaveClass(/aspect-\[9\/16\]/);

    // Desktop mode
    await desktopBtn.click();
    const desktopStage = page.locator('[data-theme-preset]');
    await expect(desktopStage).toHaveClass(/aspect-\[16\/9\]/);

    // 2. Zoom selector
    const zoomSelect = page.locator('select').first();
    await zoomSelect.selectOption('75%');
    await expect(zoomSelect).toHaveValue('75%');

    await zoomSelect.selectOption('125%');
    await expect(zoomSelect).toHaveValue('125%');

    await zoomSelect.selectOption('100%');
    await expect(zoomSelect).toHaveValue('100%');

    await zoomSelect.selectOption('fit');
    await expect(zoomSelect).toHaveValue('fit');

    // 3. Điều hướng slide trên Dock
    const nextSlideBtn = page.getByRole('button', { name: 'Slide kế tiếp' });
    const prevSlideBtn = page.getByRole('button', { name: 'Slide trước' });

    // Click Next -> Slide 02
    await nextSlideBtn.click();
    await expect(page.locator('text=SLIDE 02 · 05')).toBeVisible();

    // Click Prev -> Slide 01
    await prevSlideBtn.click();
    await expect(page.locator('text=SLIDE 01 · 05')).toBeVisible();

    // 4. Fullscreen
    const fullscreenBtn = page.getByRole('button', { name: 'Chuyển đổi chế độ toàn màn hình' });
    await fullscreenBtn.click();
    await fullscreenBtn.click();
  });

  // =========================================================================
  // TEST SUITE 3: Storyboard Spine Cột Trái (SlideRail)
  // =========================================================================
  test('Suite 3: SlideRail - traverse 5 slides & verify inspector titles and completion meter', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await expect(slideRail).toBeVisible();

    const inspector = page.locator('aside').filter({ hasText: 'Thuộc tính Slide' });
    await expect(inspector).toBeVisible();

    // Slide 01: Identity
    await slideRail.getByText('Identity', { exact: false }).first().click();
    await expect(inspector.getByText('Slide 01 · Identity & Cover')).toBeVisible();

    // Slide 02: Case Studies
    await slideRail.getByText('Case Studies', { exact: false }).first().click();
    await expect(inspector.getByText('Slide 02 · Case Studies')).toBeVisible();
    await expect(inspector.getByText(/Dự án Tiêu biểu/i)).toBeVisible();

    // Slide 03: Impact Timeline
    await slideRail.getByText('Impact Timeline', { exact: false }).first().click();
    await expect(inspector.getByText('Slide 03 · Impact Timeline')).toBeVisible();
    await expect(inspector.getByText(/Kinh nghiệm Kỹ thuật/i)).toBeVisible();

    // Slide 04: System Matrix
    await slideRail.getByText('System Matrix', { exact: false }).first().click();
    await expect(inspector.getByText('Slide 04 · System Matrix')).toBeVisible();

    // Slide 05: Contact & Connect
    await slideRail.getByText('Contact & Connect', { exact: false }).first().click();
    await expect(inspector.getByText(/05 Contact & Connect/i)).toBeVisible();

    // Verify Completion Meter in SlideRail
    await expect(slideRail.getByText('Độ hoàn thiện')).toBeVisible();
    await expect(slideRail.locator('text=%').first()).toBeVisible();
  });

  // =========================================================================
  // TEST SUITE 4: Form & Tương tác Cột Phải (Inspector Panel) & Screenshots
  // =========================================================================
  test('Suite 4: Inspector Panel - WYSIWYG form sync, social links & capture screenshots', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 1. Trở về Slide 01
    const slideRail = page.locator('aside[aria-label="Slide Deck Rail"]');
    await slideRail.getByText('Identity', { exact: false }).first().click();

    // 1.1 Điền text Họ và tên -> kiểm tra stage h1 cập nhật
    const fullNameInput = page.locator('#field-fullName');
    await fullNameInput.fill('Thai Do Thinh Lead Engineer');
    const stageHeading = page.locator('[data-theme-preset] h1');
    await expect(stageHeading).toHaveText('Thai Do Thinh Lead Engineer');

    // 1.2 Điền Tiêu đề Slide Deck
    const titleInput = page.locator('#field-title');
    await titleInput.fill('PRINCIPAL ARCHITECT');
    await expect(titleInput).toHaveValue('PRINCIPAL ARCHITECT');

    // 1.3 Điền Định vị chuyên môn (Tagline) -> kiểm tra stage tagline
    const taglineInput = page.locator('#field-tagline');
    await taglineInput.fill('DISTRIBUTED SYSTEMS SPECIALIST');
    const stageTagline = page.locator('[data-theme-preset] p').filter({ hasText: 'DISTRIBUTED SYSTEMS SPECIALIST' });
    await expect(stageTagline).toBeVisible();

    // 1.4 Điền Tuyên ngôn (Bio) -> kiểm tra stage bio
    const bioInput = page.locator('#field-bio');
    await bioInput.fill('Tập trung xây dựng hệ thống phân tán quy mô lớn với độ trễ thấp và độ tin cậy 99.99%.');
    const stageBio = page.locator('[data-theme-preset] p').filter({ hasText: 'Tập trung xây dựng hệ thống phân tán' });
    await expect(stageBio).toBeVisible();

    // 2. Kênh liên kết (Social Links)
    const socialInput = page.locator('input[placeholder*="github.com/username"]');
    await socialInput.fill('https://github.com/soodthin/test');

    const addSocialBtn = page.locator('button:has(svg.lucide-plus)').last();
    await addSocialBtn.click();

    // Verify new social link is added
    await expect(page.locator('text=@test').first()).toBeVisible();

    // Xóa liên kết vừa thêm bằng nút thùng rác
    const trashButtons = page.locator('button[title="Xoá liên kết"]');
    const initialTrashCount = await trashButtons.count();
    if (initialTrashCount > 0) {
      await trashButtons.last().click();
      await expect(trashButtons).toHaveCount(initialTrashCount - 1);
    }

    // =========================================================================
    // Capture 3 Screenshots
    // =========================================================================
    const desktopBtn = page.locator('button[title*="16:9 Desktop"]');
    const tabletBtn = page.locator('button[title*="Tablet"]');
    const mobileBtn = page.locator('button[title*="Mobile"]');

    // Screenshot 1: Classic preset, 16:9 desktop
    const classicPill = page.getByRole('button', { name: 'Theme Classic' });
    await classicPill.click();
    await desktopBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), 'e2e', 'screenshots', 'studio-classic-16-9.png'),
      fullPage: true,
    });

    // Screenshot 2: Spotlight preset, tablet
    const spotlightPill = page.getByRole('button', { name: 'Theme Spotlight' });
    await spotlightPill.click();
    await tabletBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), 'e2e', 'screenshots', 'studio-spotlight-tablet.png'),
      fullPage: true,
    });

    // Screenshot 3: Terminal preset, mobile
    const terminalPill = page.getByRole('button', { name: 'Theme Terminal' });
    await terminalPill.click();
    await mobileBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), 'e2e', 'screenshots', 'studio-terminal-mobile.png'),
      fullPage: true,
    });
  });
});

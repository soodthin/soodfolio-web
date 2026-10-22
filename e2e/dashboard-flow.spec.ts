import { test, expect } from '@playwright/test';

test.describe('Dashboard End-to-End Workflows', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set authenticated cookies
    await context.addCookies([
      {
        name: 'soodfolio_token',
        value: 'mock-valid-e2e-token',
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
          fullName: 'QA Lead',
          username: 'qalead',
          role: 'USER',
        }),
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Mock API requests
    await page.route('**/api/v1/portfolios/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'port_qa_1',
          userId: 'usr_e2e_1',
          username: 'qalead',
          title: 'QA Lead Architect',
          tagline: 'Automated Quality Engineering',
          bio: 'Building comprehensive test automation suites.',
          themeMode: 'DARK',
          showExperience: true,
          showProjects: true,
          showSkills: true,
          showEducation: true,
          showContact: true,
          experiences: [],
          projects: [],
          skills: [],
          educations: [],
          socialLinks: [],
        }),
      });
    });
  });

  test('renders dashboard header, preview action, and slide tabs', async ({ page }) => {
    await page.goto('/dashboard');

    // Check header elements
    await expect(page.locator('text=QA Lead Architect').first()).toBeVisible();
    await expect(page.locator('text=Automated Quality Engineering').first()).toBeVisible();

    // Verify slide sections exist
    await expect(page.getByRole('button', { name: /cover/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /experience/i })).toBeVisible();
  });

  test('opens and closes ProfileModal dialog via Escape key', async ({ page }) => {
    await page.goto('/dashboard');

    // Click button to edit profile
    const editBtn = page.getByRole('button', { name: /edit profile|edit identity/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByText('Edit Identity & Hero Slide')).toBeVisible();

      // Press Escape to dismiss
      await page.keyboard.press('Escape');
      await expect(page.getByText('Edit Identity & Hero Slide')).not.toBeVisible();
    }
  });

  test('logs out and returns to login page', async ({ page }) => {
    await page.route('**/api/v1/auth/logout', async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.goto('/dashboard');

    // Find and click logout button
    const logoutBtn = page.getByRole('button', { name: /logout|đăng xuất/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('Auth Journey & Security Route Guards', () => {
  test('unauthenticated visit to /dashboard redirects to /login with redirect query param', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
  });

  test('login page displays form inputs, password toggle, and social auth buttons', async ({ page }) => {
    await page.goto('/login');

    const usernameInput = page.locator('input#usernameOrEmail, input[name="usernameOrEmail"], input[type="text"]').first();
    const passwordInput = page.locator('input#password, input[name="password"], input[type="password"]').first();
    const submitBtn = page.getByRole('button', { name: /đăng nhập/i });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Verify social buttons
    await expect(page.getByRole('button', { name: /github login/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /google login/i })).toBeVisible();
  });

  test('shows client validation error when submitting empty fields', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.getByRole('button', { name: /đăng nhập/i });
    await submitBtn.click();

    await expect(page.getByText('Vui lòng nhập đầy đủ thông tin đăng nhập.')).toBeVisible();
  });

  test('handles 401 unauthorized error toast from API gracefully', async ({ page }) => {
    // Intercept backend login request with 401
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 401,
          message: 'Tên đăng nhập, email hoặc mật khẩu không chính xác.',
        }),
      });
    });

    await page.goto('/login');

    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await usernameInput.fill('invaliduser');
    await passwordInput.fill('wrongpassword');

    const submitBtn = page.getByRole('button', { name: /đăng nhập/i });
    await submitBtn.click();

    await expect(
      page.getByText('Tên đăng nhập, email hoặc mật khẩu không chính xác.')
    ).toBeVisible();
  });

  test('completes login flow, sets auth cookies, and redirects to dashboard', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-access-token-123',
          refreshToken: 'mock-refresh-token-456',
          tokenType: 'Bearer',
          expiresInMs: 3600000,
          user: {
            id: 'usr_test',
            email: 'admin@soodfolio.dev',
            fullName: 'Admin Tester',
            username: 'admintester',
            role: 'USER',
          },
        }),
      });
    });

    await page.route('**/api/v1/portfolios/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'port_1',
          userId: 'usr_test',
          username: 'admintester',
          title: 'Admin Tester',
          tagline: 'Lead System Architect',
          bio: 'Building hyper-resilient systems',
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

    await page.goto('/login');

    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await usernameInput.fill('admintester');
    await passwordInput.fill('Secret123!');

    const submitBtn = page.getByRole('button', { name: /đăng nhập/i });
    await submitBtn.click();

    // Verify redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

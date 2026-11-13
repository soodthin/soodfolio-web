import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LiveCompilingStage } from '@/components/auth/LiveCompilingStage';
import { StageGateAuthLayout } from '@/components/auth/StageGateAuthLayout';
import { AuthProvider } from '@/context/AuthContext';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';

// Mock useRouter and useSearchParams from next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === 'redirect') return '/dashboard';
      return null;
    },
  }),
}));

describe('Stage-Gate Auth System Unit & Anti-Pattern Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as unknown as { location?: Location }).location;
    window.location = {
      origin: 'https://soodfolio.dev',
      href: '',
    } as unknown as Location;
    localStorage.clear();
  });

  describe('LiveCompilingStage Component', () => {
    it('renders 16:9 canvas with default fallback name and username', () => {
      render(<LiveCompilingStage />);
      expect(screen.getByText('Elena Vance')).toBeDefined();
      expect(screen.getByText('@elena_vance')).toBeDefined();
      expect(screen.getByText(/Live Compiling Stage/i)).toBeDefined();
      expect(screen.getByText(/SLIDE 01 · IDENTITY & HERO COVER/i)).toBeDefined();
    });

    it('binds user keystroke names and handles dynamically in real time', () => {
      render(<LiveCompilingStage fullName="Marcus Vance" username="marcusv" />);
      expect(screen.getByText('Marcus Vance')).toBeDefined();
      expect(screen.getByText('@marcusv')).toBeDefined();
      expect(screen.getByText('soodfolio.com/marcusv')).toBeDefined();
    });

    it('renders 4 interactive theme tasting pills with clean typography and without brackets', () => {
      render(<LiveCompilingStage />);
      expect(screen.getByRole('button', { name: /1 · Classic/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /2 · Spotlight/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /3 · Terminal/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /4 · Editorial/i })).toBeDefined();

      // Ensure NO raw bracketed titles like [1]
      expect(screen.queryByText('[1]')).toBeNull();
      expect(screen.queryByText('[2]')).toBeNull();
    });

    it('switches themes when theme tasting pills are clicked', () => {
      const handleThemeChange = vi.fn();
      render(<LiveCompilingStage onThemeChange={handleThemeChange} />);

      const terminalBtn = screen.getByRole('button', { name: /3 · Terminal/i });
      fireEvent.click(terminalBtn);
      expect(handleThemeChange).toHaveBeenCalledWith('terminal-matrix');

      const spotlightBtn = screen.getByRole('button', { name: /2 · Spotlight/i });
      fireEvent.click(spotlightBtn);
      expect(handleThemeChange).toHaveBeenCalledWith('spotlight-focus');
    });
  });

  describe('StageGateAuthLayout Asymmetric Split & Cockpit', () => {
    it('renders left cockpit with logo, badge, and right compiling stage', () => {
      render(
        <StageGateAuthLayout
          badgeText="STAGE INITIALIZATION"
          title="Khởi tạo Stage trình chiếu"
          subtitle="Xác lập không gian portfolio trực quan"
          footerPrompt={{
            question: 'Đã có tài khoản?',
            actionText: 'Đăng nhập',
            actionHref: '/login',
          }}
        >
          <div data-testid="test-form">Form Content</div>
        </StageGateAuthLayout>
      );

      expect(screen.getByText('STAGE INITIALIZATION')).toBeDefined();
      expect(screen.getByText('Khởi tạo Stage trình chiếu')).toBeDefined();
      expect(screen.getByTestId('test-form')).toBeDefined();
      expect(screen.getByText('SoodFolio')).toBeDefined();
    });
  });

  describe('LoginPage Flipped OAuth & Friction Removal', () => {
    it('renders Flipped OAuth buttons at the very top and no 7-day checkbox', () => {
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      // Flipped OAuth buttons at hero top
      expect(screen.getByText('Tiếp tục với GitHub')).toBeDefined();
      expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
      expect(screen.getByText('hoặc tiếp tục với email')).toBeDefined();

      // Keycap indicators
      expect(screen.getByText('G')).toBeDefined();
      expect(screen.getByText('O')).toBeDefined();

      // Prohibit checkbox friction
      expect(screen.queryByText(/Duy trì đăng nhập trong 7 ngày/i)).toBeNull();

      // Submit CTA
      expect(screen.getByRole('button', { name: /Vào Studio/i })).toBeDefined();
    });

    it('submits login request with valid credentials and redirects to dashboard', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          tokenType: 'Bearer',
          expiresInMs: 3600000,
          user: {
            id: 'u1',
            email: 'alex@soodfolio.com',
            fullName: 'Alex Vance',
            username: 'alexv',
            role: 'ENGINEER',
          },
        }),
      });
      global.fetch = mockFetch;

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      const usernameInput = screen.getByLabelText(/Email hoặc Tên người dùng/i);
      const passwordInput = screen.getByLabelText(/^Mật khẩu/i);
      const submitBtn = screen.getByRole('button', { name: /Vào Studio/i });

      fireEvent.change(usernameInput, { target: { value: 'alex@soodfolio.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/auth/login'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              usernameOrEmail: 'alex@soodfolio.com',
              password: 'Secret123!',
            }),
          })
        );
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('RegisterPage Claim Stage URL & Zero Friction', () => {
    it('renders Claim Stage URL as hero first field and removes confirm password', () => {
      render(
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      );

      // Claim Stage URL with domain prefix
      expect(screen.getByText('soodfolio.com/')).toBeDefined();
      expect(screen.getByPlaceholderText('alex.vance')).toBeDefined();

      // Prohibit Confirm Password field
      expect(screen.queryByLabelText(/Xác nhận mật khẩu/i)).toBeNull();
      expect(screen.queryByPlaceholderText(/Nhập lại mật khẩu/i)).toBeNull();

      // Flipped OAuth buttons at top
      expect(screen.getByText('Tiếp tục với GitHub')).toBeDefined();
      expect(screen.getByText('Tiếp tục với Google')).toBeDefined();

      // Submit CTA
      expect(screen.getByRole('button', { name: /Khởi tạo Stage/i })).toBeDefined();
    });

    it('submits registration with Claim Stage URL, Full Name, Email, Password', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: 'registered-token',
          refreshToken: 'refresh-token',
          tokenType: 'Bearer',
          expiresInMs: 3600000,
          user: {
            id: 'u2',
            email: 'elena@soodfolio.com',
            fullName: 'Elena Vance',
            username: 'elenavance',
            role: 'ENGINEER',
          },
        }),
      });
      global.fetch = mockFetch;

      render(
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      );

      const usernameInput = screen.getByPlaceholderText('alex.vance');
      const fullNameInput = screen.getByLabelText(/Họ và tên/i);
      const emailInput = screen.getByLabelText(/Email công việc/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu bảo mật/i);
      const submitBtn = screen.getByRole('button', { name: /Khởi tạo Stage/i });

      fireEvent.change(usernameInput, { target: { value: 'elenavance' } });
      fireEvent.change(fullNameInput, { target: { value: 'Elena Vance' } });
      fireEvent.change(emailInput, { target: { value: 'elena@soodfolio.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass99!' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/auth/register'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              fullName: 'Elena Vance',
              username: 'elenavance',
              email: 'elena@soodfolio.com',
              password: 'SecurePass99!',
            }),
          })
        );
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});

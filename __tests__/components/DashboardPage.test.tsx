import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import * as apiClient from '@/lib/apiClient';
import * as authContext from '@/context/AuthContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('DashboardPage Defensive Offline Resilience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 'u1', username: 'testdev', fullName: 'Test Developer', role: 'USER' },
      token: 'mock-token',
      refreshSession: vi.fn(),
      login: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
    });
  });

  it('renders gracefully in offline preview mode when backend returns 503 or network error', async () => {
    // Simulate backend connection refused (synthetic 503 from fetchWithAuth)
    vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 503,
          error: 'NETWORK_ERROR',
          message: 'Không thể kết nối đến máy chủ Backend',
        }),
        { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(<DashboardPage />);

    // Should not crash, and should display offline studio notice and fallback identity
    await waitFor(() => {
      expect(screen.getByText(/Chế độ Studio Ngoại tuyến/i)).toBeDefined();
    });

    expect(screen.getAllByText(/Test Developer/i).length).toBeGreaterThan(0);
  });
});

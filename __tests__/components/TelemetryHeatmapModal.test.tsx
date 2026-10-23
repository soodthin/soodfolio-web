import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TelemetryHeatmapModal } from '@/components/dashboard/TelemetryHeatmapModal';
import * as apiClient from '@/lib/apiClient';
import { ShareLinkDto } from '@/types/shareLink';

vi.mock('@/lib/apiClient', () => ({
  fetchWithAuth: vi.fn(),
}));

const mockLink: ShareLinkDto = {
  id: 'test-link-1',
  portfolioId: 'p-1',
  companyName: 'Shopee Singapore',
  customLayout: 'CINEMATIC_DECK',
  viewCount: 15,
  isRevoked: false,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('TelemetryHeatmapModal Robustness & Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing when API returns data without slideHeatmap (undefined slideHeatmap)', async () => {
    // Simulate backend response missing slideHeatmap field entirely
    (apiClient.fetchWithAuth as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        linkId: 'test-link-1',
        companyName: 'Shopee Singapore',
        totalViews: 42,
        totalDwellSeconds: 210,
        completionRate: 90,
        // slideHeatmap is deliberately missing / undefined
      }),
    });

    const onClose = vi.fn();
    render(<TelemetryHeatmapModal isOpen={true} onClose={onClose} link={mockLink} />);

    // Should not throw TypeError and should render fallback metrics
    await waitFor(() => {
      expect(screen.getByText('Shopee Singapore')).toBeDefined();
      expect(screen.getByText(/Telemetry Radar & Biểu Đồ Nhiệt/i)).toBeDefined();
    });

    // Verify fallback slide is rendered
    expect(screen.getByText(/Slide 01: Giới thiệu & Bìa/i)).toBeDefined();
    expect(screen.getAllByText(/Slide 02: Dự án tiêu biểu/i).length).toBeGreaterThan(0);
  });

  it('renders correctly on network error with fallback simulation', async () => {
    (apiClient.fetchWithAuth as any).mockRejectedValue(new Error('Network failure'));

    const onClose = vi.fn();
    render(<TelemetryHeatmapModal isOpen={true} onClose={onClose} link={mockLink} />);

    await waitFor(() => {
      expect(screen.getByText(/Phân Bổ Thời Gian Theo Slide/i)).toBeDefined();
    });

    // Check modal close button
    const closeBtn = screen.getByRole('button', { name: /Đóng/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

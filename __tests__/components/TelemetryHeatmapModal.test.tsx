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

  it('renders correctly with real slideStats and deviceBreakdown', async () => {
    // Real backend TelemetryAnalyticsResponse format
    vi.mocked(apiClient.fetchWithAuth).mockResolvedValue({
      ok: true,
      json: async () => ({
        shareLinkId: 'test-link-1',
        companyName: 'Shopee Singapore',
        totalViews: 42,
        totalDwellSeconds: 200,
        slideStats: [
          { slideKey: 'hero', totalDwellSeconds: 40, viewCount: 42, avgDwellSeconds: 0.95 },
          { slideKey: 'projects', totalDwellSeconds: 100, viewCount: 40, avgDwellSeconds: 2.5 },
          { slideKey: 'experience', totalDwellSeconds: 60, viewCount: 38, avgDwellSeconds: 1.57 },
        ],
        deviceBreakdown: {
          DESKTOP: 35,
          TABLET: 5,
          MOBILE: 2,
        },
      }),
    } as unknown as Response);

    const onClose = vi.fn();
    render(<TelemetryHeatmapModal isOpen={true} onClose={onClose} link={mockLink} />);

    await waitFor(() => {
      expect(screen.getByText('Shopee Singapore')).toBeDefined();
      expect(screen.getByText(/Telemetry Radar & Biểu Đồ Nhiệt/i)).toBeDefined();
    });

    // Verify Vietnamese mapped slide labels
    expect(screen.getByText('Giới thiệu & Bìa')).toBeDefined();
    expect(screen.getAllByText('Dự án tiêu biểu & Case Studies').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Hành trình sự nghiệp')).toBeDefined();

    // Verify calculated % and dwell times
    expect(screen.getByText('100s')).toBeDefined();
    expect(screen.getByText('(50%)')).toBeDefined();
    expect(screen.getAllByText('HOT').length).toBeGreaterThanOrEqual(1);
  });

  it('renders friendly empty-state when slideStats is empty instead of fake mock data', async () => {
    vi.mocked(apiClient.fetchWithAuth).mockResolvedValue({
      ok: true,
      json: async () => ({
        shareLinkId: 'test-link-1',
        companyName: 'Shopee Singapore',
        totalViews: 0,
        totalDwellSeconds: 0,
        slideStats: [],
        deviceBreakdown: {},
      }),
    } as unknown as Response);

    const onClose = vi.fn();
    render(<TelemetryHeatmapModal isOpen={true} onClose={onClose} link={mockLink} />);

    await waitFor(() => {
      expect(screen.getByText(/Chưa có dữ liệu dwell-time/i)).toBeDefined();
      expect(screen.getByText(/Liên kết này chưa ghi nhận thời gian đọc slide/i)).toBeDefined();
    });

    // Should NOT show any fake mock slides
    expect(screen.queryByText(/Slide 01: Giới thiệu & Bìa/i)).toBeNull();
  });

  it('renders graceful error message on network failure and closes modal on click', async () => {
    vi.mocked(apiClient.fetchWithAuth).mockRejectedValue(new Error('Network failure'));

    const onClose = vi.fn();
    render(<TelemetryHeatmapModal isOpen={true} onClose={onClose} link={mockLink} />);

    await waitFor(() => {
      expect(screen.getByText(/Không thể kết nối đến máy chủ/i)).toBeDefined();
    });

    // Check modal close button
    const closeBtn = screen.getByRole('button', { name: /Đóng/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
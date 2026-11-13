import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudioHeader } from '@/components/dashboard/studio/StudioHeader';
import { SnapshotHistoryModal } from '@/components/dashboard/studio/SnapshotHistoryModal';
import { ExperienceInspector } from '@/components/dashboard/studio/inspectors/ExperienceInspector';
import { CreateShareLinkModal } from '@/components/dashboard/CreateShareLinkModal';
import { PortfolioData } from '@/types/portfolio';
import * as apiClient from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  fetchWithAuth: vi.fn(),
}));

const mockPortfolio: PortfolioData = {
  id: 'p1',
  username: 'hoangdev',
  fullName: 'Hoàng Nguyễn',
  title: 'Senior Distributed Systems Architect',
  tagline: 'Building High-Throughput Fintech Platforms',
  bio: 'Chuyên gia kiến trúc hệ thống và microservices.',
  statusText: 'Sẵn sàng phỏng vấn',
  avatarUrl: null,
  resumeUrl: null,
  themeMode: 'DARK',
  isPublished: true,
  totalViews: 120,
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  socialLinks: [],
  projects: [
    {
      id: 'proj-1',
      title: 'High-Frequency Matching Engine',
      subtitle: 'Order Book',
      role: 'Lead Architect',
      techStack: ['Java', 'Disruptor'],
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      roleTitle: 'Principal Engineer',
      companyName: 'Fintech Corp',
      periodText: '2023 - Present',
      location: 'TP.HCM',
      highlights: ['Designed sub-millisecond matching engine'],
      skillsUsed: ['Java', 'Kafka'],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Java', category: 'LANGUAGES' },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'Đại học Bách Khoa TP.HCM',
      degree: 'Kỹ sư',
      fieldOfStudy: 'Khoa học Máy tính',
      periodText: '2016 - 2021',
      highlights: 'Thủ khoa đầu ra khoa KH&KT Máy tính',
    },
  ],
};

describe('Sprint 2 Frontend Wiring & Quality Gates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StudioHeader Settings & AI button', () => {
    it('renders "Cài đặt & AI" button and calls onSelectSlide with "settings"', () => {
      const onSelectSlide = vi.fn();
      render(
        <StudioHeader
          portfolio={mockPortfolio}
          user={{ id: 'u1', username: 'hoangdev', fullName: 'Hoàng Nguyễn', email: 'hoang@dev.io', role: 'USER' }}
          theme="dark"
          lang="vi"
          onToggleTheme={vi.fn()}
          onToggleLang={vi.fn()}
          onCopyLink={vi.fn()}
          copiedLink={false}
          onLogout={vi.fn()}
          onSelectSlide={onSelectSlide}
        />
      );

      const settingsBtn = screen.getByRole('button', { name: /Cài đặt & AI/i });
      expect(settingsBtn).toBeDefined();

      fireEvent.click(settingsBtn);
      expect(onSelectSlide).toHaveBeenCalledWith('settings');
    });
  });

  describe('ExperienceInspector 2 Sub-Tabs & Education CRUD', () => {
    it('switches seamlessly between "Kinh nghiệm" and "Học vấn" tabs without emojis or brackets', () => {
      const onAddExp = vi.fn();
      const onUpdateExp = vi.fn();
      const onDeleteExp = vi.fn();
      const onMoveExp = vi.fn();

      render(
        <ExperienceInspector
          experiences={mockPortfolio.experiences}
          educations={mockPortfolio.educations}
          onAddExperience={onAddExp}
          onUpdateExperience={onUpdateExp}
          onDeleteExperience={onDeleteExp}
          onMoveExperience={onMoveExp}
          isSaving={false}
        />
      );

      // Default tab: Kinh nghiệm
      expect(screen.getByText('Principal Engineer')).toBeDefined();
      expect(screen.getByText('@ Fintech Corp')).toBeDefined();

      // Click "Học vấn" tab
      const eduTabBtn = screen.getByRole('button', { name: /Học vấn/i });
      fireEvent.click(eduTabBtn);

      // Now in Education view
      expect(screen.getByText('Đại học Bách Khoa TP.HCM')).toBeDefined();
      expect(screen.getByText(/Kỹ sư/i)).toBeDefined();
      expect(screen.getByText(/Thủ khoa đầu ra/i)).toBeDefined();
    });

    it('opens Education create modal and submits new education entry', async () => {
      // Mock GET when switching to Education tab
      vi.mocked(apiClient.fetchWithAuth).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'edu-1',
            institution: 'Đại học Bách Khoa TP.HCM',
            degree: 'Kỹ sư',
            fieldOfStudy: 'Khoa học Máy tính',
            periodText: '2016 - 2021',
            highlights: 'Thủ khoa đầu ra khoa KH&KT Máy tính',
          },
        ],
      } as unknown as Response);

      // Mock POST when creating new education
      vi.mocked(apiClient.fetchWithAuth).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'edu-2',
          institution: 'Đại học Stanford',
          degree: 'Thạc sĩ',
          fieldOfStudy: 'Trí tuệ Nhân tạo',
          periodText: '2022 - 2024',
          highlights: 'Học bổng toàn phần',
        }),
      } as unknown as Response);

      const onUpdateEducations = vi.fn();

      render(
        <ExperienceInspector
          experiences={mockPortfolio.experiences}
          educations={mockPortfolio.educations}
          onAddExperience={vi.fn()}
          onUpdateExperience={vi.fn()}
          onDeleteExperience={vi.fn()}
          onMoveExperience={vi.fn()}
          onUpdateEducations={onUpdateEducations}
          isSaving={false}
        />
      );

      // Switch to Education tab
      fireEvent.click(screen.getByRole('button', { name: /Học vấn/i }));

      // Click "Thêm" button
      const addBtn = screen.getByRole('button', { name: /Thêm mốc học vấn mới/i });
      fireEvent.click(addBtn);

      // Fill in education fields
      const instInput = screen.getByPlaceholderText('Đại học Bách Khoa TP.HCM');
      fireEvent.change(instInput, { target: { value: 'Đại học Stanford' } });

      const submitBtn = screen.getByRole('button', { name: /Thêm mới/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(apiClient.fetchWithAuth).toHaveBeenCalledWith(
          expect.stringContaining('/portfolios/me/educations'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Đại học Stanford'),
          })
        );
        expect(onUpdateEducations).toHaveBeenCalled();
      });
    });
  });

  describe('SnapshotHistoryModal and Rollback flow', () => {
    it('loads real snapshots from API and performs rollback on confirmation', async () => {
      // Mock GET snapshots
      vi.mocked(apiClient.fetchWithAuth).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'snap-101',
            version: 2,
            changelog: 'Phiên bản bổ sung kiến trúc microservices',
            createdAt: '2026-11-01T10:00:00Z',
          },
          {
            id: 'snap-100',
            version: 1,
            changelog: 'Khởi tạo hồ sơ ban đầu',
            createdAt: '2026-10-20T08:00:00Z',
          },
        ],
      } as unknown as Response);

      // Mock Rollback POST
      vi.mocked(apiClient.fetchWithAuth).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Khôi phục thành công',
          restoredVersion: 1,
          portfolio: { ...mockPortfolio, title: 'Khôi phục v1' },
        }),
      } as unknown as Response);

      const onRestoreSnapshot = vi.fn();
      const onClose = vi.fn();

      render(
        <SnapshotHistoryModal
          isOpen={true}
          onClose={onClose}
          onRestoreSnapshot={onRestoreSnapshot}
          username="hoangdev"
        />
      );

      // Verify versions loaded from API
      await waitFor(() => {
        expect(screen.getByText('Phiên bản v2')).toBeDefined();
        expect(screen.getByText('Phiên bản v1')).toBeDefined();
      });

      // Click "Khôi phục phiên bản này" for v1
      const rollbackBtn = screen.getByRole('button', { name: /Khôi phục phiên bản này/i });
      fireEvent.click(rollbackBtn);

      // Confirmation prompt appears
      expect(screen.getByText(/Xác nhận khôi phục\?/i)).toBeDefined();

      // Click "Đồng ý"
      const confirmBtn = screen.getByRole('button', { name: /Đồng ý/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(apiClient.fetchWithAuth).toHaveBeenCalledWith(
          expect.stringContaining('/portfolios/me/snapshots/1/rollback'),
          expect.objectContaining({ method: 'POST' })
        );
        expect(onRestoreSnapshot).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Khôi phục v1' })
        );
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('CreateShareLinkModal Synchronized Selective Slides & Real API Handling', () => {
    it('synchronizes selected projects and experiences and displays error message from API without fake tokens', async () => {
      vi.mocked(apiClient.fetchWithAuth).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Số lượng link tạo trong ngày vượt quá giới hạn cho phép.',
        }),
      } as unknown as Response);

      render(
        <CreateShareLinkModal
          isOpen={true}
          onClose={vi.fn()}
          onCreated={vi.fn()}
          portfolio={mockPortfolio}
        />
      );

      // Check both projects and experiences checkboxes are rendered and pre-selected
      expect(screen.getByText(/High-Frequency Matching Engine/i)).toBeDefined();
      expect(screen.getByText(/Principal Engineer/i)).toBeDefined();

      // Fill in company name
      const input = screen.getByPlaceholderText(/Shopee - Senior Backend Role/i);
      fireEvent.change(input, { target: { value: 'Google Zurich' } });

      // Submit form
      const submitBtn = screen.getByRole('button', { name: /Tạo Link Ứng Tuyển & Snapshot/i });
      fireEvent.click(submitBtn);

      // Verify real backend error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Số lượng link tạo trong ngày vượt quá giới hạn cho phép.')).toBeDefined();
      });

      // Verify NO fake token st_ is rendered
      expect(screen.queryByText(/st_/i)).toBeNull();
    });
  });
});
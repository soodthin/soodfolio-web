import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileModal } from '@/components/dashboard/ProfileModal';
import * as apiClient from '@/lib/apiClient';
import { PortfolioData } from '@/types/portfolio';

const mockPortfolio: PortfolioData = {
  id: 'port_1',
  userId: 'user_1',
  username: 'thaidothinh',
  title: 'THAI DO THINH',
  tagline: 'SOFTWARE ENGINEER // FULL-STACK',
  bio: 'Experienced full stack developer passionate about scalable web architectures.',
  statusText: 'AVAILABLE FOR ROLES',
  resumeUrl: 'https://example.com/resume.pdf',
  themeMode: 'DARK',
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  socialLinks: [],
  experiences: [],
  projects: [],
  skills: [],
  educations: [],
};

describe('ProfileModal Component', () => {
  const onClose = vi.fn();
  const onSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ProfileModal
        isOpen={false}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders pre-populated form fields when isOpen is true', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );

    expect(screen.getByText('Edit Identity & Hero Slide')).toBeDefined();
    expect(screen.getByDisplayValue('THAI DO THINH')).toBeDefined();
    expect(screen.getByDisplayValue('SOFTWARE ENGINEER // FULL-STACK')).toBeDefined();
    expect(screen.getByDisplayValue('AVAILABLE FOR ROLES')).toBeDefined();
    expect(screen.getByDisplayValue('https://example.com/resume.pdf')).toBeDefined();
    expect(
      screen.getByDisplayValue(/Experienced full stack developer/)
    ).toBeDefined();
  });

  it('validates required title before sending update request', async () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );

    const titleInput = screen.getByDisplayValue('THAI DO THINH');
    fireEvent.change(titleInput, { target: { value: '   ' } });

    const submitBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Portfolio Title is required.')).toBeDefined();
  });

  it('calls fetchWithAuth with PUT /portfolios/me and invokes onSaved + onClose on success', async () => {
    const updatedPortfolio = { ...mockPortfolio, title: 'NEW SENIOR TITLE' };
    const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(JSON.stringify(updatedPortfolio), { status: 200 })
    );

    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );

    const titleInput = screen.getByDisplayValue('THAI DO THINH');
    fireEvent.change(titleInput, { target: { value: 'NEW SENIOR TITLE' } });

    const submitBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/portfolios/me'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"title":"NEW SENIOR TITLE"'),
        })
      );
    });

    expect(onSaved).toHaveBeenCalledWith(updatedPortfolio);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal when Escape key is pressed', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal when Cancel button is clicked', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        portfolio={mockPortfolio}
        onSaved={onSaved}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

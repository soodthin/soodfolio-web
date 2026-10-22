import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExperienceModal } from '@/components/dashboard/ExperienceModal';
import * as apiClient from '@/lib/apiClient';
import { ExperienceDto } from '@/types/portfolio';

const mockExperience: ExperienceDto = {
  id: 'exp_1',
  portfolioId: 'port_1',
  companyName: 'Linear Labs',
  roleTitle: 'Staff Infrastructure Architect',
  companyUrl: 'https://linear.app',
  location: 'San Francisco, CA (Remote)',
  periodText: '2023 — Present',
  description: 'Designed real-time event pipeline handling 2M events/sec.',
  skillsUsed: ['Go', 'Kafka', 'Kubernetes'],
  highlights: ['Reduced latency by 45%', 'Scaled team from 3 to 15'],
  displayOrder: 1,
};

describe('ExperienceModal Component', () => {
  const onClose = vi.fn();
  const onSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ExperienceModal
        isOpen={false}
        onClose={onClose}
        experience={null}
        onSaved={onSaved}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('validates that role title and company name are required', async () => {
    render(
      <ExperienceModal
        isOpen={true}
        onClose={onClose}
        experience={null}
        onSaved={onSaved}
      />
    );

    const roleInput = screen.getByPlaceholderText('e.g. Senior Full-stack Engineer');
    const companyInput = screen.getByPlaceholderText('e.g. BW Industrial Development');

    // Fill role title with spaces to test JS trim validation
    fireEvent.change(roleInput, { target: { value: '   ' } });
    fireEvent.change(companyInput, { target: { value: 'Linear Labs' } });

    const submitBtn = screen.getByRole('button', { name: /save experience/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Role Title is required.')).toBeDefined();

    // Fill role title with valid string, but company with spaces
    fireEvent.change(roleInput, { target: { value: 'Staff Architect' } });
    fireEvent.change(companyInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Company Name is required.')).toBeDefined();
  });

  it('submits POST request to create new experience when experience prop is null', async () => {
    const createdExp: ExperienceDto = {
      ...mockExperience,
      id: 'exp_new',
    };

    const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(JSON.stringify(createdExp), { status: 201 })
    );

    render(
      <ExperienceModal
        isOpen={true}
        onClose={onClose}
        experience={null}
        onSaved={onSaved}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Senior Full-stack Engineer'), {
      target: { value: 'Staff Architect' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. BW Industrial Development'), {
      target: { value: 'Linear Labs' },
    });
    fireEvent.change(screen.getByPlaceholderText('FastAPI, React, TypeScript, Docker, Redis'), {
      target: { value: 'Go, Kafka, Docker' },
    });

    const submitBtn = screen.getByRole('button', { name: /save experience/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/portfolios/me/experiences'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"companyName":"Linear Labs"'),
        })
      );
    });

    expect(onSaved).toHaveBeenCalledWith(createdExp);
    expect(onClose).toHaveBeenCalled();
  });

  it('submits PUT request with experience ID when editing existing experience', async () => {
    const updatedExp = { ...mockExperience, roleTitle: 'VP of Engineering' };

    const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(JSON.stringify(updatedExp), { status: 200 })
    );

    render(
      <ExperienceModal
        isOpen={true}
        onClose={onClose}
        experience={mockExperience}
        onSaved={onSaved}
      />
    );

    expect(screen.getByDisplayValue('Linear Labs')).toBeDefined();
    const roleInput = screen.getByDisplayValue('Staff Infrastructure Architect');
    fireEvent.change(roleInput, { target: { value: 'VP of Engineering' } });

    const submitBtn = screen.getByRole('button', { name: /update experience/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/portfolios/me/experiences/exp_1'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"roleTitle":"VP of Engineering"'),
        })
      );
    });

    expect(onSaved).toHaveBeenCalledWith(updatedExp);
    expect(onClose).toHaveBeenCalled();
  });
});

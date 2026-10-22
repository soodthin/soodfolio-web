import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectModal } from '@/components/dashboard/ProjectModal';
import * as apiClient from '@/lib/apiClient';
import { ProjectDto } from '@/types/portfolio';

const mockProject: ProjectDto = {
  id: 'proj_99',
  portfolioId: 'port_1',
  title: 'Lumina Spatial OS',
  subtitle: 'Interactive WebGL Canvas with 120fps motion',
  role: 'TECH LEAD',
  periodText: 'Q1 2024',
  description: 'Built spatial UI canvas with low frame budget.',
  techStack: ['Next.js', 'Three.js', 'Tailwind'],
  highlights: ['Achieved 120fps steady render loop', 'Zero layout shifts'],
  liveUrl: 'https://lumina.example.com',
  githubUrl: 'https://github.com/example/lumina',
  displayOrder: 1,
};

describe('ProjectModal Component', () => {
  const onClose = vi.fn();
  const onSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ProjectModal
        isOpen={false}
        onClose={onClose}
        project={null}
        onSaved={onSaved}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('requires project title before submitting', async () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={onClose}
        project={null}
        onSaved={onSaved}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g. Cash Flow AI Reconciliation');
    fireEvent.change(titleInput, { target: { value: '   ' } });

    const submitBtn = screen.getByRole('button', { name: /create slide/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Project Title is required.')).toBeDefined();
  });

  it('submits POST /portfolios/me/projects when creating new project', async () => {
    const createdProject: ProjectDto = {
      ...mockProject,
      id: 'proj_new',
      title: 'Neon HyperFlow',
    };

    const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(JSON.stringify(createdProject), { status: 201 })
    );

    render(
      <ProjectModal
        isOpen={true}
        onClose={onClose}
        project={null}
        onSaved={onSaved}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Cash Flow AI Reconciliation'), {
      target: { value: 'Neon HyperFlow' },
    });
    fireEvent.change(screen.getByPlaceholderText('Next.js, TypeScript, Spring Boot, Redis'), {
      target: { value: 'Kafka, Go, ClickHouse' },
    });

    const submitBtn = screen.getByRole('button', { name: /create slide/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/portfolios/me/projects'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"title":"Neon HyperFlow"'),
        })
      );
    });

    expect(onSaved).toHaveBeenCalledWith(createdProject);
    expect(onClose).toHaveBeenCalled();
  });

  it('submits PUT /portfolios/me/projects/:id when editing existing project', async () => {
    const updatedProject = { ...mockProject, title: 'Lumina Spatial OS v2' };

    const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
      new Response(JSON.stringify(updatedProject), { status: 200 })
    );

    render(
      <ProjectModal
        isOpen={true}
        onClose={onClose}
        project={mockProject}
        onSaved={onSaved}
      />
    );

    const titleInput = screen.getByDisplayValue('Lumina Spatial OS');
    fireEvent.change(titleInput, { target: { value: 'Lumina Spatial OS v2' } });

    const submitBtn = screen.getByRole('button', { name: /update slide/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/portfolios/me/projects/proj_99'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"title":"Lumina Spatial OS v2"'),
        })
      );
    });

    expect(onSaved).toHaveBeenCalledWith(updatedProject);
    expect(onClose).toHaveBeenCalled();
  });
});

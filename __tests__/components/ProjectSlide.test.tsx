import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectSlide } from '@/components/projects';
import { ProjectDto } from '@/types/portfolio';

const mockProject: ProjectDto = {
  id: 'proj_1',
  portfolioId: 'port_1',
  title: 'CloudMesh Telemetry',
  subtitle: 'High-throughput distributed telemetry buffer',
  tagline: 'Real-time Telemetry Engine',
  description: 'Processed 5M records per second with 15ms p99 latency SLA.',
  role: 'LEAD ARCHITECT',
  liveUrl: 'https://cloudmesh.example.com',
  githubUrl: 'https://github.com/example/cloudmesh',
  techStack: ['Go', 'Kafka', 'eBPF', 'ClickHouse', 'Kubernetes', 'Grafana'],
  displayOrder: 1,
};

describe('ProjectSlide Component', () => {
  it('renders project metadata, title, role and slide numbering', () => {
    render(
      <ProjectSlide
        project={mockProject}
        slideNumber="SLIDE 03"
        projectIndex={0}
        totalProjects={3}
      />
    );

    expect(screen.getByText('SLIDE 03')).toBeDefined();
    expect(screen.getByText('01 / 03')).toBeDefined();
    expect(screen.getByText('CloudMesh Telemetry')).toBeDefined();
    expect(screen.getByText('High-throughput distributed telemetry buffer')).toBeDefined();
    expect(screen.getByText('LEAD ARCHITECT')).toBeDefined();
  });

  it('renders action links for Live Demo and GitHub Repo with secure attributes', () => {
    render(
      <ProjectSlide
        project={mockProject}
        slideNumber="SLIDE 03"
        projectIndex={0}
        totalProjects={3}
      />
    );

    const liveDemoLink = screen.getByRole('link', { name: /live demo/i });
    expect(liveDemoLink.getAttribute('href')).toBe('https://cloudmesh.example.com');
    expect(liveDemoLink.getAttribute('target')).toBe('_blank');
    expect(liveDemoLink.getAttribute('rel')).toBe('noopener noreferrer');

    const githubLink = screen.getByRole('link', { name: /github repo/i });
    expect(githubLink.getAttribute('href')).toBe('https://github.com/example/cloudmesh');
    expect(githubLink.getAttribute('target')).toBe('_blank');
  });

  it('renders first 4 tags and collapses additional tags into TechPopover', () => {
    render(
      <ProjectSlide
        project={mockProject}
        slideNumber="SLIDE 03"
        projectIndex={0}
        totalProjects={3}
      />
    );

    // Primary 4 tags
    expect(screen.getByText('[ Go ]')).toBeDefined();
    expect(screen.getByText('[ Kafka ]')).toBeDefined();
    expect(screen.getByText('[ eBPF ]')).toBeDefined();
    expect(screen.getByText('[ ClickHouse ]')).toBeDefined();

    // Remaining tags button: 2 remaining (Kubernetes, Grafana)
    const popoverButton = screen.getByRole('button', { name: /view all project tags/i });
    expect(popoverButton.textContent).toBe('[ +2 ]');

    // Clicking popover button expands all remaining technologies
    fireEvent.click(popoverButton);

    expect(screen.getByText('All Technologies (2)')).toBeDefined();
    expect(screen.getByText('[ Kubernetes ]')).toBeDefined();
    expect(screen.getByText('[ Grafana ]')).toBeDefined();
  });
});

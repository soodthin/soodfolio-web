import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/hero';
import { PortfolioData } from '@/types/portfolio';

const mockPortfolio: PortfolioData = {
  id: '1',
  userId: 'u1',
  username: 'thaidothinh',
  title: 'Thai Do Thinh',
  tagline: 'Staff Software Architect',
  bio: 'Specializing in reactive systems and low-latency cloud architectures.',
  statusText: 'Open to opportunities',
  resumeUrl: 'https://example.com/cv.pdf',
  themeMode: 'DARK',
  showExperience: true,
  showProjects: true,
  showSkills: true,
  showEducation: true,
  showContact: true,
  socialLinks: [],
  experiences: [
    {
      id: 'e1',
      portfolioId: '1',
      companyName: 'Linear Labs',
      role: 'Staff Engineer',
      startDate: '2023-01-01',
      current: true,
      displayOrder: 1,
    },
  ],
  projects: [
    {
      id: 'p1',
      portfolioId: '1',
      title: 'HyperFlow Broker',
      tagline: 'Event Streaming',
      techStack: ['Kafka', 'Go'],
      displayOrder: 1,
    },
    {
      id: 'p2',
      portfolioId: '1',
      title: 'Spatial Canvas',
      tagline: 'WebGL 3D',
      techStack: ['Three.js', 'React'],
      displayOrder: 2,
    },
  ],
  skills: [],
  educations: [
    {
      id: 'ed1',
      portfolioId: '1',
      institutionName: 'Hanoi University of Science & Tech',
      degree: 'B.S. in Computer Science',
      startDate: '2020-09-01',
      displayOrder: 1,
    },
  ],
};

describe('Hero Component', () => {
  it('renders monogram correctly from two words in title', () => {
    render(<Hero data={mockPortfolio} />);
    // "Thai Do Thinh" -> first two words "Thai", "Do" -> "TD"
    expect(screen.getByText('TD')).toBeDefined();
    expect(screen.getByText('[ @thaidothinh ]')).toBeDefined();
  });

  it('falls back to "SF" when title is empty', () => {
    const emptyTitlePortfolio = { ...mockPortfolio, title: '' };
    render(<Hero data={emptyTitlePortfolio} />);
    expect(screen.getByText('SF')).toBeDefined();
  });

  it('renders title, tagline, and elevator bio accurately', () => {
    render(<Hero data={mockPortfolio} />);
    expect(screen.getByText('Thai Do Thinh')).toBeDefined();
    expect(screen.getByText('Staff Software Architect')).toBeDefined();
    expect(
      screen.getByText(
        'Specializing in reactive systems and low-latency cloud architectures.'
      )
    ).toBeDefined();
  });

  it('renders summary metrics correctly for projects, experience, status, and education', () => {
    render(<Hero data={mockPortfolio} />);

    // 2 projects deployed
    expect(screen.getByText('2 DEPLOYED')).toBeDefined();

    // First company name
    expect(screen.getByText('LINEAR LABS')).toBeDefined();

    // Status text uppercase
    expect(screen.getByText('OPEN TO OPPORTUNITIES')).toBeDefined();

    // Education degree uppercase
    expect(screen.getByText('B.S. IN COMPUTER SCIENCE')).toBeDefined();
  });

  it('handles empty relations gracefully with fallback values', () => {
    const barePortfolio: PortfolioData = {
      ...mockPortfolio,
      title: 'Solo',
      experiences: [],
      projects: [],
      educations: [],
      statusText: undefined,
    };

    render(<Hero data={barePortfolio} />);

    expect(screen.getByText('0 DEPLOYED')).toBeDefined();
    expect(screen.getByText('DEVELOPER')).toBeDefined();
    expect(screen.getByText('ACTIVE')).toBeDefined();
    expect(screen.getByText('DEGREE')).toBeDefined();
  });
});

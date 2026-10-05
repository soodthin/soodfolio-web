'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Navbar, NavItem } from '@/components/navbar';
import { SlideNav, SlideInfo } from '@/components/slide-nav';
import { Hero } from '@/components/hero';
import { Experience } from '@/components/experience';
import { ProjectSlide } from '@/components/projects';
import { SkillsSlide, EducationSlide } from '@/components/about';
import { Contact } from '@/components/contact';

interface SlideDeckProps {
  data: PortfolioData;
}

interface SlideItemConfig {
  info: SlideInfo;
  render: (slideNumber: string) => React.ReactNode;
}

export function SlideDeck({ data }: SlideDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dynamically assemble slides according to portfolio visibility toggles & data
  const { slides, slideConfigs, navItems } = useMemo(() => {
    const rawConfigs: {
      id: string;
      title: string;
      parentTitle?: string;
      navLabel?: string;
      render: (slideNumber: string) => React.ReactNode;
    }[] = [];

    // 1. Hero / Summary (Always present)
    rawConfigs.push({
      id: 'summary',
      title: 'SUMMARY',
      navLabel: 'Summary',
      render: () => <Hero data={data} />,
    });

    // 2. Experience
    if (data.showExperience && data.experiences && data.experiences.length > 0) {
      rawConfigs.push({
        id: 'experience',
        title: 'EXPERIENCE',
        navLabel: 'Experience',
        render: (num) => <Experience experiences={data.experiences} slideNumber={num} />,
      });
    }

    // 3. Projects (Each project gets its own dedicated presentation slide)
    if (data.showProjects && data.projects && data.projects.length > 0) {
      data.projects.forEach((proj, pIdx) => {
        rawConfigs.push({
          id: `project-${proj.id || pIdx + 1}`,
          title: proj.title,
          parentTitle: 'PROJECTS',
          navLabel: pIdx === 0 ? 'Projects' : undefined,
          render: (num) => (
            <ProjectSlide
              project={proj}
              slideNumber={num}
              projectIndex={pIdx}
              totalProjects={data.projects.length}
            />
          ),
        });
      });
    }

    // 4. Skills
    if (data.showSkills && data.skills && data.skills.length > 0) {
      rawConfigs.push({
        id: 'skills',
        title: 'SKILLS',
        navLabel: 'Skills',
        render: (num) => <SkillsSlide skills={data.skills} slideNumber={num} />,
      });
    }

    // 5. Education
    if (data.showEducation && data.educations && data.educations.length > 0) {
      rawConfigs.push({
        id: 'education',
        title: 'EDUCATION',
        navLabel: 'Education',
        render: (num) => <EducationSlide educations={data.educations} slideNumber={num} />,
      });
    }

    // 6. Contact
    if (data.showContact) {
      rawConfigs.push({
        id: 'contact',
        title: 'CONTACT',
        navLabel: 'Contact',
        render: (num) => <Contact data={data} slideNumber={num} onSelectSlide={scrollToSlide} />,
      });
    }

    // Assign sequential numbers: '01', '02', '03'...
    const computedSlides: SlideInfo[] = rawConfigs.map((c, idx) => ({
      id: c.id,
      number: String(idx + 1).padStart(2, '0'),
      title: c.title,
      parentTitle: c.parentTitle,
    }));

    const computedConfigs: SlideItemConfig[] = rawConfigs.map((c, idx) => ({
      info: computedSlides[idx],
      render: c.render,
    }));

    // Find project slide index range for navbar matching
    const projectIndices = computedSlides
      .map((s, idx) => (s.parentTitle === 'PROJECTS' ? idx : -1))
      .filter((idx) => idx !== -1);
    const firstProjIdx = projectIndices.length > 0 ? projectIndices[0] : -1;
    const lastProjIdx = projectIndices.length > 0 ? projectIndices[projectIndices.length - 1] : -1;

    // Build NavItems for Navbar
    const computedNavItems: NavItem[] = [];
    rawConfigs.forEach((c, idx) => {
      if (c.navLabel) {
        if (c.parentTitle === 'PROJECTS') {
          computedNavItems.push({
            label: 'Projects',
            slideIndex: idx,
            matches: (curr) => curr >= firstProjIdx && curr <= lastProjIdx,
          });
        } else {
          computedNavItems.push({
            label: c.navLabel,
            slideIndex: idx,
            matches: (curr) => curr === idx,
          });
        }
      }
    });

    return {
      slides: computedSlides,
      slideConfigs: computedConfigs,
      navItems: computedNavItems,
    };
  }, [data]);

  const scrollToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      const target = slideRefs.current[index];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [slides.length]
  );

  // IntersectionObserver for tracking active slide on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      observer.disconnect();
    };
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.target?.toString().includes('Input')) {
        e.preventDefault();
        scrollToSlide(activeIndex + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        scrollToSlide(activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToSlide, slides.length]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0b1124] text-[#ebe7ff]">
      {/* Top Navbar */}
      <Navbar
        title={data.title}
        username={data.username}
        navItems={navItems}
        activeIndex={activeIndex}
        totalSlides={slides.length}
        onSelectSlide={scrollToSlide}
      />

      {/* Right Slide Indicator / Nav */}
      <SlideNav
        slides={slides}
        activeIndex={activeIndex}
        onSelectSlide={scrollToSlide}
      />

      {/* Full-screen Snap Scroll Deck */}
      <main
        ref={containerRef}
        className="snap-deck-container w-full h-full overflow-y-scroll overflow-x-hidden no-scrollbar focus:outline-none"
        tabIndex={0}
      >
        {slideConfigs.map((config, index) => (
          <div
            key={config.info.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="snap-card min-h-screen w-full flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-20 pb-16"
          >
            {config.render(config.info.number)}
          </div>
        ))}
      </main>
    </div>
  );
}

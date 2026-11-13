'use client';

import React from 'react';
import { PortfolioData, ProjectDto, ExperienceDto, SkillDto } from '@/types/portfolio';
import { StudioSlideKey } from './types';
import { CoverInspector } from './inspectors/CoverInspector';
import { ProjectsInspector } from './inspectors/ProjectsInspector';
import { ExperienceInspector } from './inspectors/ExperienceInspector';
import { SkillsInspector } from './inspectors/SkillsInspector';
import { SettingsInspector } from './inspectors/SettingsInspector';
import { ContactInspector } from './inspectors/ContactInspector';

interface SlideInspectorProps {
  portfolio: PortfolioData | null;
  activeSlide: StudioSlideKey;
  onUpdatePortfolioField: (field: keyof PortfolioData, value: any) => void;
  onSaveProfile: (updated: Partial<PortfolioData>) => Promise<void>;
  // Project CRUD
  onAddProject: (project: Omit<ProjectDto, 'id'>) => Promise<void>;
  onUpdateProject: (id: string, updated: Partial<ProjectDto>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onMoveProject: (index: number, direction: 'up' | 'down') => Promise<void>;
  onProjectImported?: (project: ProjectDto) => void;
  // Experience CRUD
  onAddExperience: (exp: Omit<ExperienceDto, 'id'>) => Promise<void>;
  onUpdateExperience: (id: string, updated: Partial<ExperienceDto>) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
  onMoveExperience: (index: number, direction: 'up' | 'down') => Promise<void>;
  // Skills CRUD
  onAddSkill: (category: string, name: string) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
  // Settings
  onToggleSection: (
    field: 'showExperience' | 'showProjects' | 'showSkills' | 'showEducation' | 'showContact'
  ) => Promise<void>;
  isSaving: boolean;
  lastSavedText?: string;
  focusedField?: string | null;
  onFocusField?: (field: string) => void;
  onBlurField?: () => void;
  // Deprecated/Backward compatibility props
  inspectorMode?: string;
  onToggleInspectorMode?: () => void;
  onApplyJson?: (updated: PortfolioData) => Promise<void>;
}

function extractGithubUsername(portfolio: PortfolioData | null): string {
  if (!portfolio) return '';
  if (portfolio.socialLinks && portfolio.socialLinks.length > 0) {
    const ghLink = portfolio.socialLinks.find(
      (link) => link.platform && link.platform.toLowerCase().includes('github')
    );
    if (ghLink) {
      if (ghLink.url) {
        try {
          const raw = ghLink.url.trim().startsWith('http') ? ghLink.url.trim() : `https://${ghLink.url.trim()}`;
          const parsed = new URL(raw);
          const parts = parsed.pathname.split('/').filter(Boolean);
          if (parts.length > 0) {
            return parts[0].replace(/^@/, '');
          }
        } catch {
          // ignore parsing error
        }
      }
      if (ghLink.label) {
        const clean = ghLink.label.replace(/^@/, '').trim();
        if (clean && !clean.includes(' ')) return clean;
      }
    }
  }
  return portfolio.username || '';
}

export const SlideInspector: React.FC<SlideInspectorProps> = ({
  portfolio,
  activeSlide,
  onUpdatePortfolioField,
  onSaveProfile,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onMoveProject,
  onProjectImported,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onMoveExperience,
  onAddSkill,
  onDeleteSkill,
  onToggleSection,
  isSaving,
  focusedField,
  onFocusField,
  onBlurField,
}) => {
  return (
    <div className="w-full">
      {activeSlide === 'cover' && (
        <CoverInspector
          portfolio={portfolio}
          onUpdateField={onUpdatePortfolioField}
          onSaveProfile={onSaveProfile}
          isSaving={isSaving}
          focusedField={focusedField}
          onFocusField={onFocusField}
          onBlurField={onBlurField}
        />
      )}

      {activeSlide === 'projects' && (
        <ProjectsInspector
          projects={portfolio?.projects || []}
          onAddProject={onAddProject}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
          onMoveProject={onMoveProject}
          isSaving={isSaving}
          defaultGithubUsername={extractGithubUsername(portfolio)}
          onProjectImported={onProjectImported}
        />
      )}

      {activeSlide === 'experience' && (
        <ExperienceInspector
          experiences={portfolio?.experiences || []}
          educations={portfolio?.educations || []}
          onAddExperience={onAddExperience}
          onUpdateExperience={onUpdateExperience}
          onDeleteExperience={onDeleteExperience}
          onMoveExperience={onMoveExperience}
          onUpdateEducations={(updatedEducations) =>
            onUpdatePortfolioField('educations', updatedEducations)
          }
          isSaving={isSaving}
        />
      )}

      {activeSlide === 'skills' && (
        <SkillsInspector
          skills={portfolio?.skills || []}
          onAddSkill={onAddSkill}
          onDeleteSkill={onDeleteSkill}
          isSaving={isSaving}
        />
      )}

      {activeSlide === 'contact' && (
        <ContactInspector
          portfolio={portfolio}
          onUpdateField={onUpdatePortfolioField}
          onSaveProfile={onSaveProfile}
          isSaving={isSaving}
          focusedField={focusedField}
          onFocusField={onFocusField}
          onBlurField={onBlurField}
        />
      )}

      {activeSlide === 'settings' && (
        <SettingsInspector
          portfolio={portfolio}
          onToggleSection={onToggleSection}
          onUpdateField={onUpdatePortfolioField}
          onSaveProfile={onSaveProfile}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

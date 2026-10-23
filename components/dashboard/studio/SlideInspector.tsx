'use client';

import React from 'react';
import { PortfolioData, ProjectDto, ExperienceDto, SkillDto } from '@/types/portfolio';
import { StudioSlideKey, InspectorMode, STUDIO_SLIDES } from './types';
import { CoverInspector } from './inspectors/CoverInspector';
import { ProjectsInspector } from './inspectors/ProjectsInspector';
import { ExperienceInspector } from './inspectors/ExperienceInspector';
import { SkillsInspector } from './inspectors/SkillsInspector';
import { SettingsInspector } from './inspectors/SettingsInspector';
import { JsonCodeEditor } from './JsonCodeEditor';
import { FileEdit, Code, CheckCircle2 } from 'lucide-react';

interface SlideInspectorProps {
  portfolio: PortfolioData | null;
  activeSlide: StudioSlideKey;
  inspectorMode: InspectorMode;
  onToggleInspectorMode: () => void;
  onUpdatePortfolioField: (field: keyof PortfolioData, value: any) => void;
  onSaveProfile: (updated: Partial<PortfolioData>) => Promise<void>;
  // Project CRUD
  onAddProject: (project: Omit<ProjectDto, 'id'>) => Promise<void>;
  onUpdateProject: (id: string, updated: Partial<ProjectDto>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onMoveProject: (index: number, direction: 'up' | 'down') => Promise<void>;
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
  // JSON Apply
  onApplyJson: (updated: PortfolioData) => Promise<void>;
  isSaving: boolean;
  lastSavedText: string;
  focusedField?: string | null;
  onFocusField?: (field: string) => void;
  onBlurField?: () => void;
}

export const SlideInspector: React.FC<SlideInspectorProps> = ({
  portfolio,
  activeSlide,
  inspectorMode,
  onToggleInspectorMode,
  onUpdatePortfolioField,
  onSaveProfile,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onMoveProject,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onMoveExperience,
  onAddSkill,
  onDeleteSkill,
  onToggleSection,
  onApplyJson,
  isSaving,
  lastSavedText,
  focusedField,
  onFocusField,
  onBlurField,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#080d12] border-r border-slate-200/80 dark:border-white/[0.07] overflow-hidden min-h-0">
      {/* Inspector Top Controls: Form vs JSON Mode Toggle & Save Status */}
      <div className="px-4 py-2.5 border-b border-slate-200/80 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#0c131a]/50 flex items-center justify-between gap-2 flex-shrink-0">
        {/* Mode Switcher Segmented Pill */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-white/[0.06] border border-slate-300/40 dark:border-white/10">
          <button
            type="button"
            onClick={onToggleInspectorMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inspectorMode === 'form'
                ? 'bg-white dark:bg-[#111a24] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileEdit className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span>Form UI</span>
          </button>

          <button
            type="button"
            onClick={onToggleInspectorMode}
            title="Chuyển sang chế độ JSON Spec (Cmd/Ctrl + J)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inspectorMode === 'json'
                ? 'bg-white dark:bg-[#111a24] text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="h-3 w-3" />
            <span>JSON Spec</span>
          </button>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          {isSaving ? (
            <span className="flex items-center gap-1 text-teal-500 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Đang đồng bộ...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="hidden sm:inline">{lastSavedText || 'Đã lưu'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
        {inspectorMode === 'json' ? (
          <JsonCodeEditor
            portfolio={portfolio}
            activeSlide={activeSlide}
            onApplyJson={onApplyJson}
            isSaving={isSaving}
          />
        ) : (
          <>
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
              />
            )}

            {activeSlide === 'experience' && (
              <ExperienceInspector
                experiences={portfolio?.experiences || []}
                onAddExperience={onAddExperience}
                onUpdateExperience={onUpdateExperience}
                onDeleteExperience={onDeleteExperience}
                onMoveExperience={onMoveExperience}
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

            {activeSlide === 'settings' && (
              <SettingsInspector
                portfolio={portfolio}
                onToggleSection={onToggleSection}
                onUpdateField={onUpdatePortfolioField}
                onSaveProfile={onSaveProfile}
                isSaving={isSaving}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { SkillDto } from '@/types/portfolio';
import { Cpu, Plus, X, Tag } from 'lucide-react';

interface SkillsInspectorProps {
  skills: SkillDto[];
  onAddSkill: (category: string, name: string) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
  isSaving: boolean;
}

const SKILL_CATEGORIES = [
  'LANGUAGES',
  'FRAMEWORKS',
  'DATABASES',
  'DEVOPS',
  'AI_ENGINEERING',
  'TOOLS',
];

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGES: 'Languages & Core',
  FRAMEWORKS: 'Frameworks & Libs',
  DATABASES: 'Databases & Storage',
  DEVOPS: 'DevOps & Cloud',
  AI_ENGINEERING: 'AI & Data Engineering',
  TOOLS: 'Workflows & Tooling',
};

export const SkillsInspector: React.FC<SkillsInspectorProps> = ({
  skills,
  onAddSkill,
  onDeleteSkill,
  isSaving,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('LANGUAGES');
  const [newSkillName, setNewSkillName] = useState('');

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    await onAddSkill(selectedCategory, newSkillName.trim());
    setNewSkillName('');
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-bold">
          SLIDE 04 // COMPETENCY MATRIX
        </span>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
          Ma trận Năng lực & Tech Stack ({skills.length} kỹ năng)
        </h2>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddSkill} className="p-3 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 space-y-2.5">
        <div className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">
          // THÊM KỸ NĂNG NHANH
        </div>

        <div className="grid grid-cols-12 gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="col-span-6 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Tên công nghệ (VD: Go, Kafka...)"
            className="col-span-4 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#080d12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
          />

          <button
            type="submit"
            disabled={!newSkillName.trim() || isSaving}
            className="col-span-2 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Categorized Skills View */}
      <div className="space-y-3 pt-1">
        {SKILL_CATEGORIES.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);

          return (
            <div
              key={cat}
              className="p-3 rounded-xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {CATEGORY_LABELS[cat] || cat}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {catSkills.length} tags
                </span>
              </div>

              {catSkills.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">Chưa có công nghệ nào trong nhóm này.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-rose-400/50 transition-colors"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteSkill(skill.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title={`Xoá ${skill.name}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

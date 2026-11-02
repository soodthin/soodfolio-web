'use client';

import React, { useState } from 'react';
import { SkillDto } from '@/types/portfolio';
import {
  Code2,
  Layers,
  Database,
  Cloud,
  Cpu,
  Wrench,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

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
] as const;

type SkillCategory = (typeof SKILL_CATEGORIES)[number];

const CATEGORY_CONFIG: Record<
  SkillCategory,
  { label: string; desc: string; icon: React.ElementType }
> = {
  LANGUAGES: {
    label: 'Ngôn ngữ Lập trình (Languages)',
    desc: 'TypeScript, Go, Python, Java, Rust...',
    icon: Code2,
  },
  FRAMEWORKS: {
    label: 'Khung ứng dụng (Frameworks)',
    desc: 'Next.js, React, Spring Boot, FastAPI...',
    icon: Layers,
  },
  DATABASES: {
    label: 'Cơ sở Dữ liệu & Lưu trữ',
    desc: 'PostgreSQL, Redis, MongoDB, Elasticsearch...',
    icon: Database,
  },
  DEVOPS: {
    label: 'Hạ tầng & Điện toán Đám mây',
    desc: 'Docker, Kubernetes, AWS, CI/CD, Terraform...',
    icon: Cloud,
  },
  AI_ENGINEERING: {
    label: 'Trí tuệ Nhân tạo & Xử lý Dữ liệu',
    desc: 'LangChain, OpenAI API, Vector DB, RAG...',
    icon: Cpu,
  },
  TOOLS: {
    label: 'Quy trình & Công cụ Hỗ trợ',
    desc: 'Git, Linux, Figma, Postman, Turborepo...',
    icon: Wrench,
  },
};

export const SkillsInspector: React.FC<SkillsInspectorProps> = ({
  skills,
  onAddSkill,
  onDeleteSkill,
  isSaving,
}) => {
  // Category-specific quick add draft inputs
  const [cardInputs, setCardInputs] = useState<Record<string, string>>({});

  const handleCardInputChange = (category: string, value: string) => {
    setCardInputs((prev) => ({ ...prev, [category]: value }));
  };

  const handleAddSkillFromCard = async (category: string) => {
    const val = (cardInputs[category] || '').trim();
    if (!val) return;

    await onAddSkill(category, val);
    setCardInputs((prev) => ({ ...prev, [category]: '' }));
  };

  return (
    <div className="w-full space-y-4 font-sans text-xs select-none">
      {/* Compact Section Header */}
      <div className="pb-3 border-b border-[#d6d0c2] dark:border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Slide 04 · System Matrix
          </span>
          <div className="text-xs font-semibold text-stone-800 dark:text-slate-200">
            Ma trận Kỹ thuật ({skills.length} kỹ năng)
          </div>
        </div>
      </div>

      {/* Visual Skill Clusters Stack (Single Column) */}
      <div className="space-y-3">
        {SKILL_CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = config.icon;
          const catSkills = skills.filter((s) => s.category === cat);
          const currentInput = cardInputs[cat] || '';

          return (
            <div
              key={cat}
              className="rounded-xl bg-[#fbfaf7] dark:bg-[#0c131a] border border-[#d6d0c2] dark:border-white/[0.07] p-3 shadow-xs transition-all duration-200 space-y-2.5"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-6 w-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                    <Icon className="h-3 w-3 stroke-[2.2]" />
                  </div>
                  <h3 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    {config.label}
                  </h3>
                </div>

                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ede8dd] dark:bg-white/[0.06] text-stone-700 dark:text-slate-400 tabular-nums shrink-0">
                  {catSkills.length}
                </span>
              </div>

              {/* Tag Cloud Pills Container */}
              <div className="flex flex-wrap content-start gap-1">
                {catSkills.length === 0 ? (
                  <p className="text-[11px] text-stone-500 italic py-1">
                    Chưa có kỹ năng trong nhóm này.
                  </p>
                ) : (
                  catSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono bg-[#ede8dd] dark:bg-white/[0.04] hover:bg-[#e2dcd0] dark:hover:bg-white/[0.08] border border-[#d6d0c2] dark:border-white/[0.06] text-stone-800 dark:text-slate-200 transition-all"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteSkill(skill.id)}
                        className="text-stone-400 hover:text-rose-500 cursor-pointer transition-colors"
                        title={`Xoá ${skill.name}`}
                        aria-label={`Xoá kỹ năng ${skill.name}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Fast Enter-to-Add Input Form */}
              <div className="pt-2 border-t border-[#d6d0c2] dark:border-white/[0.05]">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => handleCardInputChange(cat, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillFromCard(cat);
                      }
                    }}
                    placeholder="+ Thêm tag... (Enter)"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#ede8dd]/50 dark:bg-[#080d12] border border-[#d6d0c2] dark:border-white/10 text-[#202124] dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-600 text-[11px] focus:outline-none focus:bg-[#fbfaf7] focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-600/20 shadow-xs transition-colors"
                  />
                  <button
                    type="button"
                    disabled={!currentInput.trim() || isSaving}
                    onClick={() => handleAddSkillFromCard(cat)}
                    className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-30 text-white cursor-pointer transition-colors"
                    title={`Thêm kỹ năng vào ${config.label}`}
                    aria-label={`Thêm kỹ năng vào ${config.label}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

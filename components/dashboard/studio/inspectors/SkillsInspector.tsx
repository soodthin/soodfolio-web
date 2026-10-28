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
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-teal-600 dark:text-teal-400">
            <span>Slide 04</span>
            <span>·</span>
            <span>Competency Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Ma trận Năng lực & Chuyên môn Kỹ thuật
            <span className="ml-2.5 text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 tabular-nums">
              {skills.length} kỹ năng
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phân loại công nghệ theo 6 cụm chuyên môn để thể hiện toàn diện chiều sâu và độ rộng kỹ thuật.
          </p>
        </div>
      </div>

      {/* Visual Skill Clusters Grid (6 Category Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SKILL_CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = config.icon;
          const catSkills = skills.filter((s) => s.category === cat);
          const currentInput = cardInputs[cat] || '';

          return (
            <div
              key={cat}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0c131a] border border-slate-200/80 dark:border-white/[0.07] p-5 shadow-xs hover:border-teal-500/30 dark:hover:border-teal-400/20 transition-all duration-200 space-y-4"
            >
              {/* Category Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                      <Icon className="h-4 w-4 stroke-[2.2]" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {config.label}
                    </h3>
                  </div>

                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 tabular-nums flex-shrink-0">
                    {catSkills.length}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 pl-10">
                  {config.desc}
                </p>
              </div>

              {/* Tag Cloud Pills Container */}
              <div className="flex-1 min-h-[72px] flex flex-wrap content-start gap-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                {catSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    Chưa có kỹ năng nào trong cụm này.
                  </p>
                ) : (
                  catSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-sans font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] border border-slate-200/80 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 transition-all"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteSkill(skill.id)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5 transition-colors"
                        title={`Xoá ${skill.name}`}
                        aria-label={`Xoá kỹ năng ${skill.name}`}
                      >
                        <X className="h-3 w-3 stroke-[2.2]" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Fast Enter-to-Add Input Form */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
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
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 text-xs font-sans font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <button
                    type="button"
                    disabled={!currentInput.trim() || isSaving}
                    onClick={() => handleAddSkillFromCard(cat)}
                    className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all cursor-pointer shadow-xs disabled:opacity-40 flex-shrink-0"
                    title={`Thêm kỹ năng vào ${config.label}`}
                    aria-label={`Thêm kỹ năng vào ${config.label}`}
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
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

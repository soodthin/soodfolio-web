'use client';

import { SkillDto, EducationDto } from '@/types/portfolio';

interface SkillsSlideProps {
  skills: SkillDto[];
  slideNumber?: string;
}

export function SkillsSlide({ skills, slideNumber = '05' }: SkillsSlideProps) {
  // Group skills dynamically by category
  const groupedSkills = skills.reduce<Record<string, string[]>>((acc, skill) => {
    const category = skill.category || 'TECHNICAL SKILLS';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill.name);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  return (
    <section id="skills" className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <span className="font-mono text-xs text-[#f8c076] tracking-wider">{slideNumber}</span>
        <h2 className="text-lg sm:text-2xl font-sans font-bold uppercase tracking-wider text-[#f1edff]">
          Skills &amp; Technologies
        </h2>
        <div className="flex-1 border-b border-[#213364]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-2xl p-4 sm:p-5 border border-[#283d78] bg-[#0f1938]/90 hover:border-[#4b66ae] transition-all duration-300 flex flex-col justify-between shadow-[0_12px_40px_rgba(10,18,42,0.5)]"
          >
            <div>
              <h3 className="font-sans text-sm font-bold tracking-wider text-[#f8c076] mb-2 uppercase">
                {category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2.5 sm:pt-3 border-t border-[#213364]">
              {groupedSkills[category].map((skillName) => (
                <span
                  key={skillName}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#132047] border border-[#2b417e] text-[#8cb0fd]"
                >
                  {skillName}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface EducationSlideProps {
  educations: EducationDto[];
  slideNumber?: string;
}

export function EducationSlide({ educations, slideNumber = '06' }: EducationSlideProps) {
  if (!educations || educations.length === 0) {
    return null;
  }

  const primaryEdu = educations[0];

  return (
    <section id="education" className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <span className="font-mono text-xs text-[#f8c076] tracking-wider">{slideNumber}</span>
        <h2 className="text-lg sm:text-2xl font-sans font-bold uppercase tracking-wider text-[#f1edff]">
          Education &amp; Background
        </h2>
        <div className="flex-1 border-b border-[#213364]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5">
        <div className="md:col-span-12 rounded-2xl p-4 sm:p-8 border border-[#283d78] bg-[#0f1938]/90 shadow-[0_12px_40px_rgba(10,18,42,0.5)] space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs font-mono tracking-wider text-[#f8c076] font-semibold uppercase">
              Degree &amp; Honors
            </span>
            <span className="text-xs font-mono text-[#8299cd]">
              {primaryEdu.periodText}
            </span>
          </div>

          <h3 className="font-sans text-xl sm:text-2xl font-bold text-white uppercase">
            {primaryEdu.institution}
          </h3>

          <div className="text-sm font-sans text-[#8cb0fd]">
            {primaryEdu.degree} in {primaryEdu.fieldOfStudy}
          </div>

          {primaryEdu.highlights && (
            <div className="pt-2">
              <div className="text-xs font-mono text-[#8299cd] mb-1 font-semibold">
                Highlights &amp; Achievements:
              </div>
              <p className="text-xs sm:text-sm font-sans text-[#c5d5f6] leading-relaxed">
                {primaryEdu.highlights}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

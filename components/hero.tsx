'use client';

import { PortfolioData } from '@/types/portfolio';

interface HeroProps {
  data: PortfolioData;
}

export function Hero({ data }: HeroProps) {
  const initials = data.title
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SF';

  return (
    <section id="summary" className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 sm:gap-8 lg:gap-14">
        {/* Monogram / Avatar Frame */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative p-2 sm:p-2.5">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#34467c] animate-pulse" />
            
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#f8c076]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#f8c076]" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#f8c076]" />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#f8c076]" />

            <div className="p-1.5 sm:p-2.5 rounded-full border-2 border-[#22305c] bg-[#0c142e] shadow-[0_0_45px_rgba(20,30,65,0.75)]">
              <div className="relative w-32 h-32 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden border border-[#52448a] bg-[#080d1f] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/60 via-transparent to-transparent pointer-events-none z-10" />
                
                {/* Monogram / Profile Graphic */}
                <div className="flex flex-col items-center justify-center text-center select-none">
                  <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold tracking-widest text-[#f8c076] drop-shadow-[0_0_15px_rgba(248,192,118,0.35)]">
                    {initials}
                  </span>
                  <span className="font-mono text-[9px] sm:text-xs text-[#8cb0fd] tracking-widest uppercase mt-1">
                    [ @{data.username} ]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3 sm:space-y-4 text-center lg:text-left flex-1">
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-2xl sm:text-5xl font-sans font-bold tracking-tight text-white uppercase">
              {data.title}
            </h1>
            <p className="text-xs sm:text-xl font-mono text-[#8cb0fd]">
              {data.tagline}
            </p>
          </div>

          <p className="text-xs sm:text-base text-[#c5d5f6] leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
            {data.bio}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1 sm:pt-2 text-left font-mono">
            <div className="rounded-xl p-3 border border-[#2b3f78] bg-[#101b3b]/90 hover:border-[#4b66ae] transition-colors shadow-sm">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">PROJECTS</div>
              <div className="text-xs font-bold text-[#f8c076] mt-0.5">
                {data.projects?.length || 0} DEPLOYED
              </div>
            </div>

            <div className="rounded-xl p-3 border border-[#2b3f78] bg-[#101b3b]/90 hover:border-[#4b66ae] transition-colors shadow-sm">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">EXPERIENCE</div>
              <div className="text-xs font-bold text-[#ddd7ff] mt-0.5 truncate">
                {data.experiences?.[0]?.companyName?.toUpperCase() || 'DEVELOPER'}
              </div>
            </div>

            <div className="rounded-xl p-3 border border-[#2b3f78] bg-[#101b3b]/90 hover:border-[#4b66ae] transition-colors shadow-sm">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">STATUS</div>
              <div className="text-xs font-bold text-[#8cb0fd] mt-0.5 truncate">
                {data.statusText?.toUpperCase() || 'ACTIVE'}
              </div>
            </div>

            <div className="rounded-xl p-3 border border-[#2b3f78] bg-[#101b3b]/90 hover:border-[#4b66ae] transition-colors shadow-sm">
              <div className="text-[10px] text-[#7a90c5] uppercase tracking-wider">EDUCATION</div>
              <div className="text-xs font-bold text-white mt-0.5 truncate">
                {data.educations?.[0]?.degree?.toUpperCase() || 'DEGREE'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

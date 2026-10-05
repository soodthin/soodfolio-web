'use client';

interface DeveloperNotFoundProps {
  username: string;
}

export function DeveloperNotFound({ username }: DeveloperNotFoundProps) {
  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center p-6 bg-[#0b1124] text-[#ebe7ff]">
      {/* Background radial aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(95,75,170,0.35),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2d427b] bg-[#0c142e]/90 backdrop-blur-md p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center space-y-6">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f8c076]/40 bg-[#162248] text-[#f8c076] font-mono text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[#f8c076] animate-ping" />
          <span>HTTP 404 / NOT FOUND</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-sans font-bold uppercase tracking-tight text-white">
            USER NOT FOUND
          </h1>
          <p className="font-mono text-sm sm:text-base text-[#8cb0fd]">
            The portfolio <span className="text-[#f8c076] font-bold">@{username}</span> does not exist or has not been published yet.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[#9ab0dc] font-sans leading-relaxed max-w-md mx-auto">
          Are you this developer? You can claim this handle right now and build your interactive slide deck portfolio in minutes.
        </p>

        <div className="border-b border-[#1f2f5c] my-4" />

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <a
            href="/alex"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#3b5496] bg-[#14234d] hover:border-[#8cb0fd] text-[#8cb0fd] hover:text-white transition-all font-semibold"
          >
            [ View Demo: @alex ]
          </a>
          <a
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#f8c076] text-[#060a14] font-bold hover:bg-[#ffcf8e] transition-all shadow-[0_0_20px_rgba(248,192,118,0.3)]"
          >
            [ Claim @{username} on SoodFolio ]
          </a>
        </div>
      </div>
    </div>
  );
}

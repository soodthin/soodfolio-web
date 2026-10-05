'use client';

import { useState } from 'react';
import { PortfolioData } from '@/types/portfolio';

interface ContactProps {
  data: PortfolioData;
  slideNumber?: string;
  onSelectSlide?: (index: number) => void;
}

export function Contact({ data, slideNumber = '07', onSelectSlide }: ContactProps) {
  const [copied, setCopied] = useState(false);

  const emailLink = data.socialLinks?.find((s) => s.platform.toUpperCase() === 'EMAIL');
  const emailAddress = emailLink?.url?.replace('mailto:', '') || '';

  const handleCopyEmail = () => {
    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer id="contact" className="w-full max-w-5xl my-auto flex flex-col justify-center py-2 sm:py-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#f8c076] tracking-wider">{slideNumber}</span>
        <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-wider text-[#f1edff]">
          CONTACT &amp; NETWORK
        </h2>
        <div className="flex-1 border-b border-[#213364]" />
      </div>

      <div className="rounded-2xl p-5 sm:p-8 border border-[#2b3f78] bg-[#0c142e]/95 backdrop-blur-md shadow-[0_20px_50px_rgba(8,14,35,0.95)] space-y-6">
        {/* Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2f5c]">
          <div>
            <span className="text-xs font-mono tracking-wider text-[#f8c076] font-semibold uppercase">
              STATUS
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm sm:text-base font-sans font-bold text-white uppercase">
                {data.statusText || 'AVAILABLE FOR COLLABORATION'}
              </span>
            </div>
          </div>

          {emailAddress && (
            <div className="flex items-center gap-2 font-mono text-xs">
              <a
                href={`mailto:${emailAddress}`}
                className="px-4 py-2 rounded-lg bg-[#f8c076] text-[#060a14] font-bold hover:bg-[#ffcf8e] transition-colors"
              >
                Send Direct Email ↗
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-2 rounded-lg border border-[#2f4684] bg-[#14234d] text-[#8cb0fd] hover:text-white transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Social Links Grid */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#7a90c5] uppercase tracking-wider">
              Connected Profiles &amp; Handles
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#23376a] bg-[#0e193d] p-3 hover:border-[#f8c076] hover:bg-[#152554] transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#8cb0fd] uppercase tracking-wider block">
                      {link.platform}
                    </span>
                    <span className="text-sm font-sans font-bold text-white group-hover:text-[#f8c076] transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <span className="text-[#8cb0fd] group-hover:text-[#f8c076] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-sm font-mono">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Credits & SoodFolio Platform Badge */}
        <div className="pt-4 border-t border-[#1f2f5c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#6c82b5]">
          <div>
            Built with{' '}
            <span className="text-[#f8c076] font-bold">SoodFolio</span> — Minimalist Slide Deck Platform
          </div>
          <div className="flex items-center gap-3">
            {onSelectSlide && (
              <button
                type="button"
                onClick={() => onSelectSlide(0)}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                [ Back to Top ]
              </button>
            )}
            <a
              href="/"
              className="hover:text-[#f8c076] transition-colors"
            >
              [ Create Yours ]
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

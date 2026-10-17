'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Check, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  FolderGit2,
  Calendar
} from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface PortfolioPrintDossierProps {
  data: PortfolioData;
  autoPrint?: boolean;
}

export function PortfolioPrintDossier({ data, autoPrint = false }: PortfolioPrintDossierProps) {
  const [downloadingJson, setDownloadingJson] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    setDownloadingJson(true);
    try {
      const exportPayload = {
        exportVersion: '1.0',
        exportedAt: new Date().toISOString(),
        generator: 'SoodFolio Platform',
        portfolio: data,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `soodfolio-${data.username}-export.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } finally {
      setDownloadingJson(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.origin + `/preview/${data.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Group skills by category
  const skillsByCategory = (data.skills || []).reduce<Record<string, string[]>>((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {});

  const displayedName = data.fullName || data.title || data.username;

  return (
    <div className="min-h-screen bg-[#0e1017] text-slate-100 print:bg-white print:text-slate-900">
      {/* Print Specific CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm 12mm 14mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-dossier {
            background-color: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          .page-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}} />

      {/* Floating Action Bar (Hidden on Print) */}
      <nav className="no-print sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                Executive Dossier / PDF Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy live link"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Globe className="h-3.5 w-3.5 text-slate-400" />}
              <span className="hidden md:inline">Share Link</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              disabled={downloadingJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Tải sao lưu dạng JSON kỹ thuật"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Backup .JSON</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In / Lưu PDF (Save as PDF)</span>
            </button>
          </div>
        </div>

        {/* Browser Hint */}
        <div className="max-w-5xl mx-auto mt-2 text-[11px] font-mono text-slate-400/80 flex items-center gap-2 justify-center">
          <Sparkles className="h-3 w-3 text-teal-400 shrink-0" />
          <span>
            Gợi ý: Trong hộp thoại in của trình duyệt, chọn đích đến là <strong>&quot;Lưu dưới dạng PDF&quot; (Save as PDF)</strong> và tích chọn <strong>&quot;Đồ họa nền&quot; (Background graphics)</strong>.
          </span>
        </div>
      </nav>

      {/* Main Printable Container */}
      <main className="max-w-4xl mx-auto my-6 p-4 sm:p-8 print:p-0 print:my-0">
        <article className="print-dossier bg-[#11131a] border border-white/[0.08] print:border-none print:bg-white text-slate-200 print:text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-10">
          
          {/* Header & Identity */}
          <header className="page-break-avoid border-b border-white/[0.1] print:border-slate-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white print:text-slate-950 font-serif">
                  {displayedName}
                </h1>
                {data.statusText && (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/20 print:bg-slate-100 print:text-slate-700 print:border-slate-300 font-semibold">
                    {data.statusText}
                  </span>
                )}
              </div>

              {data.tagline && (
                <p className="text-base sm:text-lg font-medium text-teal-400 print:text-teal-700 tracking-wide">
                  {data.tagline}
                </p>
              )}

              {data.bio && (
                <p className="text-sm text-slate-300 print:text-slate-600 max-w-2xl leading-relaxed pt-1">
                  {data.bio}
                </p>
              )}

              {/* Metadata Badges / Contact Links */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-mono text-slate-400 print:text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-teal-400 print:text-teal-600" />
                  <span>soodfolio.dev/{data.username}</span>
                </span>

                {(data.socialLinks || []).map((link, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span className="text-slate-600 print:text-slate-400">•</span>
                    <span className="font-semibold">{link.platform}:</span>
                    <span>{link.url}</span>
                  </span>
                ))}
              </div>
            </div>

            {data.avatarUrl && (
              <div className="shrink-0 self-start md:self-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.avatarUrl}
                  alt={displayedName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 print:border-slate-300 shadow-md"
                />
              </div>
            )}
          </header>

          {/* Section: Technical & Core Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="page-break-avoid space-y-4">
              <div className="flex items-center gap-2 border-b border-white/[0.08] print:border-slate-200 pb-2">
                <Layers className="h-4 w-4 text-teal-400 print:text-teal-600" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white print:text-slate-900 font-mono">
                  Kỹ Năng & Công Nghệ Trọng Tâm (Core Competencies)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-500 font-mono">
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.05] print:bg-slate-100 text-slate-200 print:text-slate-800 border border-white/[0.08] print:border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Professional Experience */}
          {(data.experiences || []).length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-white/[0.08] print:border-slate-200 pb-2">
                <Briefcase className="h-4 w-4 text-teal-400 print:text-teal-600" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white print:text-slate-900 font-mono">
                  Kinh Nghiệm Làm Việc (Work Experience)
                </h2>
              </div>

              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="page-break-avoid space-y-2 border-l-2 border-teal-500/40 print:border-teal-600 pl-4">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <h3 className="text-base font-bold text-white print:text-slate-900">
                          {exp.roleTitle}
                        </h3>
                        <p className="text-sm font-semibold text-teal-400 print:text-teal-700">
                          {exp.companyName}
                          {exp.location && (
                            <span className="text-xs font-normal text-slate-400 print:text-slate-500 ml-2">
                              ({exp.location})
                            </span>
                          )}
                        </p>
                      </div>

                      {exp.periodText && (
                        <span className="text-xs font-mono text-slate-400 print:text-slate-500 flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span>{exp.periodText}</span>
                        </span>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm text-slate-300 print:text-slate-600 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 print:text-slate-600 leading-relaxed">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="leading-normal">{h}</li>
                        ))}
                      </ul>
                    )}

                    {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.skillsUsed.map((sk, skIdx) => (
                          <span
                            key={skIdx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] print:bg-slate-100 text-slate-300 print:text-slate-700 border border-white/[0.06] print:border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Featured Projects */}
          {(data.projects || []).length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-white/[0.08] print:border-slate-200 pb-2">
                <FolderGit2 className="h-4 w-4 text-teal-400 print:text-teal-600" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white print:text-slate-900 font-mono">
                  Dự Án Tiêu Biểu (Featured Projects)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="page-break-avoid p-4 rounded-xl bg-white/[0.03] print:bg-slate-50 border border-white/[0.06] print:border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-bold text-white print:text-slate-900">
                        {proj.title}
                      </h3>
                      {proj.periodText && (
                        <span className="text-[11px] font-mono text-slate-400 print:text-slate-500">
                          {proj.periodText}
                        </span>
                      )}
                    </div>

                    {proj.subtitle && (
                      <p className="text-xs font-medium text-teal-400 print:text-teal-700">
                        {proj.subtitle}
                      </p>
                    )}

                    {proj.description && (
                      <p className="text-xs text-slate-300 print:text-slate-600 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>
                    )}

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] print:bg-white text-slate-300 print:text-slate-700 border border-white/[0.06] print:border-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-mono text-slate-400 print:text-slate-600">
                      {proj.liveUrl && (
                        <span>Live: {proj.liveUrl}</span>
                      )}
                      {proj.githubUrl && (
                        <span>Repo: {proj.githubUrl}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Education & Certifications */}
          {(data.educations || []).length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/[0.08] print:border-slate-200 pb-2">
                <GraduationCap className="h-4 w-4 text-teal-400 print:text-teal-600" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white print:text-slate-900 font-mono">
                  Học Vấn & Chứng Chỉ (Education & Academics)
                </h2>
              </div>

              <div className="space-y-4">
                {data.educations.map((edu) => (
                  <div key={edu.id} className="page-break-avoid flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-l-2 border-teal-500/30 print:border-teal-600 pl-4 py-1">
                    <div>
                      <h3 className="text-sm font-bold text-white print:text-slate-900">
                        {edu.institution}
                      </h3>
                      <p className="text-xs text-teal-400 print:text-teal-700 font-medium">
                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' • ')}
                      </p>
                      {edu.highlights && (
                        <p className="text-xs text-slate-400 print:text-slate-600 pt-1">
                          {edu.highlights}
                        </p>
                      )}
                    </div>

                    {edu.periodText && (
                      <span className="text-xs font-mono text-slate-400 print:text-slate-500 shrink-0">
                        {edu.periodText}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dossier Footer */}
          <footer className="page-break-avoid border-t border-white/[0.08] print:border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 print:text-slate-400 gap-2">
            <div>
              <span>Xuất bản từ SoodFolio Platform • Hồ sơ chuẩn A4</span>
            </div>
            <div>
              <span>Xem Slide Deck tương tác trực tiếp: soodfolio.dev/{data.username}</span>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}

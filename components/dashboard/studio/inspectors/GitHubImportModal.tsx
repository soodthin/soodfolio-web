'use client';

import React, { useState, useEffect } from 'react';
import { ProjectDto } from '@/types/portfolio';
import { fetchWithAuth } from '@/lib/apiClient';
import { API_BASE } from '@/lib/auth';
import {
  FolderGit2,
  X,
  Search,
  Star,
  GitFork,
  Download,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface GitHubRepoItem {
  name: string;
  fullName?: string;
  full_name?: string;
  description?: string | null;
  htmlUrl?: string;
  html_url?: string;
  homepage?: string | null;
  language?: string | null;
  topics?: string[];
  stargazersCount?: number;
  stargazers_count?: number;
  forksCount?: number;
  forks_count?: number;
  updatedAt?: string;
}

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectImported: (project: ProjectDto) => void;
  defaultUsername?: string;
}

export const GitHubImportModal: React.FC<GitHubImportModalProps> = ({
  isOpen,
  onClose,
  onProjectImported,
  defaultUsername = '',
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importingRepoName, setImportingRepoName] = useState<string | null>(null);
  const [importedRepos, setImportedRepos] = useState<Set<string>>(new Set());

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch repos when opened or username searched
  const fetchRepos = async (targetUser?: string) => {
    setLoading(true);
    setError(null);
    try {
      const userParam = targetUser !== undefined ? targetUser.trim() : username.trim();
      const queryUrl = userParam
        ? `${API_BASE}/portfolios/me/github/repos?username=${encodeURIComponent(userParam)}`
        : `${API_BASE}/portfolios/me/github/repos`;

      const res = await fetchWithAuth(queryUrl);
      if (res.ok) {
        const data: GitHubRepoItem[] = await res.json();
        setRepos(data);
        if (data.length === 0) {
          setError('Không tìm thấy repository công khai nào cho người dùng này.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.message || 'Không thể tải danh sách repository từ GitHub. Vui lòng kiểm tra lại username.');
      }
    } catch {
      setError('Lỗi kết nối máy chủ khi truy vấn GitHub. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const activeUser = defaultUsername.trim() || username.trim();
      if (defaultUsername.trim() && defaultUsername.trim() !== username) {
        setUsername(defaultUsername.trim());
      }
      if (activeUser) {
        fetchRepos(activeUser);
      } else {
        fetchRepos();
      }
    }
  }, [isOpen, defaultUsername]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepos(username);
  };

  const handleImport = async (repo: GitHubRepoItem) => {
    const repoName = repo.name;
    const githubUrl = repo.htmlUrl || repo.html_url || `https://github.com/${username || 'developer'}/${repoName}`;
    const liveUrl = repo.homepage || undefined;
    const description = repo.description || undefined;
    const language = repo.language || undefined;
    const topics = repo.topics || [];

    setImportingRepoName(repoName);
    try {
      const payload = {
        repoName,
        githubUrl,
        description,
        language,
        topics,
        liveUrl,
        role: 'Creator & Lead Developer',
        periodText: 'Present',
      };

      const res = await fetchWithAuth(`${API_BASE}/portfolios/me/projects/import-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created: ProjectDto = await res.json();
        setImportedRepos((prev) => new Set(prev).add(repoName));
        onProjectImported(created);
      } else {
        // Fallback local creation if API returned non-200
        const localCreated: ProjectDto = {
          id: `proj-gh-${Date.now()}`,
          title: repoName,
          subtitle: language ? `Dự án mã nguồn mở ${language}` : 'Dự án mã nguồn mở',
          role: 'Creator & Lead Developer',
          periodText: 'Present',
          description: description || 'Repository công khai được import tự động từ GitHub.',
          techStack: language ? [language, ...topics.slice(0, 4)] : topics.slice(0, 5),
          githubUrl,
          liveUrl,
        };
        setImportedRepos((prev) => new Set(prev).add(repoName));
        onProjectImported(localCreated);
      }
    } catch {
      const localCreated: ProjectDto = {
        id: `proj-gh-${Date.now()}`,
        title: repoName,
        subtitle: language ? `Dự án mã nguồn mở ${language}` : 'Dự án mã nguồn mở',
        role: 'Creator & Lead Developer',
        periodText: 'Present',
        description: description || 'Repository công khai được import tự động từ GitHub.',
        techStack: language ? [language, ...topics.slice(0, 4)] : topics.slice(0, 5),
        githubUrl,
        liveUrl,
      };
      setImportedRepos((prev) => new Set(prev).add(repoName));
      onProjectImported(localCreated);
    } finally {
      setImportingRepoName(null);
    }
  };

  if (!isOpen) return null;

  const filteredRepos = repos.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-import-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
              <FolderGit2 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="github-import-dialog-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Import Repository từ GitHub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tự động lấy thông tin mô tả, ngôn ngữ, topics và link demo để tạo Slide dự án.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại import GitHub"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Username query bar & search input */}
        <div className="space-y-2 flex-shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-sans font-medium">github.com/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full pl-24 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-sans font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-teal-500/20 disabled:opacity-50 flex-shrink-0"
              aria-label="Tìm kiếm repositories của tài khoản GitHub"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              <span>Tải Repos</span>
            </button>
          </form>

          {repos.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Lọc nhanh theo tên repo hoặc công nghệ..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-sans font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Repositories List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[200px]">
          {loading ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-sans">
              <Loader2 className="h-6 w-6 animate-spin text-teal-500 dark:text-teal-400" />
              <span>Đang kết nối GitHub và nạp danh sách repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-sans border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <FolderGit2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
              <span>{repos.length === 0 ? 'Nhập username GitHub và bấm "Tải Repos"' : 'Không có repository nào khớp với bộ lọc'}</span>
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const repoName = repo.name;
              const isImported = importedRepos.has(repoName);
              const isImporting = importingRepoName === repoName;
              const stars = repo.stargazersCount ?? repo.stargazers_count ?? 0;
              const forks = repo.forksCount ?? repo.forks_count ?? 0;
              const url = repo.htmlUrl || repo.html_url || `https://github.com/${username || 'developer'}/${repoName}`;

              return (
                <div
                  key={repoName}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/[0.07] hover:border-teal-500/30 dark:hover:border-teal-400/30 transition-all flex flex-col gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                          {repoName}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          title="Mở trên GitHub"
                          aria-label={`Mở repository ${repoName} trên GitHub`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      {repo.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isImported || isImporting}
                      onClick={() => handleImport(repo)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer flex-shrink-0 ${
                        isImported
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm shadow-teal-500/20 disabled:opacity-50'
                      }`}
                      aria-label={`Import repository ${repoName} vào slide deck`}
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Đang import...</span>
                        </>
                      ) : isImported ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                          <span>Đã import</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Import 1-Click</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Metadata Tags: Language, Stars, Forks, Topics */}
                  <div className="flex items-center flex-wrap gap-2 text-xs font-sans text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-white/[0.04]">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400 font-medium text-[11px] border border-teal-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
                        <span>{repo.language}</span>
                      </span>
                    )}

                    {stars > 0 && (
                      <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400 font-medium text-[11px] tabular-nums">
                        <Star className="h-3 w-3 fill-amber-500 dark:fill-amber-400" />
                        <span>{stars}</span>
                      </span>
                    )}

                    {forks > 0 && (
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px] tabular-nums">
                        <GitFork className="h-3 w-3" />
                        <span>{forks}</span>
                      </span>
                    )}

                    {repo.topics &&
                      repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                        >
                          #{topic}
                        </span>
                      ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans flex-shrink-0">
          <span>Đã tìm thấy <strong className="text-slate-900 dark:text-white tabular-nums">{filteredRepos.length}</strong> repositories</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 font-sans font-medium cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

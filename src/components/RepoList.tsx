"use client";

import { useState, useMemo } from "react";
import { GitHubRepo } from "@/types/github";
import { getLanguageColor } from "@/lib/github";
import {
  Star,
  GitFork,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Copy,
  Check,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface RepoListProps {
  repos: GitHubRepo[];
}

type SortOption = "stars" | "forks" | "updated" | "name";

export function RepoList({ repos }: RepoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [hideForks, setHideForks] = useState(false);
  const [copiedRepoId, setCopiedRepoId] = useState<number | null>(null);

  const filteredAndSortedRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        if (hideForks && repo.fork) return false;
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          repo.name.toLowerCase().includes(term) ||
          (repo.description && repo.description.toLowerCase().includes(term)) ||
          (repo.language && repo.language.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
        if (sortBy === "forks") return b.forks_count - a.forks_count;
        if (sortBy === "updated") {
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        }
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [repos, searchTerm, sortBy, hideForks]);

  const handleCopyClone = (repo: GitHubRepo) => {
    const cloneUrl = `git clone ${repo.html_url}.git`;
    navigator.clipboard.writeText(cloneUrl);
    setCopiedRepoId(repo.id);
    setTimeout(() => setCopiedRepoId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Public Repositories</h3>
          <p className="text-xs text-zinc-400">
            Showing {filteredAndSortedRepos.length} of {repos.length} repositories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search repos */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter repositories..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort repositories by"
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="stars" className="bg-zinc-900 text-white">Most Stars</option>
              <option value="forks" className="bg-zinc-900 text-white">Most Forks</option>
              <option value="updated" className="bg-zinc-900 text-white">Recently Pushed</option>
              <option value="name" className="bg-zinc-900 text-white">Name (A-Z)</option>
            </select>
          </div>

          {/* Fork filter toggle */}
          <button
            type="button"
            onClick={() => setHideForks(!hideForks)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
              hideForks
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                : "border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {hideForks ? "Hiding Forks" : "Include Forks"}
          </button>
        </div>
      </div>

      {/* Grid of Repository Cards */}
      {filteredAndSortedRepos.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-zinc-500 mx-auto" />
          <p className="text-zinc-300 font-medium">No repositories match your criteria.</p>
          <p className="text-zinc-500 text-xs">Try adjusting your search keywords or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedRepos.map((repo) => {
            const updatedDate = new Date(repo.pushed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={repo.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl transition hover:border-zinc-700 hover:bg-zinc-900/70 shadow-lg shadow-black/20"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white text-base tracking-tight hover:text-cyan-400 transition inline-flex items-center gap-1.5 truncate group-hover:underline"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                    </a>

                    {repo.fork && (
                      <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                        Fork
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 min-h-[2.5rem]">
                    {repo.description || "No description provided."}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-zinc-800/70 border border-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-300 font-mono"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Clone action */}
                <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span className="font-medium text-zinc-300">{repo.language}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                      <span>{repo.stargazers_count.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyClone(repo)}
                      title="Copy git clone command"
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                    >
                      {copiedRepoId === repo.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Clone</span>
                        </>
                      )}
                    </button>

                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      <span>{updatedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

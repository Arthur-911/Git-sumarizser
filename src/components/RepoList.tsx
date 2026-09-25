"use client";

import { useState, useMemo } from "react";
import { GitHubRepo } from "@/types/github";
import { AlertCircle } from "lucide-react";
import { RepoCard } from "./repos/RepoCard";
import { RepoFilters, SortOption } from "./repos/RepoFilters";

interface RepoListProps {
  repos: GitHubRepo[];
  selectedLanguage?: string | null;
  onClearLanguage?: () => void;
}

export function RepoList({ repos, selectedLanguage, onClearLanguage }: RepoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [hideForks, setHideForks] = useState(false);

  const filteredAndSortedRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        if (hideForks && repo.fork) return false;
        if (selectedLanguage && repo.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
          return false;
        }
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
  }, [repos, searchTerm, sortBy, hideForks, selectedLanguage]);

  return (
    <div className="space-y-6">
      <RepoFilters
        totalCount={repos.length}
        filteredCount={filteredAndSortedRepos.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hideForks={hideForks}
        onToggleHideForks={() => setHideForks(!hideForks)}
        selectedLanguage={selectedLanguage}
        onClearLanguage={onClearLanguage}
      />

      {/* Grid of Repository Cards */}
      {filteredAndSortedRepos.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center space-y-3 animate-fade-in">
          <AlertCircle className="h-8 w-8 text-zinc-500 mx-auto" />
          <p className="text-zinc-300 font-medium">No repositories match your criteria.</p>
          <p className="text-zinc-500 text-xs">Try adjusting your search keywords or filters.</p>
          {selectedLanguage && onClearLanguage && (
            <button
              type="button"
              onClick={onClearLanguage}
              className="mt-2 inline-flex text-xs font-semibold text-cyan-400 hover:underline"
            >
              Clear language filter ({selectedLanguage})
            </button>
          )}
        </div>
      ) : (
        <div
          key={`${searchTerm}-${sortBy}-${hideForks}-${selectedLanguage || "all"}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in"
        >
          {filteredAndSortedRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

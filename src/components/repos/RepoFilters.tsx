"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export type SortOption = "stars" | "forks" | "updated" | "name";

interface RepoFiltersProps {
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hideForks: boolean;
  onToggleHideForks: () => void;
  selectedLanguage?: string | null;
  onClearLanguage?: () => void;
}

export function RepoFilters({
  totalCount,
  filteredCount,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  hideForks,
  onToggleHideForks,
  selectedLanguage,
  onClearLanguage,
}: RepoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Public Repositories</h3>
          <p className="text-xs text-zinc-400">
            Showing {filteredCount} of {totalCount} repositories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search repos */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter repositories..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort repositories by"
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="stars" className="bg-zinc-900 text-white">
                Most Stars
              </option>
              <option value="forks" className="bg-zinc-900 text-white">
                Most Forks
              </option>
              <option value="updated" className="bg-zinc-900 text-white">
                Recently Pushed
              </option>
              <option value="name" className="bg-zinc-900 text-white">
                Name (A-Z)
              </option>
            </select>
          </div>

          {/* Fork filter toggle */}
          <button
            type="button"
            onClick={onToggleHideForks}
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

      {/* Active Language Filter Banner */}
      {selectedLanguage && (
        <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs text-cyan-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Filtering repositories by:</span>
            <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 font-mono font-semibold text-cyan-200">
              {selectedLanguage}
            </span>
          </div>
          {onClearLanguage && (
            <button
              type="button"
              onClick={onClearLanguage}
              className="rounded-lg bg-cyan-500/20 px-2.5 py-1 text-[11px] font-medium text-cyan-200 hover:bg-cyan-500/30 hover:text-white transition"
            >
              Show All Languages ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

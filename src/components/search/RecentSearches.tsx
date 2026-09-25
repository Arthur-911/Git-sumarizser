"use client";

import React from "react";

interface RecentSearchesProps {
  recentSearches: string[];
  presets: string[];
  onSelectUser: (user: string) => void;
  onClearHistory: () => void;
}

export function RecentSearches({
  recentSearches,
  presets,
  onSelectUser,
  onClearHistory,
}: RecentSearchesProps) {
  return (
    <div className="space-y-2">
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-500 font-medium">Recent:</span>
          {recentSearches.map((user) => (
            <button
              key={user}
              type="button"
              onClick={() => onSelectUser(user)}
              className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 font-mono text-cyan-300 transition hover:border-cyan-500 hover:bg-cyan-900/50 hover:text-white"
            >
              @{user}
            </button>
          ))}
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 underline ml-1"
          >
            clear
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
        <span className="text-zinc-500 font-medium">Quick inspect:</span>
        {presets.map((user) => (
          <button
            key={user}
            type="button"
            onClick={() => onSelectUser(user)}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-zinc-300 transition hover:border-cyan-500/50 hover:bg-zinc-800 hover:text-cyan-400"
          >
            @{user}
          </button>
        ))}
      </div>
    </div>
  );
}

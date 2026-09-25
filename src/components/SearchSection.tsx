"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchSectionProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const PRESET_USERS = ["shadcn", "torvalds", "leerob", "gaearon", "vercel"];

export function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [inputUsername, setInputUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      onSearch(inputUsername.trim());
    }
  };

  const handlePresetClick = (preset: string) => {
    setInputUsername(preset);
    onSearch(preset);
  };

  return (
    <section className="w-full max-w-3xl mx-auto text-center space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Inspect Any <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">GitHub Developer</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Instant deep analytics on repositories, star distribution, language usage, and activity statistics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative flex items-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter GitHub username (e.g. shadcn, torvalds)..."
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 pl-12 pr-32 py-3.5 text-sm sm:text-base text-white placeholder-zinc-500 shadow-xl shadow-black/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputUsername.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <span>Analyze</span>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
        <span className="text-zinc-500 font-medium">Quick inspect:</span>
        {PRESET_USERS.map((user) => (
          <button
            key={user}
            type="button"
            onClick={() => handlePresetClick(user)}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-zinc-300 transition hover:border-cyan-500/50 hover:bg-zinc-800 hover:text-cyan-400"
          >
            @{user}
          </button>
        ))}
      </div>
    </section>
  );
}

"use client";

import { LanguageStat } from "@/types/github";
import { PieChart } from "lucide-react";

interface LanguageBreakdownProps {
  languages: LanguageStat[];
}

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  if (languages.length === 0) {
    return null;
  }

  // Top 6 languages for clear presentation
  const displayedLanguages = languages.slice(0, 6);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-lg shadow-black/20 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Language Distribution</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {languages.length} {languages.length === 1 ? "language" : "languages"} detected
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-800/80 p-0.5 gap-0.5">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name}: ${lang.percentage}%`}
            style={{
              width: `${Math.max(lang.percentage, 2)}%`,
              backgroundColor: lang.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-80"
          />
        ))}
      </div>

      {/* Language Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayedLanguages.map((lang) => (
          <div
            key={lang.name}
            className="flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-xs font-semibold text-zinc-200 truncate">{lang.name}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold text-white">{lang.percentage}%</span>
              <span className="text-[11px] text-zinc-500">{lang.count} {lang.count === 1 ? "repo" : "repos"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

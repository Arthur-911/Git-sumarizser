"use client";

import { LanguageStat } from "@/types/github";
import { PieChart } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface LanguageBreakdownProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  onSelectLanguage?: (lang: string | null) => void;
}

export function LanguageBreakdown({
  languages,
  selectedLanguage,
  onSelectLanguage,
}: LanguageBreakdownProps) {
  if (languages.length === 0) {
    return null;
  }

  // Top 6 languages for clear presentation
  const displayedLanguages = languages.slice(0, 6);

  const handleToggleLanguage = (langName: string) => {
    if (!onSelectLanguage) return;
    if (selectedLanguage === langName) {
      onSelectLanguage(null);
    } else {
      onSelectLanguage(langName);
    }
  };

  return (
    <TiltCard maxTilt={2.5} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-lg shadow-black/20 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Language Distribution</h3>
          {selectedLanguage && (
            <span className="ml-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-medium text-cyan-400">
              Filtered: {selectedLanguage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          {selectedLanguage ? (
            <button
              type="button"
              onClick={() => onSelectLanguage && onSelectLanguage(null)}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Clear Filter
            </button>
          ) : (
            <span className="hidden sm:inline text-zinc-500 text-[11px]">
              Click language to filter repos
            </span>
          )}
          <span className="font-mono">
            {languages.length} {languages.length === 1 ? "language" : "languages"}
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar with Liquid Expand */}
      <div
        key={languages.map((l) => `${l.name}-${l.percentage}`).join("|")}
        className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-800/80 p-0.5 gap-0.5 animate-liquid-bar"
      >
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.name;
          return (
            <button
              type="button"
              key={lang.name}
              onClick={() => handleToggleLanguage(lang.name)}
              title={`${lang.name}: ${lang.percentage}% (Click to filter)`}
              style={{
                width: `${Math.max(lang.percentage, 2)}%`,
                backgroundColor: lang.color,
              }}
              className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-100 ${
                selectedLanguage && !isSelected ? "opacity-30" : "opacity-85"
              }`}
            />
          );
        })}
      </div>

      {/* Language Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayedLanguages.map((lang) => {
          const isSelected = selectedLanguage === lang.name;
          return (
            <button
              type="button"
              key={lang.name}
              onClick={() => handleToggleLanguage(lang.name)}
              className={`flex flex-col text-left rounded-xl p-3 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-2 border-cyan-500 bg-cyan-950/40 shadow-md shadow-cyan-500/10 scale-[1.03]"
                  : "border border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-xs font-semibold text-zinc-200 truncate">{lang.name}</span>
                </div>
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 animate-ping" />
                )}
              </div>
              <div className="mt-2 flex items-baseline justify-between w-full">
                <span className="text-lg font-bold text-white">{lang.percentage}%</span>
                <span className="text-[11px] text-zinc-500">
                  {lang.count} {lang.count === 1 ? "repo" : "repos"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </TiltCard>
  );
}

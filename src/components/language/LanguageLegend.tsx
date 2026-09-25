"use client";

import React from "react";
import { LanguageStat } from "@/types/github";

interface LanguageLegendProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  hoveredLang: LanguageStat | null;
  onToggleLanguage: (langName: string) => void;
  onHoverLang: (lang: LanguageStat | null) => void;
}

export function LanguageLegend({
  languages,
  selectedLanguage,
  hoveredLang,
  onToggleLanguage,
  onHoverLang,
}: LanguageLegendProps) {
  // Top 6 languages for clear presentation
  const displayedLanguages = languages.slice(0, 6);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
      {displayedLanguages.map((lang) => {
        const isSelected = selectedLanguage === lang.name;
        const isBarHovered = hoveredLang?.name === lang.name;

        return (
          <button
            type="button"
            key={lang.name}
            onClick={() => onToggleLanguage(lang.name)}
            onMouseEnter={() => onHoverLang(lang)}
            onMouseLeave={() => onHoverLang(null)}
            style={{
              borderColor: isSelected
                ? lang.color
                : isBarHovered
                ? `${lang.color}88`
                : undefined,
              boxShadow: isSelected
                ? `0 0 16px ${lang.color}33`
                : isBarHovered
                ? `0 0 10px ${lang.color}22`
                : undefined,
            }}
            className={`flex flex-col text-left rounded-xl p-3 transition-all duration-200 cursor-pointer relative overflow-hidden ${
              isSelected
                ? "border-2 bg-zinc-900/90 scale-[1.03] z-10"
                : isBarHovered
                ? "border bg-zinc-900/70 scale-[1.02]"
                : "border border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60"
            }`}
          >
            {/* Subtle top accent line using language color */}
            <div
              className="absolute top-0 inset-x-0 h-0.5 transition-opacity"
              style={{
                backgroundColor: lang.color,
                opacity: isSelected ? 1 : isBarHovered ? 0.8 : 0.25,
              }}
            />

            <div className="flex items-center justify-between gap-1 w-full">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                  style={{
                    backgroundColor: lang.color,
                    boxShadow: `0 0 6px ${lang.color}`,
                  }}
                />
                <span className="text-xs font-semibold text-zinc-200 truncate">
                  {lang.name}
                </span>
              </div>
              {isSelected && (
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0 animate-ping"
                  style={{ backgroundColor: lang.color }}
                />
              )}
            </div>

            <div className="mt-2 flex items-baseline justify-between w-full">
              <span className="text-lg font-bold text-white tracking-tight">
                {lang.percentage}%
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {lang.count} {lang.count === 1 ? "repo" : "repos"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { LanguageStat } from "@/types/github";

interface CyberRailBarProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  hoveredLang: LanguageStat | null;
  onToggleLanguage: (langName: string) => void;
  onHover: (lang: LanguageStat | null, posPercent: number | null) => void;
}

export function CyberRailBar({
  languages,
  selectedLanguage,
  hoveredLang,
  onToggleLanguage,
  onHover,
}: CyberRailBarProps) {
  return (
    <div className="relative h-8 w-full rounded-xl bg-zinc-950/90 border border-cyan-500/20 p-1 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.1),inset_0_2px_6px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Background grid line */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_100%] pointer-events-none" />

      {/* Sweep laser line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent w-1/4 animate-laser-scan pointer-events-none" />

      {languages.map((lang, idx) => {
        const isSelected = selectedLanguage === lang.name;
        const isHovered = hoveredLang?.name === lang.name;
        const isDimmed = selectedLanguage && !isSelected;

        const prevPct = languages
          .slice(0, idx)
          .reduce((acc, curr) => acc + curr.percentage, 0);
        const midPct = prevPct + lang.percentage / 2;

        return (
          <button
            type="button"
            key={lang.name}
            onClick={() => onToggleLanguage(lang.name)}
            onMouseEnter={() => onHover(lang, midPct)}
            onMouseLeave={() => onHover(null, null)}
            style={{
              width: `${Math.max(lang.percentage, 3)}%`,
              backgroundColor: lang.color,
              boxShadow: isSelected
                ? `0 0 16px ${lang.color}, inset 0 0 4px #ffffff`
                : isHovered
                ? `0 0 10px ${lang.color}`
                : undefined,
            }}
            className={`group relative h-full -skew-x-12 transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isSelected
                ? "ring-2 ring-cyan-300 brightness-125 z-10"
                : isHovered
                ? "brightness-125 scale-y-105"
                : isDimmed
                ? "opacity-20 grayscale"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            {/* Subtle diagonal tech hatch */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.12)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.12)_75%,transparent_75%,transparent)] bg-[size:6px_6px] pointer-events-none" />

            {lang.percentage >= 14 && (
              <span className="skew-x-12 relative z-10 text-[10px] font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate px-1">
                {lang.name} {lang.percentage}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

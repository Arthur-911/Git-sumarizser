"use client";

import React from "react";
import { LanguageStat } from "@/types/github";

interface CapsuleBarProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  hoveredLang: LanguageStat | null;
  onToggleLanguage: (langName: string) => void;
  onHover: (lang: LanguageStat | null, posPercent: number | null) => void;
}

export function CapsuleBar({
  languages,
  selectedLanguage,
  hoveredLang,
  onToggleLanguage,
  onHover,
}: CapsuleBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative h-7 w-full rounded-xl bg-zinc-950/80 border border-zinc-800/90 p-1 flex items-center gap-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)] overflow-hidden">
        {/* Subtle sweeping laser shimmer in the background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/3 animate-laser-scan pointer-events-none" />

        {languages.map((lang, idx) => {
          const isSelected = selectedLanguage === lang.name;
          const isHovered = hoveredLang?.name === lang.name;
          const isDimmed = selectedLanguage && !isSelected;

          // Cumulative midpoint for tooltip positioning
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
                width: `${Math.max(lang.percentage, 2.5)}%`,
                backgroundColor: lang.color,
                boxShadow: isSelected
                  ? `0 0 16px ${lang.color}99, inset 0 1px 1px rgba(255,255,255,0.6)`
                  : isHovered
                  ? `0 0 12px ${lang.color}66`
                  : undefined,
              }}
              className={`group relative h-full rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer ${
                isSelected
                  ? "ring-2 ring-white/90 scale-y-[1.14] z-20"
                  : isHovered
                  ? "scale-y-[1.08] z-10 brightness-110"
                  : isDimmed
                  ? "opacity-25 grayscale-[30%] hover:opacity-85 hover:grayscale-0"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              {/* Glass specular highlight on top half of capsule */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

              {/* Active Ping Beacon */}
              {isSelected && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              )}

              {/* Embedded label inside wide segments */}
              {lang.percentage >= 14 ? (
                <span className="relative z-10 px-1.5 text-[11px] font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate select-none">
                  {lang.name} <span className="opacity-80 font-normal">{lang.percentage}%</span>
                </span>
              ) : lang.percentage >= 8 ? (
                <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate select-none">
                  {lang.percentage}%
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

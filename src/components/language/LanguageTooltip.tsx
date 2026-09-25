"use client";

import React from "react";
import { LanguageStat } from "@/types/github";

interface LanguageTooltipProps {
  hoveredLang: LanguageStat | null;
  hoverPosPercent: number | null;
  selectedLanguage?: string | null;
}

export function LanguageTooltip({
  hoveredLang,
  hoverPosPercent,
  selectedLanguage,
}: LanguageTooltipProps) {
  if (!hoveredLang || hoverPosPercent === null) {
    return null;
  }

  return (
    <div
      className="absolute -top-4 pointer-events-none z-30 transition-all duration-150 animate-tooltip-pop"
      style={{
        left: `${Math.min(Math.max(hoverPosPercent, 12), 88)}%`,
      }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/95 border border-zinc-700/90 shadow-[0_8px_20px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs whitespace-nowrap">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white/20 animate-pulse"
          style={{ backgroundColor: hoveredLang.color }}
        />
        <span className="font-bold text-white">{hoveredLang.name}</span>
        <span className="font-mono font-semibold text-cyan-300">
          {hoveredLang.percentage}%
        </span>
        <span className="text-[10px] text-zinc-400">
          ({hoveredLang.count} {hoveredLang.count === 1 ? "repo" : "repos"})
        </span>
        <span className="text-[10px] text-zinc-500 pl-1 border-l border-zinc-800">
          {selectedLanguage === hoveredLang.name ? "Active filter" : "Click to filter"}
        </span>
      </div>
      {/* Tooltip Chevron */}
      <div className="w-2 h-2 bg-zinc-950 border-r border-b border-zinc-700/90 rotate-45 mx-auto -mt-1" />
    </div>
  );
}

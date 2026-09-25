"use client";

import { useState } from "react";
import { LanguageStat } from "@/types/github";
import { PieChart, Waves, Layers, Activity, Zap, Filter } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { LiquidLanguageBar } from "./LiquidLanguageBar";

interface LanguageBreakdownProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  onSelectLanguage?: (lang: string | null) => void;
}

type VisualMode = "liquid" | "capsule" | "spectrum" | "cyber-rail";

export function LanguageBreakdown({
  languages,
  selectedLanguage,
  onSelectLanguage,
}: LanguageBreakdownProps) {
  // Default to the new interactive liquid physics wave bar!
  const [visualMode, setVisualMode] = useState<VisualMode>("liquid");
  const [hoveredLang, setHoveredLang] = useState<LanguageStat | null>(null);
  const [hoverPosPercent, setHoverPosPercent] = useState<number | null>(null);

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

  // Generate 48 equalizer bars mapped proportionally to languages
  const totalEqualizerBars = 48;
  const equalizerBars: { lang: LanguageStat; heightClass: string; animDelay: string }[] = [];
  let allocated = 0;

  languages.forEach((lang, langIdx) => {
    const barCount =
      langIdx === languages.length - 1
        ? totalEqualizerBars - allocated
        : Math.max(1, Math.round((lang.percentage / 100) * totalEqualizerBars));
    allocated += barCount;

    const waveHeights = ["h-3", "h-5", "h-7", "h-8", "h-6", "h-4", "h-7", "h-5"];

    for (let i = 0; i < barCount; i++) {
      if (equalizerBars.length < totalEqualizerBars) {
        equalizerBars.push({
          lang,
          heightClass: waveHeights[(i + langIdx * 3) % waveHeights.length],
          animDelay: `${((i * 0.08) % 1.2).toFixed(2)}s`,
        });
      }
    }
  });

  return (
    <TiltCard
      maxTilt={2.5}
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-lg shadow-black/20 space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Language Distribution
              </h3>
              {selectedLanguage && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] animate-pulse">
                  <Filter className="h-3 w-3" />
                  Filtered: {selectedLanguage}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Interactive codebase stack breakdown across repositories
            </p>
          </div>
        </div>

        {/* Mode Selector & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visual Style Mode Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <button
              type="button"
              onClick={() => setVisualMode("liquid")}
              title="Liquid Physics Wave Bar"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                visualMode === "liquid"
                  ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Waves className="h-3 w-3" />
              <span className="hidden sm:inline">Liquid</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode("capsule")}
              title="Capsule Glass Bar"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                visualMode === "capsule"
                  ? "bg-zinc-800 text-cyan-300 shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span className="hidden sm:inline">Capsule</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode("spectrum")}
              title="Audio Equalizer Spectrum"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                visualMode === "spectrum"
                  ? "bg-zinc-800 text-cyan-300 shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Activity className="h-3 w-3" />
              <span className="hidden sm:inline">Spectrum</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode("cyber-rail")}
              title="Cyber Reactor Rail"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                visualMode === "cyber-rail"
                  ? "bg-zinc-800 text-cyan-300 shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Cyber Rail</span>
            </button>
          </div>

          {selectedLanguage && (
            <button
              type="button"
              onClick={() => onSelectLanguage && onSelectLanguage(null)}
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-medium cursor-pointer"
            >
              Reset
            </button>
          )}

          <span className="font-mono text-xs text-zinc-500 bg-zinc-950/60 px-2 py-1 rounded-md border border-zinc-800/60">
            {languages.length} {languages.length === 1 ? "lang" : "langs"}
          </span>
        </div>
      </div>

      {/* Main Interactive Bar Container */}
      <div className="relative pt-6 pb-2">
        {/* Floating HUD Tooltip */}
        {hoveredLang && hoverPosPercent !== null && (
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
        )}

        {/* STYLE 1: Liquid Physics Wave Bar (Primary Star Feature) */}
        {visualMode === "liquid" && (
          <LiquidLanguageBar
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={onSelectLanguage}
            onHoverLanguage={(lang, posPercent) => {
              setHoveredLang(lang);
              setHoverPosPercent(posPercent);
            }}
          />
        )}

        {/* STYLE 2: 3D Capsule Glass Bar */}
        {visualMode === "capsule" && (
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
                    onClick={() => handleToggleLanguage(lang.name)}
                    onMouseEnter={() => {
                      setHoveredLang(lang);
                      setHoverPosPercent(midPct);
                    }}
                    onMouseLeave={() => {
                      setHoveredLang(null);
                      setHoverPosPercent(null);
                    }}
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
        )}

        {/* STYLE 3: Audio Equalizer Spectrum (Pulsating Frequency Visualizer) */}
        {visualMode === "spectrum" && (
          <div className="relative h-12 w-full rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-2.5 flex items-end justify-between gap-[3px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] overflow-hidden">
            {equalizerBars.map((bar, idx) => {
              const isSelected = selectedLanguage === bar.lang.name;
              const isHovered = hoveredLang?.name === bar.lang.name;
              const isDimmed = selectedLanguage && !isSelected;

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleToggleLanguage(bar.lang.name)}
                  onMouseEnter={() => {
                    setHoveredLang(bar.lang);
                    setHoverPosPercent((idx / totalEqualizerBars) * 100);
                  }}
                  onMouseLeave={() => {
                    setHoveredLang(null);
                    setHoverPosPercent(null);
                  }}
                  style={{
                    backgroundColor: bar.lang.color,
                    boxShadow: isSelected
                      ? `0 0 10px ${bar.lang.color}`
                      : isHovered
                      ? `0 0 6px ${bar.lang.color}`
                      : undefined,
                    animationDelay: bar.animDelay,
                  }}
                  className={`flex-1 rounded-t-sm transition-all duration-200 cursor-pointer ${
                    bar.heightClass
                  } ${
                    isSelected
                      ? "ring-1 ring-white brightness-125 z-10"
                      : isHovered
                      ? "brightness-125 scale-y-110"
                      : isDimmed
                      ? "opacity-20 grayscale"
                      : "opacity-85 hover:opacity-100"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* STYLE 4: Cyber Reactor Rail (Slanted Sci-Fi Angled Segments) */}
        {visualMode === "cyber-rail" && (
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
                  onClick={() => handleToggleLanguage(lang.name)}
                  onMouseEnter={() => {
                    setHoveredLang(lang);
                    setHoverPosPercent(midPct);
                  }}
                  onMouseLeave={() => {
                    setHoveredLang(null);
                    setHoverPosPercent(null);
                  }}
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
        )}

        {/* Precision Ruler / Calibration Ticks */}
        <div className="relative mt-2 flex justify-between items-center px-1 text-[10px] font-mono text-zinc-500 select-none">
          <div className="flex flex-col items-center">
            <span className="h-1 w-px bg-zinc-700" />
            <span className="mt-0.5">0%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-1 w-px bg-zinc-700" />
            <span className="mt-0.5">25%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-1.5 w-px bg-cyan-500/60" />
            <span className="mt-0.5 text-zinc-400">50%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-1 w-px bg-zinc-700" />
            <span className="mt-0.5">75%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-1 w-px bg-zinc-700" />
            <span className="mt-0.5">100%</span>
          </div>
        </div>
      </div>

      {/* Language Chips with Bi-directional Hover Highlighting */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {displayedLanguages.map((lang) => {
          const isSelected = selectedLanguage === lang.name;
          const isBarHovered = hoveredLang?.name === lang.name;

          return (
            <button
              type="button"
              key={lang.name}
              onClick={() => handleToggleLanguage(lang.name)}
              onMouseEnter={() => setHoveredLang(lang)}
              onMouseLeave={() => setHoveredLang(null)}
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
    </TiltCard>
  );
}

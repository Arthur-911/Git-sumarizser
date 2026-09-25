"use client";

import { useState } from "react";
import { LanguageStat } from "@/types/github";
import { PieChart, Waves, Layers, Activity, Zap, Filter } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { LiquidLanguageBar } from "./LiquidLanguageBar";
import { LanguageTooltip } from "./language/LanguageTooltip";
import { CapsuleBar } from "./language/CapsuleBar";
import { SpectrumBar } from "./language/SpectrumBar";
import { CyberRailBar } from "./language/CyberRailBar";
import { CalibrationTicks } from "./language/CalibrationTicks";
import { LanguageLegend } from "./language/LanguageLegend";

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
  const [visualMode, setVisualMode] = useState<VisualMode>("liquid");
  const [hoveredLang, setHoveredLang] = useState<LanguageStat | null>(null);
  const [hoverPosPercent, setHoverPosPercent] = useState<number | null>(null);

  if (languages.length === 0) {
    return null;
  }

  const handleToggleLanguage = (langName: string) => {
    if (!onSelectLanguage) return;
    if (selectedLanguage === langName) {
      onSelectLanguage(null);
    } else {
      onSelectLanguage(langName);
    }
  };

  const handleHover = (lang: LanguageStat | null, posPercent: number | null) => {
    setHoveredLang(lang);
    setHoverPosPercent(posPercent);
  };

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
        <LanguageTooltip
          hoveredLang={hoveredLang}
          hoverPosPercent={hoverPosPercent}
          selectedLanguage={selectedLanguage}
        />

        {visualMode === "liquid" && (
          <LiquidLanguageBar
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={onSelectLanguage}
            onHoverLanguage={handleHover}
          />
        )}

        {visualMode === "capsule" && (
          <CapsuleBar
            languages={languages}
            selectedLanguage={selectedLanguage}
            hoveredLang={hoveredLang}
            onToggleLanguage={handleToggleLanguage}
            onHover={handleHover}
          />
        )}

        {visualMode === "spectrum" && (
          <SpectrumBar
            languages={languages}
            selectedLanguage={selectedLanguage}
            hoveredLang={hoveredLang}
            onToggleLanguage={handleToggleLanguage}
            onHover={handleHover}
          />
        )}

        {visualMode === "cyber-rail" && (
          <CyberRailBar
            languages={languages}
            selectedLanguage={selectedLanguage}
            hoveredLang={hoveredLang}
            onToggleLanguage={handleToggleLanguage}
            onHover={handleHover}
          />
        )}

        <CalibrationTicks />
      </div>

      {/* Language Chips with Bi-directional Hover Highlighting */}
      <LanguageLegend
        languages={languages}
        selectedLanguage={selectedLanguage}
        hoveredLang={hoveredLang}
        onToggleLanguage={handleToggleLanguage}
        onHoverLang={setHoveredLang}
      />
    </TiltCard>
  );
}

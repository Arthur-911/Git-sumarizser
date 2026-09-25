"use client";

import React, { useMemo } from "react";
import { LanguageStat } from "@/types/github";

interface SpectrumBarProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  hoveredLang: LanguageStat | null;
  onToggleLanguage: (langName: string) => void;
  onHover: (lang: LanguageStat | null, posPercent: number | null) => void;
}

export function SpectrumBar({
  languages,
  selectedLanguage,
  hoveredLang,
  onToggleLanguage,
  onHover,
}: SpectrumBarProps) {
  const totalEqualizerBars = 48;

  const equalizerBars = useMemo(() => {
    const bars: { lang: LanguageStat; heightClass: string; animDelay: string }[] = [];
    let allocated = 0;

    languages.forEach((lang, langIdx) => {
      const barCount =
        langIdx === languages.length - 1
          ? totalEqualizerBars - allocated
          : Math.max(1, Math.round((lang.percentage / 100) * totalEqualizerBars));
      allocated += barCount;

      const waveHeights = ["h-3", "h-5", "h-7", "h-8", "h-6", "h-4", "h-7", "h-5"];

      for (let i = 0; i < barCount; i++) {
        if (bars.length < totalEqualizerBars) {
          bars.push({
            lang,
            heightClass: waveHeights[(i + langIdx * 3) % waveHeights.length],
            animDelay: `${((i * 0.08) % 1.2).toFixed(2)}s`,
          });
        }
      }
    });

    return bars;
  }, [languages]);

  return (
    <div className="relative h-12 w-full rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-2.5 flex items-end justify-between gap-[3px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] overflow-hidden">
      {equalizerBars.map((bar, idx) => {
        const isSelected = selectedLanguage === bar.lang.name;
        const isHovered = hoveredLang?.name === bar.lang.name;
        const isDimmed = selectedLanguage && !isSelected;

        return (
          <button
            type="button"
            key={idx}
            onClick={() => onToggleLanguage(bar.lang.name)}
            onMouseEnter={() => {
              onHover(bar.lang, (idx / totalEqualizerBars) * 100);
            }}
            onMouseLeave={() => {
              onHover(null, null);
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
  );
}

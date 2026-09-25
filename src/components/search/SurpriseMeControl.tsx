"use client";

import React, { useState } from "react";
import { Dices } from "lucide-react";
import {
  getRandomSurpriseUser,
  FollowerTierId,
  SurpriseResult,
} from "@/lib/surpriseUsers";

interface SurpriseMeControlProps {
  isLoading: boolean;
  currentUsername: string;
  onSelectUser: (username: string) => void;
}

export function SurpriseMeControl({
  isLoading,
  currentUsername,
  onSelectUser,
}: SurpriseMeControlProps) {
  const [selectedTier, setSelectedTier] = useState<FollowerTierId>("all");
  const [lastSurprise, setLastSurprise] = useState<SurpriseResult | null>(null);

  const handleSurpriseMe = (tierOverride?: FollowerTierId) => {
    const tierToUse = tierOverride ?? selectedTier;
    const result = getRandomSurpriseUser(tierToUse, currentUsername);
    setLastSurprise(result);
    onSelectUser(result.username);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 pt-1">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handleSurpriseMe()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/60 hover:text-white transition shadow-sm shadow-cyan-500/10 group"
        >
          <Dices className="h-4 w-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>🎲 Surprise Me (Full Random)</span>
        </button>

        <div className="inline-flex items-center p-0.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-[11px] overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSelectedTier("all")}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "all"
                ? "bg-zinc-800 text-cyan-400 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Full random across all follower counts (0 to 100k+)"
          >
            All (0 to 100k+)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier("zero");
              handleSurpriseMe("zero");
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "zero"
                ? "bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-500/30"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
            title="New developers, students, 0-5 followers"
          >
            0 Followers
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier("low");
              handleSurpriseMe("low");
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "low"
                ? "bg-cyan-950/80 text-cyan-400 font-semibold border border-cyan-500/30"
                : "text-zinc-400 hover:text-cyan-400"
            }`}
            title="Coders & tool builders, ~10 followers"
          >
            ~10
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier("medium");
              handleSurpriseMe("medium");
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "medium"
                ? "bg-blue-950/80 text-blue-400 font-semibold border border-blue-500/30"
                : "text-zinc-400 hover:text-blue-400"
            }`}
            title="Open source contributors, ~100 followers"
          >
            ~100
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier("high");
              handleSurpriseMe("high");
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "high"
                ? "bg-purple-950/80 text-purple-400 font-semibold border border-purple-500/30"
                : "text-zinc-400 hover:text-purple-400"
            }`}
            title="Popular library authors, ~1K followers"
          >
            ~1K
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier("mega");
              handleSurpriseMe("mega");
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              selectedTier === "mega"
                ? "bg-amber-950/80 text-amber-400 font-semibold border border-amber-500/30"
                : "text-zinc-400 hover:text-amber-400"
            }`}
            title="Famous creators, 10k+ followers"
          >
            10K+
          </button>
        </div>
      </div>

      {lastSurprise && (
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 animate-fade-in">
          <span className="text-zinc-500">Selected:</span>
          <span className="font-mono font-semibold text-cyan-400">@{lastSurprise.username}</span>
          <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700/50">
            {lastSurprise.badge}
          </span>
        </div>
      )}
    </div>
  );
}

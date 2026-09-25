"use client";

import { UserStats } from "@/types/github";
import { Star, GitFork, Code, BarChart3 } from "lucide-react";

interface StatsGridProps {
  stats: UserStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "Total Stars Earned",
      value: stats.totalStars.toLocaleString(),
      subtext: "Across analyzed repositories",
      icon: Star,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Forks",
      value: stats.totalForks.toLocaleString(),
      subtext: "Community contributions",
      icon: GitFork,
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Primary Language",
      value: stats.topLanguage,
      subtext: "Most frequently utilized",
      icon: Code,
      accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Avg Stars / Repo",
      value: stats.avgStarsPerRepo.toLocaleString(),
      subtext: "Repository popularity index",
      icon: BarChart3,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl transition hover:border-zinc-700 hover:bg-zinc-900/70 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{item.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-white">{item.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

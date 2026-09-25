"use client";

import { useState, useEffect } from "react";
import { UserStats } from "@/types/github";
import { Star, GitFork, Code, BarChart3 } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface StatsGridProps {
  stats: UserStats;
}

function AnimatedCounter({ target, duration = 900 }: { target: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out quartic curve: fast start, soft landing
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "Total Stars Earned",
      value: stats.totalStars,
      isNumeric: true,
      subtext: "Across analyzed repositories",
      icon: Star,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Forks",
      value: stats.totalForks,
      isNumeric: true,
      subtext: "Community contributions",
      icon: GitFork,
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Primary Language",
      value: stats.topLanguage,
      isNumeric: false,
      subtext: "Most frequently utilized",
      icon: Code,
      accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Avg Stars / Repo",
      value: stats.avgStarsPerRepo,
      isNumeric: true,
      subtext: "Repository popularity index",
      icon: BarChart3,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <TiltCard
            key={item.label}
            maxTilt={5}
            style={{ animationDelay: `${index * 80}ms` }}
            className="animate-cascade-up group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl transition hover:border-zinc-700 hover:bg-zinc-900/70 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{item.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-white">
                {item.isNumeric ? (
                  <AnimatedCounter target={Number(item.value)} />
                ) : (
                  item.value
                )}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{item.subtext}</p>
            </div>
          </TiltCard>
        );
      })}
    </div>
  );
}

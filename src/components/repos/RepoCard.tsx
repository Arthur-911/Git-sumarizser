"use client";

import React, { useState } from "react";
import { GitHubRepo } from "@/types/github";
import { getLanguageColor } from "@/lib/github";
import { Star, GitFork, ExternalLink, Copy, Check, Calendar } from "lucide-react";
import { TiltCard } from "../TiltCard";
import { SparkleBurst } from "./SparkleBurst";

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

export function RepoCard({ repo, index }: RepoCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const updatedDate = new Date(repo.pushed_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCopyClone = () => {
    const cloneUrl = `git clone ${repo.html_url}.git`;
    navigator.clipboard.writeText(cloneUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <TiltCard
      maxTilt={3}
      style={{ animationDelay: `${Math.min(index, 8) * 65}ms` }}
      className="animate-cascade-up group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl transition hover:border-zinc-700 hover:bg-zinc-900/70 shadow-lg shadow-black/20"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white text-base tracking-tight hover:text-cyan-400 transition inline-flex items-center gap-1.5 truncate group-hover:underline"
          >
            <span className="truncate">{repo.name}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition" />
          </a>

          {repo.fork && (
            <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              Fork
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-400 line-clamp-2 min-h-[2.5rem]">
          {repo.description || "No description provided."}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-zinc-800/70 border border-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-300 font-mono"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Meta & Clone action */}
      <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <span className="font-medium text-zinc-300">{repo.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5 text-zinc-500" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyClone}
            title="Copy git clone command"
            className="relative inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            {isCopied && <SparkleBurst />}
            {isCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400 animate-fade-in" />
                <span className="text-emerald-400 animate-fade-in">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Clone</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500">
            <Calendar className="h-3 w-3" />
            <span>{updatedDate}</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

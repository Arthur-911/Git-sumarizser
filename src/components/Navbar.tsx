"use client";

import { Activity, Sparkles } from "lucide-react";
import { GithubIcon } from "./Icons";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">GitPulse</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-400 border border-cyan-500/20">
                <Sparkles className="h-3 w-3" /> v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">GitHub Analytics & Profile Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub API</span>
          </a>
        </div>
      </div>
    </header>
  );
}

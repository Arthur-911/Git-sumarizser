"use client";

import { useState, useEffect, useSyncExternalStore, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { isValidGitHubUsername } from "@/lib/github";
import { SurpriseMeControl } from "./search/SurpriseMeControl";
import { RecentSearches } from "./search/RecentSearches";

interface SearchSectionProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const PRESET_USERS = ["shadcn", "torvalds", "leerob", "gaearon", "vercel"];

const ROTATING_ROLES = [
  "GitHub Developer",
  "Open Source Creator",
  "Software Engineer",
  "Tech Innovator",
  "Code Architect",
  "Frontend Artisan",
];

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getRecentSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem("gitpulse_recent_users") || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [inputUsername, setInputUsername] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleAnim, setRoleAnim] = useState<"idle" | "disappearing" | "reappearing">("idle");

  const recentStorageRaw = useSyncExternalStore(
    subscribeStorage,
    getRecentSnapshot,
    getServerSnapshot
  );

  const recentSearches = useMemo(() => {
    try {
      const parsed = JSON.parse(recentStorageRaw);
      return Array.isArray(parsed)
        ? (parsed
            .filter((item): item is string => typeof item === "string" && isValidGitHubUsername(item))
            .slice(0, 5))
        : [];
    } catch {
      return [];
    }
  }, [recentStorageRaw]);

  const saveRecentSearch = (user: string) => {
    try {
      const clean = user.trim().toLowerCase();
      if (!clean || !isValidGitHubUsername(clean)) return;
      const current = recentSearches.filter((u) => u.toLowerCase() !== clean);
      const updated = [clean, ...current].slice(0, 5);
      localStorage.setItem("gitpulse_recent_users", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("gitpulse_recent_users");
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore
    }
  };

  const handleTriggerSearch = (username: string) => {
    setInputUsername(username);
    saveRecentSearch(username);
    onSearch(username);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (roleAnim === "idle") {
      timer = setTimeout(() => {
        setRoleAnim("disappearing");
      }, 2800);
    } else if (roleAnim === "disappearing") {
      timer = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
        setRoleAnim("reappearing");
      }, 320);
    } else if (roleAnim === "reappearing") {
      timer = setTimeout(() => {
        setRoleAnim("idle");
      }, 380);
    }

    return () => clearTimeout(timer);
  }, [roleAnim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      handleTriggerSearch(inputUsername.trim());
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto text-center space-y-6">
      <div className="space-y-3">
        {/* Subtle Live Status Indicator Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-400 shadow-sm shadow-cyan-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Live GitHub Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white min-h-[4rem] sm:min-h-[4.5rem] flex flex-wrap items-center justify-center gap-x-2">
          <span>Inspect Any</span>
          <span className="inline-block relative">
            <span
              key={`${roleIndex}-${roleAnim}`}
              className={`inline-block bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent transition-all duration-300 ${
                roleAnim === "disappearing"
                  ? "animate-role-exit"
                  : roleAnim === "reappearing"
                  ? "animate-role-enter"
                  : "animate-role-idle"
              }`}
            >
              {ROTATING_ROLES[roleIndex]}
            </span>
          </span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Deep-dive into GitHub developers and repositories. Analyze tech stacks, track community stars, and generate profile markdown in seconds.
        </p>
      </div>

      {/* Search Input Box with Luminous Hover Glow */}
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
          {/* Subtle Ambient Behind-Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500 blur-xl pointer-events-none" />

          {/* Luminous Animated Border Beam */}
          <div className="absolute -inset-[1.5px] rounded-2xl bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#06b6d4_320deg,#38bdf8_360deg)] opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 animate-spin-slow transition-opacity duration-500 blur-[2px] pointer-events-none" />

          <div className="relative w-full rounded-2xl bg-zinc-900/90 shadow-xl shadow-black/40">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. shadcn, torvalds)..."
              className="w-full rounded-2xl border border-zinc-800 bg-transparent pl-12 pr-32 py-3.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:border-cyan-500/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputUsername.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[105px] gap-2 shadow-md shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </div>
        </form>

        {/* Surprise Me Control (Full Random & Tier Selector) */}
        <SurpriseMeControl
          isLoading={isLoading}
          currentUsername={inputUsername}
          onSelectUser={handleTriggerSearch}
        />
      </div>

      {/* Recent Searches and Quick Inspect Presets */}
      <RecentSearches
        recentSearches={recentSearches}
        presets={PRESET_USERS}
        onSelectUser={handleTriggerSearch}
        onClearHistory={handleClearHistory}
      />
    </section>
  );
}

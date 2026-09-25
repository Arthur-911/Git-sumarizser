"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SearchSection } from "@/components/SearchSection";
import { ProfileCard } from "@/components/ProfileCard";
import { StatsGrid } from "@/components/StatsGrid";
import { LanguageBreakdown } from "@/components/LanguageBreakdown";
import { RepoList } from "@/components/RepoList";
import { ShareReadmeModal } from "@/components/ShareReadmeModal";
import { GitHubRepo, GitHubUser, UserStats } from "@/types/github";
import { computeUserStats, fetchGitHubUser, fetchUserRepos } from "@/lib/github";
import { AlertTriangle, Heart } from "lucide-react";

function GitPulseContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const lastFetchedUserRef = useRef<string>("");
  const cacheRef = useRef<Map<string, { user: GitHubUser; repos: GitHubRepo[]; stats: UserStats }>>(new Map());

  const handleSearch = useCallback(async (username: string) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;

    // Avoid duplicate requests if already showing this user
    if (lastFetchedUserRef.current === cleanUsername) {
      return;
    }

    // Check in-memory cache first
    const cached = cacheRef.current.get(cleanUsername);
    if (cached) {
      lastFetchedUserRef.current = cleanUsername;
      setUser(cached.user);
      setRepos(cached.repos);
      setStats(cached.stats);
      setError(null);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get("username") !== cleanUsername) {
          url.searchParams.set("username", cleanUsername);
          window.history.replaceState({}, "", url.toString());
        }
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [userData, reposData] = await Promise.all([
        fetchGitHubUser(cleanUsername),
        fetchUserRepos(cleanUsername),
      ]);

      const computedStats = computeUserStats(reposData);

      cacheRef.current.set(cleanUsername, {
        user: userData,
        repos: reposData,
        stats: computedStats,
      });

      lastFetchedUserRef.current = cleanUsername;
      setUser(userData);
      setRepos(reposData);
      setStats(computedStats);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get("username") !== cleanUsername) {
          url.searchParams.set("username", cleanUsername);
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching GitHub data.");
      }
      setUser(null);
      setRepos([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialUser = searchParams?.get("username") || "shadcn";
    if (lastFetchedUserRef.current !== initialUser.trim().toLowerCase()) {
      handleSearch(initialUser);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Search Hero */}
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Unable to load profile</p>
              <p className="mt-1 text-xs text-red-300/80">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {user && stats && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ProfileCard user={user} onOpenShare={() => setIsShareOpen(true)} />

            <StatsGrid stats={stats} />

            <LanguageBreakdown languages={stats.languageStats} />

            <RepoList repos={repos} />

            <ShareReadmeModal
              isOpen={isShareOpen}
              onClose={() => setIsShareOpen(false)}
              user={user}
              stats={stats}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1">
            Built with Next.js, Tailwind CSS &amp; GitHub REST API <Heart className="h-3 w-3 text-red-500 inline" />
          </p>
          <p className="text-zinc-600">
            Open-source showcase project for beginner portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">Loading GitPulse...</div>}>
      <GitPulseContent />
    </Suspense>
  );
}

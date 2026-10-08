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
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { CosmicBackground } from "@/components/CosmicBackground";
import { GitHubRepo, GitHubUser, UserStats } from "@/types/github";
import { computeUserStats, fetchGitHubUser, fetchUserRepos, isValidGitHubUsername } from "@/lib/github";
import { AlertTriangle, Heart } from "lucide-react";

function GitPulseContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [isReappearing, setIsReappearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const currentUserRef = useRef<GitHubUser | null>(null);
  const lastFetchedUserRef = useRef<string>("");
  const requestIdRef = useRef<number>(0);
  const cacheRef = useRef<Map<string, { user: GitHubUser; repos: GitHubRepo[]; stats: UserStats }>>(new Map());

  const handleSearch = useCallback(async (username: string) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;

    if (!isValidGitHubUsername(cleanUsername)) {
      setError(`"${cleanUsername}" is not a valid GitHub username.`);
      setIsLoading(false);
      return;
    }

    // Avoid duplicate requests if already showing this user
    if (lastFetchedUserRef.current === cleanUsername && currentUserRef.current !== null) {
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    // Reset language filter on new profile search
    setSelectedLanguage(null);

    // If profile content is currently displayed, trigger disappearing exit animation first
    if (currentUserRef.current !== null) {
      setIsDisappearing(true);
      await new Promise((resolve) => setTimeout(resolve, 240));
      if (requestIdRef.current !== currentRequestId) return;
    }

    setIsDisappearing(false);
    setIsLoading(true);
    setError(null);

    // Check in-memory cache first
    const cached = cacheRef.current.get(cleanUsername);
    if (cached) {
      // Brief pause to allow the skeleton loader to smoothly transition
      await new Promise((resolve) => setTimeout(resolve, 220));
      if (requestIdRef.current !== currentRequestId) return;

      lastFetchedUserRef.current = cleanUsername;
      currentUserRef.current = cached.user;
      setUser(cached.user);
      setRepos(cached.repos);
      setStats(cached.stats);
      setIsLoading(false);
      setIsReappearing(true);
      setTimeout(() => {
        if (requestIdRef.current === currentRequestId) {
          setIsReappearing(false);
        }
      }, 380);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get("username") !== cleanUsername) {
          url.searchParams.set("username", cleanUsername);
          window.history.replaceState({}, "", url.toString());
        }
      }
      return;
    }

    try {
      const [userData, reposData] = await Promise.all([
        fetchGitHubUser(cleanUsername),
        fetchUserRepos(cleanUsername),
      ]);

      if (requestIdRef.current !== currentRequestId) return;

      const computedStats = computeUserStats(reposData);

      cacheRef.current.set(cleanUsername, {
        user: userData,
        repos: reposData,
        stats: computedStats,
      });

      lastFetchedUserRef.current = cleanUsername;
      currentUserRef.current = userData;
      setUser(userData);
      setRepos(reposData);
      setStats(computedStats);
      setIsLoading(false);
      setIsReappearing(true);
      setTimeout(() => {
        if (requestIdRef.current === currentRequestId) {
          setIsReappearing(false);
        }
      }, 380);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get("username") !== cleanUsername) {
          url.searchParams.set("username", cleanUsername);
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch (err: unknown) {
      if (requestIdRef.current !== currentRequestId) return;

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching GitHub data.");
      }
      currentUserRef.current = null;
      lastFetchedUserRef.current = "";
      setUser(null);
      setRepos([]);
      setStats(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const rawUser = searchParams?.get("username") || "shadcn";
    const initialUser = isValidGitHubUsername(rawUser) ? rawUser : "shadcn";
    if (lastFetchedUserRef.current !== initialUser.trim().toLowerCase()) {
      handleSearch(initialUser);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-x-hidden">
      {/* Animated Cosmic Shooting Stars & Snow/Star Particles */}
      <CosmicBackground />

      {/* Atmospheric Space Nebula Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[110px] rounded-full" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-teal-500/8 blur-[120px] rounded-full" />
        <div className="absolute top-2/3 -right-32 w-[450px] h-[450px] bg-indigo-600/8 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Search Hero */}
          <SearchSection
            onSearch={handleSearch}
            isLoading={isLoading || isDisappearing}
          />

          {/* Error Alert */}
          {error && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Unable to load profile</p>
                <p className="mt-1 text-xs text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Skeleton during state transitions */}
          {isLoading && <ProfileSkeleton />}

          {/* Profile Content with Disappearing and Re-appearing Transitions */}
          {!isLoading && user && stats && (
            <div
              className={`space-y-8 ${
                isDisappearing
                  ? "animate-fade-out pointer-events-none"
                  : isReappearing
                  ? "animate-fade-in"
                  : ""
              }`}
            >
              <ProfileCard user={user} onOpenShare={() => setIsShareOpen(true)} />

              <StatsGrid stats={stats} />

              <LanguageBreakdown
                languages={stats.languageStats}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />

              <RepoList
                repos={repos}
                selectedLanguage={selectedLanguage}
                onClearLanguage={() => setSelectedLanguage(null)}
              />

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

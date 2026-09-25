"use client";

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" aria-busy="true" aria-label="Loading profile data">
      {/* Profile Card Skeleton */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-zinc-800 skeleton-gradient animate-pulse-shimmer" />
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 space-y-4 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-7 w-48 sm:w-64 rounded-lg skeleton-gradient animate-pulse-shimmer" />
                <div className="h-4 w-28 rounded-md skeleton-gradient animate-pulse-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 rounded-xl skeleton-gradient animate-pulse-shimmer" />
                <div className="h-8 w-28 rounded-xl skeleton-gradient animate-pulse-shimmer" />
              </div>
            </div>

            {/* Bio Skeleton */}
            <div className="space-y-2 pt-1 max-w-xl">
              <div className="h-3.5 w-full rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-3.5 w-4/5 rounded skeleton-gradient animate-pulse-shimmer" />
            </div>

            {/* Followers / Following Skeleton */}
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <div className="h-4 w-24 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="text-zinc-700">•</div>
              <div className="h-4 w-24 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="text-zinc-700">•</div>
              <div className="h-4 w-28 rounded skeleton-gradient animate-pulse-shimmer" />
            </div>

            {/* Secondary Details Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60">
              <div className="h-4 w-28 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-4 w-24 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-4 w-32 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-4 w-28 rounded skeleton-gradient animate-pulse-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-8 w-8 rounded-lg skeleton-gradient animate-pulse-shimmer" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-7 w-20 rounded-lg skeleton-gradient animate-pulse-shimmer" />
              <div className="h-3 w-32 rounded skeleton-gradient animate-pulse-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Language Breakdown Skeleton */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-lg shadow-black/20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded skeleton-gradient animate-pulse-shimmer" />
          <div className="h-3.5 w-28 rounded skeleton-gradient animate-pulse-shimmer" />
        </div>
        <div className="h-3 w-full rounded-full skeleton-gradient animate-pulse-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3 space-y-2"
            >
              <div className="h-3.5 w-16 rounded skeleton-gradient animate-pulse-shimmer" />
              <div className="h-5 w-12 rounded skeleton-gradient animate-pulse-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Repositories Skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="h-6 w-44 rounded-lg skeleton-gradient animate-pulse-shimmer" />
            <div className="h-3.5 w-32 rounded skeleton-gradient animate-pulse-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-44 rounded-xl skeleton-gradient animate-pulse-shimmer" />
            <div className="h-8 w-28 rounded-xl skeleton-gradient animate-pulse-shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xl shadow-lg shadow-black/20 space-y-4"
            >
              <div className="space-y-2.5">
                <div className="h-5 w-48 rounded skeleton-gradient animate-pulse-shimmer" />
                <div className="h-3.5 w-full rounded skeleton-gradient animate-pulse-shimmer" />
                <div className="h-3.5 w-2/3 rounded skeleton-gradient animate-pulse-shimmer" />
              </div>
              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-16 rounded skeleton-gradient animate-pulse-shimmer" />
                  <div className="h-3.5 w-12 rounded skeleton-gradient animate-pulse-shimmer" />
                </div>
                <div className="h-6 w-16 rounded-lg skeleton-gradient animate-pulse-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

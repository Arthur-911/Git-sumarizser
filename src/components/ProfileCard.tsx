"use client";

import { GitHubUser } from "@/types/github";
import {
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Users,
  Share2,
} from "lucide-react";
import { TwitterIcon } from "./Icons";

interface ProfileCardProps {
  user: GitHubUser;
  onOpenShare: () => void;
}

export function ProfileCard({ user, onOpenShare }: ProfileCardProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-zinc-900 object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight truncate">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                @{user.login}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Export Card</span>
              </button>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">{user.bio}</p>
          )}

          {/* Followers & Following */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-zinc-500" />
              <span className="font-semibold text-white">{user.followers.toLocaleString()}</span>
              <span>followers</span>
            </div>
            <div className="text-zinc-600">•</div>
            <div>
              <span className="font-semibold text-white">{user.following.toLocaleString()}</span>
              <span className="ml-1">following</span>
            </div>
            <div className="text-zinc-600">•</div>
            <div>
              <span className="font-semibold text-white">{user.public_repos.toLocaleString()}</span>
              <span className="ml-1">repositories</span>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
            {user.company && (
              <div className="flex items-center gap-2 truncate">
                <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{user.company}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-2 truncate">
                <Globe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-cyan-400 hover:underline"
                >
                  {user.blog.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {user.twitter_username && (
              <div className="flex items-center gap-2 truncate">
                <TwitterIcon className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-cyan-400 hover:underline"
                >
                  @{user.twitter_username}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

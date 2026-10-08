"use client";

import { useState } from "react";
import { GitHubUser, UserStats } from "@/types/github";
import { Copy, Check, X, FileText } from "lucide-react";

function SparkleBurst() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const tx = Math.cos(rad) * 20;
        const ty = Math.sin(rad) * 20;
        return (
          <span
            key={i}
            style={{
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
            } as React.CSSProperties}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 animate-sparkle-burst"
          />
        );
      })}
    </span>
  );
}

interface ShareReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GitHubUser;
  stats: UserStats;
}

function escapeMarkdownText(text: string): string {
  // Strip raw HTML tags and escape markdown link/bracket delimiters
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\[\]]/g, "")
    .trim();
}

function getSafeMarkdownUrl(rawUrl: string): string | null {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

export function ShareReadmeModal({ isOpen, onClose, user, stats }: ShareReadmeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const displayName = escapeMarkdownText(user.name || user.login);
  const safeBio = user.bio
    ? user.bio
        .split("\n")
        .map((line) => `> ${escapeMarkdownText(line)}`)
        .join("\n") + "\n"
    : "";
  const safeLocation = user.location ? escapeMarkdownText(user.location) : "";
  const safeWebsite = user.blog ? getSafeMarkdownUrl(user.blog) : null;

  const markdownContent = `### Hi there, I'm ${displayName}! 👋

${safeBio}- 🔭 **Public Repositories:** ${user.public_repos}
- ⭐ **Total Stars Earned:** ${stats.totalStars}
- 🍴 **Total Forks:** ${stats.totalForks}
- 💻 **Top Language:** ${escapeMarkdownText(stats.topLanguage)}
${safeLocation ? `- 📍 **Location:** ${safeLocation}\n` : ""}${safeWebsite ? `- 🌐 **Website:** [${escapeMarkdownText(user.blog || "")}](${safeWebsite})\n` : ""}
---
*Generated with [GitPulse](https://github.com/${encodeURIComponent(user.login)})*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 animate-fade-in">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <h3 className="font-semibold text-white">GitHub Profile README Snippet</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Copy this Markdown snippet and paste it into your personal GitHub profile repository (<code>{user.login}/{user.login}</code>) README.
        </p>

        <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto max-h-64">
          <pre>{markdownContent}</pre>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="relative inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-cyan-400 transition shadow-md shadow-cyan-500/20"
          >
            {copied && <SparkleBurst />}
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { GitHubUser, UserStats } from "@/types/github";
import { Copy, Check, X, FileText } from "lucide-react";

interface ShareReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GitHubUser;
  stats: UserStats;
}

export function ShareReadmeModal({ isOpen, onClose, user, stats }: ShareReadmeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `### Hi there, I'm ${user.name || user.login}! 👋

${user.bio ? `> ${user.bio}\n` : ""}
- 🔭 **Public Repositories:** ${user.public_repos}
- ⭐ **Total Stars Earned:** ${stats.totalStars}
- 🍴 **Total Forks:** ${stats.totalForks}
- 💻 **Top Language:** ${stats.topLanguage}
${user.location ? `- 📍 **Location:** ${user.location}\n` : ""}${user.blog ? `- 🌐 **Website:** [${user.blog}](${user.blog.startsWith("http") ? user.blog : `https://${user.blog}`})\n` : ""}
---
*Generated with [GitPulse](https://github.com/${user.login})*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
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
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-cyan-400 transition shadow-md shadow-cyan-500/20"
          >
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

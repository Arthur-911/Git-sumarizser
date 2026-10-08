import { GitHubRepo, GitHubUser, LanguageStat, UserStats } from "@/types/github";

// Common language color definitions matching GitHub's linguist colors
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#8b949e";
  return LANGUAGE_COLORS[language] || "#58a6ff";
}

const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function isValidGitHubUsername(username: string): boolean {
  return GITHUB_USERNAME_REGEX.test(username.trim());
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error("Username cannot be empty.");
  }
  if (!isValidGitHubUsername(cleanUsername)) {
    throw new Error(`"${cleanUsername}" is not a valid GitHub username format.`);
  }

  const encodedUsername = encodeURIComponent(cleanUsername);
  const response = await fetch(`https://api.github.com/users/${encodedUsername}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found.`);
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error(`Failed to fetch user data (Error ${response.status})`);
  }

  return response.json();
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error("Username cannot be empty.");
  }
  if (!isValidGitHubUsername(cleanUsername)) {
    throw new Error(`"${cleanUsername}" is not a valid GitHub username format.`);
  }

  const encodedUsername = encodeURIComponent(cleanUsername);
  // Fetch up to 100 repositories sorted by pushed date
  const response = await fetch(
    `https://api.github.com/users/${encodedUsername}/repos?per_page=100&sort=pushed`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories (${response.statusText})`);
  }

  return response.json();
}

export function computeUserStats(repos: GitHubRepo[]): UserStats {
  let totalStars = 0;
  let totalForks = 0;
  const languageCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;

    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const totalReposWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);

  const languageStats: LanguageStat[] = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalReposWithLanguage > 0 ? Math.round((count / totalReposWithLanguage) * 100) : 0,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.count - a.count);

  const topLanguage = languageStats.length > 0 ? languageStats[0].name : "None";
  const avgStarsPerRepo = repos.length > 0 ? Math.round((totalStars / repos.length) * 10) / 10 : 0;

  return {
    totalStars,
    totalForks,
    topLanguage,
    avgStarsPerRepo,
    languageStats,
  };
}

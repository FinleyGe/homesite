export type VibeProjectLocale = "en" | "zh";

export type VibeProjectConfig = {
  id: string;
  title: string;
  repo: `${string}/${string}`;
  href: string;
  description: Record<VibeProjectLocale, string>;
  fallbackStars: number;
};

export type GitHubRepoStats = {
  stars: number;
};

export type VibeProjectItem = VibeProjectConfig & {
  stars: number;
  starsSource: "fallback" | "live";
};

export const vibeProjects: VibeProjectConfig[] = [
  {
    id: "proxy-tunnel-logger",
    title: "Proxy Tunnel Logger",
    repo: "FinleyGe/proxy-tunnel-logger",
    href: "https://github.com/FinleyGe/proxy-tunnel-logger",
    description: {
      en: "A lightweight Bun HTTP forward proxy and passthrough CONNECT tunnel logger with JSONL persistence and a real-time web inspector.",
      zh: "基于 Bun 的轻量级 HTTP 正向代理与透传 CONNECT 隧道日志工具，支持 JSONL 持久化与实时 Web 检查器。",
    },
    fallbackStars: 1,
  },
  {
    id: "ezmock",
    title: "Easy Mock",
    repo: "FinleyGe/ezmock",
    href: "https://github.com/FinleyGe/ezmock",
    description: {
      en: "A fast, easy-to-use API mock CLI built with Bun and TypeScript, supporting JSON configs, parameterized routes, and custom delays.",
      zh: "基于 Bun + TypeScript 的轻量级 API Mock CLI 工具，支持 JSON 配置、参数化路由、响应延迟与交互式配置。",
    },
    fallbackStars: 0,
  },
  {
    id: "github-tools",
    title: "GitHub Tools",
    repo: "FinleyGe/github-tools",
    href: "https://github.com/FinleyGe/github-tools",
    description: {
      en: "A collection of handy GitHub automation utilities built with Bun, including an issue and PR comment bot.",
      zh: "基于 Bun 编写的实用 GitHub 自动化小工具集合，包含 Issue 与 PR 自动评论机器人。",
    },
    fallbackStars: 0,
  },
];

export function createInitialVibeProjects(
  configs: VibeProjectConfig[] = vibeProjects,
): VibeProjectItem[] {
  return configs.map((project) => ({
    ...project,
    stars: project.fallbackStars,
    starsSource: "fallback",
  }));
}

export function resolveVibeProject(
  project: VibeProjectConfig,
  stats: GitHubRepoStats | null,
): VibeProjectItem {
  if (
    stats
    && typeof stats.stars === "number"
    && Number.isInteger(stats.stars)
    && stats.stars >= 0
  ) {
    return {
      ...project,
      stars: stats.stars,
      starsSource: "live",
    };
  }

  return {
    ...project,
    stars: project.fallbackStars,
    starsSource: "fallback",
  };
}

export async function fetchGitHubRepoStats(
  repo: string,
  fetcher: typeof fetch = fetch,
): Promise<GitHubRepoStats | null> {
  try {
    const response = await fetcher(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { stargazers_count?: unknown };
    const stars = payload?.stargazers_count;

    if (typeof stars !== "number" || !Number.isInteger(stars) || stars < 0) {
      return null;
    }

    return { stars };
  }
  catch {
    return null;
  }
}

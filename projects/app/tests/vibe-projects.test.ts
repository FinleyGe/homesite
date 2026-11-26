import { describe, expect, it, vi } from "vitest";
import {
  createInitialVibeProjects,
  fetchGitHubRepoStats,
  resolveVibeProject,
  vibeProjects,
} from "../app/const/projects";

describe("vibe projects", () => {
  it("contains the three configured GitHub repositories", () => {
    expect(vibeProjects.map((project) => project.repo)).toEqual([
      "FinleyGe/proxy-tunnel-logger",
      "FinleyGe/ezmock",
      "FinleyGe/github-tools",
    ]);
  });

  it("initializes projects with fallback star counts", () => {
    const initial = createInitialVibeProjects();

    expect(initial).toHaveLength(vibeProjects.length);
    for (const project of initial) {
      expect(project.stars).toBe(project.fallbackStars);
      expect(project.starsSource).toBe("fallback");
    }
  });

  it("returns live stars when GitHub API responds with a valid stargazers_count", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: 42 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const stats = await fetchGitHubRepoStats("FinleyGe/ezmock", fetcher);
    const resolved = resolveVibeProject(vibeProjects[1]!, stats);

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.github.com/repos/FinleyGe/ezmock",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/vnd.github+json",
        }),
      }),
    );
    expect(resolved.stars).toBe(42);
    expect(resolved.starsSource).toBe("live");
  });

  it("falls back to static stars when GitHub API returns an error status", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ message: "API rate limit exceeded" }), {
        status: 403,
      }),
    );

    const stats = await fetchGitHubRepoStats("FinleyGe/proxy-tunnel-logger", fetcher);
    const resolved = resolveVibeProject(vibeProjects[0]!, stats);

    expect(stats).toBeNull();
    expect(resolved.stars).toBe(vibeProjects[0]!.fallbackStars);
    expect(resolved.starsSource).toBe("fallback");
  });

  it("falls back to static stars when fetch rejects or payload is invalid", async () => {
    const rejectingFetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("Network error"));
    const invalidPayloadFetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: "not-a-number" }), {
        status: 200,
      }),
    );

    expect(
      await fetchGitHubRepoStats("FinleyGe/github-tools", rejectingFetcher),
    ).toBeNull();
    expect(
      await fetchGitHubRepoStats("FinleyGe/github-tools", invalidPayloadFetcher),
    ).toBeNull();
  });
});

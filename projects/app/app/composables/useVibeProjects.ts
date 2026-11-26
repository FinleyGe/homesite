import {
  createInitialVibeProjects,
  fetchGitHubRepoStats,
  resolveVibeProject,
  vibeProjects,
  type VibeProjectItem,
} from "~/const/projects";

export function useVibeProjects() {
  const projects = ref<VibeProjectItem[]>(createInitialVibeProjects(vibeProjects));

  onMounted(async () => {
    const resolved = await Promise.all(
      vibeProjects.map(async (project) => {
        const stats = await fetchGitHubRepoStats(project.repo);
        return resolveVibeProject(project, stats);
      }),
    );

    projects.value = resolved;
  });

  return {
    projects,
  };
}

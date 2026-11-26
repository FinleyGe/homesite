<script setup lang="ts">
import { ArrowUpRight, LogoGithub, Star } from "@vicons/carbon";
import type { VibeProjectItem, VibeProjectLocale } from "~/const/projects";

const { t, locale } = useI18n();
const { projects } = useVibeProjects();

const currentLocale = computed<VibeProjectLocale>(() =>
  locale.value === "zh" ? "zh" : "en",
);

function descriptionFor(project: VibeProjectItem) {
  return project.description[currentLocale.value] ?? project.description.en;
}
</script>

<template>
  <div class="projects-page">
    <header class="projects-header" aria-labelledby="projects-title">
      <div class="projects-header__copy">
        <p class="projects-header__eyebrow">
          <span>{{ t("projects.eyebrow") }}</span>
          <span aria-hidden="true">·</span>
          <span class="projects-header__count">
            {{ t("projects.count", { count: projects.length }) }}
          </span>
        </p>

        <h1 id="projects-title" class="projects-header__title">
          {{ t("projects.title") }}
        </h1>

        <p class="projects-header__intro">
          {{ t("projects.intro") }}
        </p>
      </div>

      <a
        class="projects-header__action"
        href="https://github.com/FinleyGe"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LogoGithub class="projects-header__action-icon" aria-hidden="true" />
        <span>{{ t("projects.githubProfile") }}</span>
        <ArrowUpRight class="projects-header__action-icon" aria-hidden="true" />
      </a>
    </header>

    <section class="projects-grid" :aria-label="t('projects.title')">
      <a
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :href="project.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="project-card__top">
          <h2 class="project-card__title">
            {{ project.title }}
          </h2>

          <span
            class="project-card__stars"
            :aria-label="t('projects.starsAria', { count: project.stars })"
          >
            <Star class="project-card__star-icon" aria-hidden="true" />
            <span>{{ project.stars }}</span>
          </span>
        </div>

        <p class="project-card__desc">
          {{ descriptionFor(project) }}
        </p>

        <div class="project-card__footer">
          <span class="project-card__repo">
            <LogoGithub class="project-card__repo-icon" aria-hidden="true" />
            <span class="project-card__repo-name">{{ project.repo }}</span>
          </span>

          <ArrowUpRight class="project-card__arrow" aria-hidden="true" />
        </div>
      </a>
    </section>
  </div>
</template>

<style scoped>
.projects-page {
  width: min(100%, 65rem);
  margin-inline: auto;
  padding: 40px 0 64px;
}

.projects-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px 32px;
  align-items: end;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
}

.projects-header__copy {
  display: grid;
  gap: 8px;
}

.projects-header__eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.projects-header__count {
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
}

.projects-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

:global([lang^="zh"]) .projects-header__title {
  letter-spacing: 0;
}

.projects-header__intro {
  margin: 4px 0 0;
  max-width: 38rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
  text-wrap: pretty;
}

.projects-header__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  box-shadow: var(--highlight-top);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  padding: 0 16px;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.projects-header__action:hover {
  background-color: var(--color-surface-raised);
}

.projects-header__action:active {
  transform: scale(0.98);
}

.projects-header__action-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 13.5rem;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  color: inherit;
  text-decoration: none;
  animation: fadeRise 280ms var(--ease-out) both;
  transition:
    border-color 150ms var(--ease-out),
    background-color 150ms var(--ease-out),
    box-shadow 150ms var(--ease-out);
}

.project-card:hover {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface-raised);
}

.project-card:hover .project-card__title,
.project-card:hover .project-card__arrow {
  color: var(--color-accent);
}

.project-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.project-card__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.3;
  transition: color 150ms var(--ease-out);
}

.project-card__stars {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 4px 9px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.project-card__star-icon {
  width: 13px;
  height: 13px;
  color: var(--color-warning);
  flex-shrink: 0;
}

.project-card__desc {
  flex: 1 1 auto;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
  text-wrap: pretty;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}

.project-card__repo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  line-height: 1.4;
}

.project-card__repo-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.project-card__repo-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-card__arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: color 150ms var(--ease-out);
}

@media (max-width: 960px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .projects-page {
    padding: 28px 0 48px;
  }

  .projects-header {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .projects-header__action {
    width: fit-content;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

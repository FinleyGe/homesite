<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Image } from "@vicons/carbon";
import { MASTODON_CONFIG } from "~/const/mastodon";
import { formatMomentShortDate } from "~/utils/mastodon";

const { t } = useI18n();
const localePath = useLocalePath();

const { items, status, fetchInitial } = useMastodonMoments();

const previewItems = computed(() =>
  items.value.slice(0, MASTODON_CONFIG.homePreviewLimit),
);

const momentsPath = computed(() => localePath("/moments"));

onMounted(() => {
  void fetchInitial({ limit: MASTODON_CONFIG.homePreviewLimit });
});
</script>

<template>
  <section class="home-moments" aria-labelledby="home-moments-title">
    <div class="home-moments__header">
      <div>
        <p class="home-moments__label">
          {{ t("home.moments.eyebrow") }}
        </p>
        <h2 id="home-moments-title" class="home-moments__title">
          {{ t("home.moments.title") }}
        </h2>
        <p class="home-moments__intro">
          {{ t("home.moments.body") }}
        </p>
      </div>

      <NuxtLink class="home-moments__all" :to="momentsPath">
        <span>{{ t("home.moments.allMoments") }}</span>
        <ArrowRight class="home-moments__icon" aria-hidden="true" />
      </NuxtLink>
    </div>

    <div
      v-if="status === 'loading' || status === 'idle'"
      class="home-moments__skeleton"
      aria-hidden="true"
    >
      <div v-for="n in 3" :key="n" class="home-moments__skeleton-row" />
    </div>

    <ul v-else-if="previewItems.length" class="home-moments__list">
      <li
        v-for="item in previewItems"
        :key="item.id"
        class="home-moments__item"
      >
        <NuxtLink class="home-moments__link" :to="momentsPath">
          <div class="home-moments__copy">
            <p class="home-moments__text">
              {{ item.spoilerText || item.summary || t("moments.mediaOnly") }}
            </p>
            <span v-if="item.media.length" class="home-moments__media-badge">
              <Image class="home-moments__media-icon" aria-hidden="true" />
              <span>{{ item.media.length }}</span>
            </span>
          </div>
          <time class="home-moments__date" :datetime="item.createdAt">
            {{ formatMomentShortDate(item.createdAt) }}
          </time>
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="home-moments__fallback">
      <p class="home-moments__fallback-text">
        {{ t("home.moments.fallbackBody") }}
      </p>
      <div class="home-moments__fallback-actions">
        <NuxtLink class="home-moments__fallback-link" :to="momentsPath">
          <span>{{ t("home.moments.openMoments") }}</span>
          <ArrowRight class="home-moments__icon" aria-hidden="true" />
        </NuxtLink>
        <a
          class="home-moments__fallback-link"
          :href="MASTODON_CONFIG.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ MASTODON_CONFIG.handle }}</span>
          <ArrowUpRight class="home-moments__icon" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-moments {
  border-top: 1px solid var(--color-border);
  padding: 56px 0;
}

.home-moments__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  margin-bottom: 28px;
}

.home-moments__label {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-moments__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .home-moments__title {
  letter-spacing: 0;
}

.home-moments__intro {
  max-width: 38rem;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-moments__all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-moments__all:hover {
  color: var(--color-accent-hover);
}

.home-moments__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.home-moments__skeleton {
  display: grid;
  border-top: 1px solid var(--color-border);
}

.home-moments__skeleton-row {
  height: 52px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-surface-raised) 50%,
    transparent 100%
  );
  opacity: 0.55;
}

.home-moments__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border);
}

.home-moments__item {
  min-width: 0;
  border-bottom: 1px solid var(--color-border);
}

.home-moments__link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding: 16px 4px;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-moments__copy {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}

.home-moments__text {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
  font-size: 0.9375rem;
  line-height: 1.5;
  transition: color 150ms var(--ease-out);
}

.home-moments__link:hover .home-moments__text {
  color: var(--color-accent);
}

.home-moments__media-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-surface);
  padding: 2px 8px;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.home-moments__media-icon {
  width: 16px;
  height: 16px;
}

.home-moments__date {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.home-moments__fallback {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  padding: 16px 20px;
}

.home-moments__fallback-text {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

.home-moments__fallback-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.home-moments__fallback-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-moments__fallback-link:hover {
  color: var(--color-accent-hover);
}

@media (max-width: 640px) {
  .home-moments {
    padding: 40px 0;
  }

  .home-moments__link {
    flex-direction: column;
    gap: 4px;
  }

  .home-moments__copy {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import { ArrowUpRight, Renew } from "@vicons/carbon";
import MomentCard from "~/components/moments/MomentCard.vue";
import { MASTODON_CONFIG } from "~/const/mastodon";

const { t } = useI18n();

const {
  items,
  status,
  loadingMore,
  loadMoreFailed,
  hasMore,
  fetchInitial,
  loadMore,
  retry,
} = useMastodonMoments();

useHead({
  title: computed(() => `${t("common.moments")} · ${t("head.title")}`),
});

onMounted(() => {
  void fetchInitial({ limit: MASTODON_CONFIG.defaultPageSize });
});
</script>

<template>
  <section class="moments-page" aria-labelledby="moments-title">
    <header class="moments-header">
      <div class="moments-header__copy">
        <p class="moments-header__eyebrow">
          /moments
        </p>
        <h1 id="moments-title" class="moments-header__title">
          {{ t("moments.title") }}
        </h1>
        <p class="moments-header__desc">
          {{ t("moments.description") }}
        </p>
      </div>

      <a
        class="moments-header__profile"
        :href="MASTODON_CONFIG.profileUrl"
        target="_blank"
        rel="me noopener noreferrer"
      >
        <span>{{ t("moments.followMastodon") }}</span>
        <ArrowUpRight class="moments-header__icon" aria-hidden="true" />
      </a>
    </header>

    <div
      v-if="status === 'fallback'"
      class="moments-notice"
      role="status"
    >
      <p class="moments-notice__text">
        {{ t("moments.cachedNotice") }}
      </p>
      <button
        type="button"
        class="moments-notice__action"
        @click="retry()"
      >
        <Renew class="moments-notice__icon" aria-hidden="true" />
        <span>{{ t("moments.retry") }}</span>
      </button>
    </div>

    <div
      v-if="status === 'loading' || status === 'idle'"
      class="moments-skeleton"
      :aria-label="t('moments.loading')"
    >
      <div v-for="n in 4" :key="n" class="moments-skeleton__card">
        <div class="moments-skeleton__line moments-skeleton__line--short" />
        <div class="moments-skeleton__line" />
        <div class="moments-skeleton__line moments-skeleton__line--mid" />
      </div>
    </div>

    <div v-else-if="status === 'offline'" class="moments-offline" role="status">
      <h2 class="moments-offline__title">
        {{ t("moments.offlineTitle") }}
      </h2>
      <p class="moments-offline__body">
        {{ t("moments.offlineBody") }}
      </p>
      <div class="moments-offline__actions">
        <button
          type="button"
          class="moments-btn moments-btn--secondary"
          @click="retry()"
        >
          <Renew class="moments-btn__icon" aria-hidden="true" />
          <span>{{ t("moments.retry") }}</span>
        </button>
        <a
          class="moments-btn moments-btn--primary"
          :href="MASTODON_CONFIG.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ t("moments.openMastodon") }}</span>
          <ArrowUpRight class="moments-btn__icon" aria-hidden="true" />
        </a>
      </div>
    </div>

    <div v-else-if="items.length === 0" class="moments-offline" role="status">
      <h2 class="moments-offline__title">
        {{ t("moments.emptyTitle") }}
      </h2>
      <p class="moments-offline__body">
        {{ t("moments.emptyBody") }}
      </p>
      <div class="moments-offline__actions">
        <a
          class="moments-btn moments-btn--primary"
          :href="MASTODON_CONFIG.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ t("moments.openMastodon") }}</span>
          <ArrowUpRight class="moments-btn__icon" aria-hidden="true" />
        </a>
      </div>
    </div>

    <div v-else class="moments-feed">
      <MomentCard
        v-for="item in items"
        :key="item.id"
        :moment="item"
      />

      <div v-if="hasMore || loadMoreFailed" class="moments-more">
        <p v-if="loadMoreFailed" class="moments-more__hint">
          {{ t("moments.loadMoreFailed") }}
        </p>
        <button
          type="button"
          class="moments-btn moments-btn--secondary"
          :disabled="loadingMore"
          @click="loadMore()"
        >
          {{ loadingMore ? t("moments.loadingMore") : t("moments.loadMore") }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.moments-page {
  width: min(100%, 48rem);
  margin: 36px auto 64px;
  display: grid;
  gap: 24px;
}

.moments-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 24px;
}

.moments-header__copy {
  display: grid;
  gap: 8px;
}

.moments-header__eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.moments-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .moments-header__title {
  letter-spacing: 0;
}

.moments-header__desc {
  max-width: 34rem;
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.moments-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  padding: 0 16px;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.moments-header__profile:hover {
  border-color: var(--color-accent-border);
  color: var(--color-accent);
}

.moments-header__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.moments-notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  padding: 12px 16px;
}

.moments-notice__text {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.moments-notice__action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xs);
  background-color: var(--color-surface-raised);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 8px 12px;
}

.moments-notice__icon {
  width: 16px;
  height: 16px;
}

.moments-skeleton {
  display: grid;
  gap: 16px;
}

.moments-skeleton__card {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  padding: 24px;
}

.moments-skeleton__line {
  height: 14px;
  border-radius: var(--radius-xs);
  background-color: var(--color-surface-raised);
}

.moments-skeleton__line--short {
  width: 32%;
}

.moments-skeleton__line--mid {
  width: 68%;
}

.moments-offline {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  padding: clamp(24px, 4vw, 36px);
}

.moments-offline__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
}

.moments-offline__body {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.moments-offline__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.moments-feed {
  display: grid;
  gap: 16px;
}

.moments-more {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding-top: 8px;
}

.moments-more__hint {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.moments-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  border-radius: var(--radius-sm);
  padding: 0 16px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    opacity 150ms var(--ease-out);
}

.moments-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.moments-btn--primary {
  border: 1px solid transparent;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-text);
}

.moments-btn--primary:hover {
  background-color: var(--color-primary-hover);
}

.moments-btn--secondary {
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-surface);
  color: var(--color-text);
}

.moments-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-surface-raised);
}

.moments-btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .moments-page {
    margin: 24px auto 48px;
  }
}
</style>

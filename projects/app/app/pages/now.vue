<script setup lang="ts">
const { t } = useI18n();

const { data } = await useAsyncData("about-now", () =>
  queryCollection("about").where("title", "=", "now").first(),
);
</script>

<template>
  <article class="now-page" aria-labelledby="now-title">
    <header class="now-header">
      <p class="now-header__eyebrow">
        /now
      </p>
      <h1 id="now-title" class="now-header__title">
        {{ t("common.now") }}
      </h1>
      <p class="now-header__desc">
        {{ t("common.nowDescription") }}
      </p>
    </header>

    <div class="now-body">
      <ContentRenderer v-if="data" :value="data" />
    </div>
  </article>
</template>

<style scoped>
.now-page {
  width: min(100%, 46rem);
  margin: 36px auto 64px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: clamp(24px, 4vw, 44px);
}

.now-header {
  display: grid;
  gap: 8px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.now-header__eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.now-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .now-header__title {
  letter-spacing: 0;
}

.now-header__desc {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.now-body {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

@media (max-width: 640px) {
  .now-page {
    margin: 24px auto 48px;
  }
}
</style>

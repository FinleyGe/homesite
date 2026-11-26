<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
}>();
</script>

<template>
  <article class="note-page" :aria-labelledby="titleId">
    <header class="note-header">
      <p class="note-header__eyebrow">
        {{ eyebrow }}
      </p>
      <h1 :id="titleId" class="note-header__title">
        {{ title }}
      </h1>
      <p class="note-header__desc">
        {{ description }}
      </p>
    </header>

    <div class="note-body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.note-page {
  width: min(100%, 46rem);
  margin: 36px auto 64px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: clamp(24px, 4vw, 44px);
}

.note-header {
  display: grid;
  gap: 8px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.note-header__eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.note-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .note-header__title {
  letter-spacing: 0;
}

.note-header__desc {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.note-body {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

@media (max-width: 640px) {
  .note-page {
    margin: 24px auto 48px;
  }
}
</style>

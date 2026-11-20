<template>
  <p class="prose-paragraph">
    <slot />
  </p>
</template>

<style scoped>
.prose-paragraph {
  margin-top: 16px;
  margin-bottom: 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  text-wrap: pretty;
}

.prose-paragraph :deep(strong) {
  color: var(--color-text);
  font-weight: 600;
}

.prose-paragraph :deep(em) {
  color: var(--color-text);
  font-style: normal;
  font-weight: 500;
}

.prose-paragraph :deep(code) {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface-raised);
  color: var(--color-text);
  font-size: 0.875em;
  padding: 2px 6px;
}
</style>

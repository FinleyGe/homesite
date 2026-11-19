<template>
  <blockquote class="prose-quote">
    <slot />
  </blockquote>
</template>

<style scoped>
.prose-quote {
  margin-block: 20px;
  margin-inline: 0;
  border-left: 2px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--color-surface-raised);
  color: var(--color-text-secondary);
  font-style: normal;
  line-height: 1.75;
  padding: 12px 16px;
}

.prose-quote :deep(p:first-child) {
  margin-top: 0;
}
</style>

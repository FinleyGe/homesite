<template>
  <ol class="prose-list prose-list--ordered">
    <slot />
  </ol>
</template>

<style scoped>
.prose-list {
  display: grid;
  gap: 8px;
  margin-block: 16px;
  padding-left: 24px;
  color: var(--color-text-secondary);
  line-height: 1.75;
  font-variant-numeric: tabular-nums;
}

.prose-list--ordered {
  list-style: decimal outside;
}

.prose-list :deep(ul),
.prose-list :deep(ol) {
  margin-block: 8px 4px;
}
</style>

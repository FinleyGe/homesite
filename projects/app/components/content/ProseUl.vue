<template>
  <ul class="prose-list prose-list--unordered">
    <slot />
  </ul>
</template>

<style scoped>
.prose-list {
  display: grid;
  gap: 8px;
  margin-block: 16px;
  padding-left: 20px;
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.prose-list--unordered {
  list-style: disc outside;
}

.prose-list :deep(ul),
.prose-list :deep(ol) {
  margin-block: 8px 4px;
}

.prose-list :deep(input[type="checkbox"]) {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  accent-color: var(--color-accent);
  transform: translateY(2px);
}
</style>

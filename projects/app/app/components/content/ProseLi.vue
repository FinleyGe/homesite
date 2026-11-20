<template>
  <li class="prose-list-item">
    <slot />
  </li>
</template>

<style scoped>
.prose-list-item {
  padding-left: 4px;
}

.prose-list-item::marker {
  color: var(--color-text-muted);
}

.prose-list-item :deep(p) {
  margin-block: 4px;
}

.prose-list-item :deep(code) {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface-raised);
  color: var(--color-text);
  font-size: 0.875em;
  padding: 2px 6px;
}

.prose-list-item:has(input[type="checkbox"]) {
  list-style: none;
}
</style>

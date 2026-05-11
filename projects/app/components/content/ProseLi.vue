<template>
  <li class="prose-list-item">
    <slot />
  </li>
</template>

<style scoped>
.prose-list-item {
  padding-left: 0.15rem;
}

.prose-list-item::marker {
  color: var(--color-rose);
  font-weight: 800;
}

.prose-list-item :deep(p) {
  margin-block: 0.15rem;
}

.prose-list-item:has(input[type="checkbox"]) {
  list-style: none;
}
</style>

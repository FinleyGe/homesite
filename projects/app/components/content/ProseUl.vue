<template>
  <ul class="prose-list prose-list--unordered">
    <slot />
  </ul>
</template>

<style scoped>
.prose-list {
  display: grid;
  gap: 0.45rem;
  margin-block: 1rem 1.2rem;
  padding-left: 1.45rem;
  color: color-mix(in srgb, var(--color-ink) 82%, transparent);
  line-height: 1.78;
}

.prose-list--unordered {
  list-style: disc outside;
}

.prose-list :deep(ul),
.prose-list :deep(ol) {
  margin-block: 0.45rem 0.2rem;
}

.prose-list :deep(input[type="checkbox"]) {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  accent-color: var(--color-rose);
  transform: translateY(0.12rem);
}
</style>

<template>
  <ol class="prose-list prose-list--ordered">
    <slot />
  </ol>
</template>

<style scoped>
.prose-list {
  display: grid;
  gap: 0.45rem;
  margin-block: 1rem 1.2rem;
  padding-left: 1.55rem;
  color: color-mix(in srgb, var(--color-ink) 82%, transparent);
  line-height: 1.78;
}

.prose-list--ordered {
  list-style: decimal outside;
}

.prose-list :deep(ul),
.prose-list :deep(ol) {
  margin-block: 0.45rem 0.2rem;
}
</style>

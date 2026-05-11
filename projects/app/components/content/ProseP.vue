<template>
  <p class="prose-paragraph">
    <slot />
  </p>
</template>

<style scoped>
.prose-paragraph {
  margin-top: 1rem;
  color: color-mix(in srgb, var(--color-ink) 82%, transparent);
  font-size: clamp(1rem, 1.8vw, 1.08rem);
  line-height: 1.86;
  text-wrap: pretty;
}

.prose-paragraph :deep(strong) {
  color: var(--color-rose);
  font-weight: 800;
}

.prose-paragraph :deep(em) {
  color: color-mix(in srgb, var(--color-rose) 72%, var(--color-ink));
}
</style>

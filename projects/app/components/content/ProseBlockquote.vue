<template>
  <blockquote class="prose-quote">
    <slot />
  </blockquote>
</template>

<style scoped>
.prose-quote {
  margin-block: 1.4rem;
  border-left: 0.35rem solid color-mix(in srgb, var(--color-rose) 70%, transparent);
  border-radius: 1.1rem;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-rose-soft) 44%, transparent),
      color-mix(in srgb, var(--color-sky) 20%, transparent)
    );
  color: color-mix(in srgb, var(--color-ink) 78%, transparent);
  font-style: italic;
  line-height: 1.8;
  padding: 1rem 1.15rem;
}
</style>

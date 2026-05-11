<template>
  <a class="prose-link">
    <slot />
  </a>
</template>

<style scoped>
.prose-link {
  color: color-mix(in srgb, var(--color-rose) 78%, var(--color-ink));
  font-weight: 650;
  text-decoration-color: color-mix(in srgb, var(--color-rose) 38%, transparent);
  text-decoration-line: underline;
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.18em;
  transition:
    color 160ms ease,
    text-decoration-color 160ms ease;
}

.prose-link:hover {
  color: var(--color-rose);
  text-decoration-color: var(--color-rose);
}
</style>

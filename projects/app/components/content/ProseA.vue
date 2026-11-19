<template>
  <a class="prose-link">
    <slot />
  </a>
</template>

<style scoped>
.prose-link {
  color: var(--color-accent);
  font-weight: 500;
  text-decoration-color: var(--color-accent-border);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition:
    color 150ms var(--ease-out),
    text-decoration-color 150ms var(--ease-out);
}

.prose-link:hover {
  color: var(--color-accent-hover);
  text-decoration-color: var(--color-accent-hover);
}
</style>

<template>
  <h1 class="prose-heading prose-heading--h1">
    <slot />
  </h1>
</template>

<style scoped>
.prose-heading {
  color: var(--color-text);
  scroll-margin-top: 80px;
  text-wrap: balance;
}

.prose-heading--h1 {
  margin: 0 0 20px;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

:global([lang^="zh"]) .prose-heading--h1 {
  letter-spacing: 0;
}
</style>

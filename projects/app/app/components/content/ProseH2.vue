<template>
  <h2 class="prose-heading prose-heading--h2">
    <slot />
  </h2>
</template>

<style scoped>
.prose-heading {
  color: var(--color-text);
  scroll-margin-top: 80px;
  text-wrap: balance;
}

.prose-heading--h2 {
  margin-top: 40px;
  margin-bottom: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.5vw, 1.625rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.prose-heading--h2:first-child {
  margin-top: 0;
  border-top: 0;
  padding-top: 0;
}

:global([lang^="zh"]) .prose-heading--h2 {
  letter-spacing: 0;
}
</style>

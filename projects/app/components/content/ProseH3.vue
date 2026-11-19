<template>
  <h3 class="prose-heading prose-heading--h3">
    <slot />
  </h3>
</template>

<style scoped>
.prose-heading {
  color: var(--color-text);
  scroll-margin-top: 80px;
  text-wrap: balance;
}

.prose-heading--h3 {
  margin-top: 28px;
  margin-bottom: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
}
</style>

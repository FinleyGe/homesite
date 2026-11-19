<template>
  <h4 class="prose-heading prose-heading--h4">
    <slot />
  </h4>
</template>

<style scoped>
.prose-heading {
  color: var(--color-text);
  scroll-margin-top: 80px;
  text-wrap: balance;
}

.prose-heading--h4 {
  margin-top: 20px;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}
</style>

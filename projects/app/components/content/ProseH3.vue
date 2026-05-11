<template>
  <h3 class="prose-heading prose-heading--h3">
    <slot />
  </h3>
</template>

<style scoped>
.prose-heading {
  color: var(--color-ink);
  scroll-margin-top: 6rem;
  text-wrap: balance;
}

.prose-heading--h3 {
  margin-top: 1.8rem;
  margin-bottom: 0.55rem;
  font-size: clamp(1.28rem, 2.8vw, 1.65rem);
  font-weight: 780;
  letter-spacing: -0.03em;
  line-height: 1.18;
}
</style>

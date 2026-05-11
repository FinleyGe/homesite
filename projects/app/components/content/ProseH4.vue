<template>
  <h4 class="prose-heading prose-heading--h4">
    <slot />
  </h4>
</template>

<style scoped>
.prose-heading {
  color: var(--color-ink);
  scroll-margin-top: 6rem;
  text-wrap: balance;
}

.prose-heading--h4 {
  margin-top: 1.35rem;
  margin-bottom: 0.35rem;
  color: color-mix(in srgb, var(--color-ink) 84%, var(--color-rose));
  font-size: 1.05rem;
  font-weight: 780;
  letter-spacing: 0.02em;
  line-height: 1.3;
}
</style>

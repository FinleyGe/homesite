<template>
  <h1 class="prose-heading prose-heading--h1">
    <slot />
  </h1>
</template>

<style scoped>
.prose-heading {
  color: var(--color-ink);
  scroll-margin-top: 6rem;
  text-wrap: balance;
}

.prose-heading--h1 {
  margin-bottom: 1.25rem;
  font-size: clamp(2.1rem, 5.2vw, 3.6rem);
  font-weight: 850;
  letter-spacing: -0.055em;
  line-height: 1;
}
</style>

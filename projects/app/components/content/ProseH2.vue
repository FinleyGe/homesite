<template>
  <h2 class="prose-heading prose-heading--h2">
    <slot />
  </h2>
</template>

<style scoped>
.prose-heading {
  color: var(--color-ink);
  scroll-margin-top: 6rem;
  text-wrap: balance;
}

.prose-heading--h2 {
  position: relative;
  margin-top: 2.4rem;
  margin-bottom: 0.8rem;
  font-size: clamp(1.75rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.prose-heading--h2::before {
  display: block;
  width: 3.5rem;
  height: 0.35rem;
  margin-bottom: 0.75rem;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-rose), var(--color-mint));
  content: "";
  opacity: 0.72;
}
</style>

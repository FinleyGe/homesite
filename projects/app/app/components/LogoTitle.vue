<script setup lang="ts">
</script>

<template>
  <span class="logo-wordmark">
    Finley Ge
  </span>
</template>

<style scoped>
.logo-wordmark {
  display: inline-flex;
  align-items: center;
  color: var(--color-text);
  font-family: var(--font-signature);
  font-size: 1.125rem;
  font-style: italic;
  font-weight: 400;
  font-variant-ligatures: common-ligatures;
  line-height: 1;
  white-space: nowrap;
  transition: color 150ms var(--ease-out);
}

.logo-wordmark:hover {
  color: var(--color-accent);
}
</style>

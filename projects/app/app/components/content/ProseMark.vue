<script setup lang="ts"></script>

<template>
  <mark class="prose-mark">
    <slot />
  </mark>
</template>

<style scoped>
.prose-mark {
  border-radius: 4px;
  background-color: var(--color-mark-bg);
  color: var(--color-text);
  padding: 1px 4px;
}
</style>

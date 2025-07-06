<script setup lang="ts"></script>
<template>
  <p class="mt-4">
    <slot />
  </p>
</template>

<style scoped lang="scss">
p {
  :deep(strong) {
    @reference text-pink-700 dark:text-pink-300;
  }

  :deep(em) {
    @reference text-purple-700 dark:text-purple-300;
  }
}
</style>

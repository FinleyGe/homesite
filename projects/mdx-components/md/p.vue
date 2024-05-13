<script setup lang="ts">

</script>
<template>
  <p>
    <slot></slot>
  </p>
</template>

<style scoped lang="scss">

p {
  :deep(strong) {
    @apply text-pink-700 dark:text-pink-300;
  }

  :deep(em) {
    @apply text-purple-700 dark:text-purple-300;
  }
}
</style>

<script setup lang="ts">
const hover = ref<boolean>(false);

defineProps<{
  comment?: string;
}>();

</script>
<template>
  <span @mouseover="hover = true" @mouseleave="hover = false" class="relative w-min">
    <u>
      <slot />
    </u>
    <span v-show="hover" class="absolute bg-pink-100 dark:bg-pink-800 rounded-md justify-center align-middle text-center w-max px-4 z-50">
      {{ comment }}
    </span>
  </span>
</template>

<style scoped lang="scss">
</style>

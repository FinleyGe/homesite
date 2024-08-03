<script setup lang="ts">
const hover = ref<boolean>(false);

defineProps<{
  comment?: string;
}>();

</script>
<template>
  <span class="relative w-min" @mouseover="hover = true" @mouseleave="hover = false">
    <u>
      <slot />
    </u>
    <span :class="{ 'show': hover }"
      class="comment absolute bg-pink-100 dark:bg-pink-800 rounded-md justify-center align-middle text-center w-max px-4 z-50">
      {{ comment?.trim() }}
    </span>
  </span>
</template>

<style scoped lang="scss">
.comment {
  display: none;

  &.show {
    display: inline-flex;
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}
</style>

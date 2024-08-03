<script setup lang="ts">
defineProps<{
  circle?: boolean;
  hold?: boolean;
}>();

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default(): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?(): any;
}>();

const slots = useSlots();

</script>
<template>
  <button class="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-3 py-2 m-1
    hover:bg-pink-300 dark:hover:bg-pink-700 hover:text-pink-900 dark:hover:text-pink-100 transition-all
    flex flex-row items-center gap-x-2" :class="{
      'rounded-full': circle,
      'holding': hold,
    }">
    <div v-if="slots.icon" class="w-4 h-4">
      <slot name="icon" />
    </div>
    <slot />
  </button>
</template>

<style scoped lang="scss">
.holding {
  @apply bg-pink-300 dark:bg-pink-700 text-pink-900 dark:text-pink-100;
}
</style>

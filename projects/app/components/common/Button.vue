<script setup lang="ts">
defineProps<{
  circle?: boolean;
  rounded?: boolean;
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
  <button
    class="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 m-1
    hover:bg-pink-300 dark:hover:bg-pink-700 hover:text-pink-900 dark:hover:text-pink-100 transition-all
    flex flex-row items-center gap-x-2" :class="{
      'rounded-full p-2': circle,
      'px-3 py-2': !circle,
      'holding': hold,
      'rounded-3xl': rounded,
  }">
    <div v-if="slots.icon" class="w-4 h-4">
      <slot name="icon" />
    </div>
    <div v-if="slots.default" :class="{ 'w-5 h-5 text-sm': circle }">
      <slot />
    </div>
  </button>
</template>

<style scoped lang="scss">
.holding {
  @reference bg-pink-300 dark:bg-pink-700 text-pink-900 dark:text-pink-100;
}
</style>

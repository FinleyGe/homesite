<script setup lang="ts">
defineProps<{
  circle?: boolean;
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
    class="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 p-2 m-2
    hover:bg-pink-300 dark:hover:bg-pink-700 hover:text-pink-900 dark:hover:text-pink-100"
    :class="circle? 'rounded-full' : 'rounded-lg'"
  >
    <slot/>
    <div v-if="slots.icon" class="w-4 h-4">
      <slot name="icon"/>
    </div>
  </button>
</template>

<style scoped lang="scss">

</style>

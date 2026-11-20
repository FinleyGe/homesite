<script setup lang="ts">

const modal = defineModel<string | number>();
withDefaults(defineProps<{
  type?: 'text' | 'textarea' | 'number';
}>(), {
  type: 'text'
});

</script>
<template>
  <textarea
    v-if="type === 'textarea'" v-model="modal"
    class="rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white text-l p-2" />
  <input
    v-else v-model="modal" :type="type === 'number' ? 'number' : 'text'"
    class="rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white text-l p-2">
</template>

<style scoped></style>

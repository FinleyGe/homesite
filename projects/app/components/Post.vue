<script setup lang="ts">
defineProps<{
  content: string;
  time?: Date;
  lang?: string;
}>();
</script>
<template>
  <div class="m-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md my-4">
    {{ content }}
    <span class="text-xs text-gray-500 dark:text-gray-400">
      {{ time?.toLocaleString() }}
    </span>
    <span class="text-xs text-gray-500 dark:text-gray-400">
      {{ lang }}
    </span>
  </div>
</template>

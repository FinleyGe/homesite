<script setup lang="ts">
const props = defineProps<{
  name: string;
  description: string;
  link: string;
}>();
</script>
<template>
  <div
    class="px-4 py-2 mx-2 rounded-xl bg-pink-200  dark:bg-pink-800 flex-col flex cursor-pointer"
    @click="$router.push(link)">
    <span class="text-xl"> {{ props.name }} </span>
    <span class="text-sm"> {{ props.description }} </span>
  </div>
</template>

<script setup lang="ts">
import PlaygroundItem from '~/components/PlaygroundItem.vue';
const localePath = useLocalePath();

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl"> {{ $t('common.playground') }} </h1>
    <div class="flex flex-row mt-4 gap-4">
      <PlaygroundItem name="Todo List" description="Todo List (Admin only)" :link="localePath('/playground/todolist')" />
      <PlaygroundItem name="Tomato" description="Tomato Clock (Admin only)" :link="localePath('/playground/tomato')" />
    </div>
  </div>

</template>

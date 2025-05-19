<script setup lang="ts">
import type { TocLink } from "@nuxt/content";
defineProps<{
  toc: TocLink[];
}>();
</script>
<template>
  <ul>
    <li v-for="item in toc" :key="item.text" :class="'depth-' + item.depth">
      <a class="hover:underline cursor-pointer" :href="'#' + item.id">{{
        item.text
      }}</a>
      <TableOfContent v-if="item.children" :toc="item.children" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
:deep(div) {
  @apply border-l border-gray-300;
}

:deep(a):hover {
  &::before {
    content: "#";
    margin-right: 0.25rem;
    text-decoration: none;
  }
}

.depth-1 {
  margin-left: 0;
}

.depth-2 {
  margin-left: 0.5rem;
}

.depth-3 {
  margin-left: 1rem;
}

.depth-4 {
  margin-left: 1.5rem;
}
</style>

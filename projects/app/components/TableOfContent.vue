<script setup lang="ts">
interface TOC {
  depth: number;
  value: string;
  attributes?: {
    [key: string]: string;
  }
  children?: TOC[];
}

defineProps<{
  toc: TOC[];
}>();

</script>
<template>
  <div>
    <ul>
      <li v-for="item in toc" :key="item.value" :class="'depth-' + item.depth">
        <a class="hover:underline cursor-pointer" :href="'#' + item?.attributes?.id">{{ item.value }}</a>
        <TableOfContent v-if="item.children" :toc="item.children" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
:deep(div) {
  @apply border-l border-gray-300;
}

:deep(a):hover {
  &::before {
    content: '#';
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

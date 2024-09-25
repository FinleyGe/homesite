<script setup lang="ts">
import { useMDXComponents } from '@mdx-js/vue';
import { run } from '@mdx-js/mdx';
import * as runtime from 'vue/jsx-runtime'
import type bloglist from 'blog/bloglist.json';

const { blog } = defineProps<{
  blog: typeof bloglist[0]
}>();

const { locale } = useI18n();

const loc = (() => {
  const loc = locale.value;
  if (!blog.content[loc]) {
    return blog.lang[0];
  }
  return loc;
})() as 'zh' | 'en';

const {
  data: jsx,
} = useFetch('/api/blog/jsx', {
  query: {
    link: blog.path,
    loc
  },
  server: true
});

const Content = ref();
const toc = ref();

watchEffect(async () => {
  if (jsx.value) {
    const com = await run(jsx.value, {
      ...runtime,
    });
    Content.value = com.default;
    toc.value = com.toc;
  }
});

const components = useMDXComponents();

</script>
<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl font-bold">{{ blog.title[loc] }}</h1>
      <p class="text-gray-500">{{ blog.date }}</p>
    </div>
    <div class="p-4">
      <TableOfContent v-if="toc" :toc="toc as any" />
    </div>
    <Content :components="components" />
  </div>
</template>

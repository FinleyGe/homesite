<script setup lang="ts">
import { MDXProvider } from '@mdx-js/vue';
import bloglist from 'blog/bloglist.json';
import common from 'mdx-components/common';
import md from 'mdx-components/md';
import BlogPage from '~/components/blog/BlogPage.server.vue';

const router = useRouter()

const link = ref<string>(router.currentRoute.value.params.title as string);

if (!bloglist.find((item) => item.link === link.value)) {
  router.push('/404');
}

const blog = bloglist!.find((item) => item.link === link.value)!;

</script>
<template>
  <div>
    <MDXProvider :components="{
      ...md,
      ...common,
    }">
      <BlogPage :blog="blog" />
    </MDXProvider>
  </div>
</template>

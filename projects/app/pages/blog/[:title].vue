<script setup lang="ts">
import { MDXProvider } from '@mdx-js/vue'
import Post from '~/components/Post.vue';
import md from '~/components/md';
import Md from '~/components/md/Md.vue';
import blogs from '~/content/blog/blogs'
import bloglist from '~/content/blog/index'
const router = useRouter()

const title = ref<string>(router.currentRoute.value.params.title as string);
const titles = bloglist.map(
  (item) => item.title
);

if(!titles.includes(title.value)) {
  router.push('/404');
}

const Content = blogs[router.currentRoute.value.params.title];

</script>
<template>
  <div 
    class="max-w-4xl mx-auto"
  >
  <MDXProvider :components="md">
    <Content />
  </MDXProvider>
  </div>
</template>

<style scoped>

</style>

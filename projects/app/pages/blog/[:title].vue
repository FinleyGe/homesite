<script setup lang="ts">
import { MDXProvider } from '@mdx-js/vue'
import md from 'mdx-components/md';
import bloglist from 'blog/index';
const router = useRouter()
const { locale } = useI18n();

const link = ref<string>(router.currentRoute.value.params.title as string);

if (!bloglist.find((item) => item.link === link.value)) {
  router.push('/404');
}

const blog = bloglist!.find((item) => item.link === link.value)!;

let loc = locale.value;
if (!blog.content[loc]) {
  loc = blog.lang[0];
}

const Content = (bloglist!.find((item) => item.link === link.value))!.content[loc]

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

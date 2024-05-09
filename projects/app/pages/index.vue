<script setup lang="ts">
import H1 from '~/components/md/h1.vue';
import about from '~/content/about.mdx';
import aboutZh from '~/content/about.zh.mdx';
// import md from '~/components/common/md.vue';
import { MDXProvider } from '@mdx-js/vue';
import md from '~/components/md'
const { locale } = useI18n();
</script>
<template>
  <div class="p-4 max-w-2xl mx-auto">
    <MDXProvider :components="md">
      <about v-if="locale == 'en'" />
      <aboutZh v-else />
    </MDXProvider>
    <!-- <colorful-button color="pink"> -->
    <!--   Click me -->
    <!-- </colorful-button> -->
  </div>
</template>

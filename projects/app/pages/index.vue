<script setup lang="ts">
import about from '~/content/about.mdx';
import aboutZh from '~/content/about.zh.mdx';
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
  </div>
</template>

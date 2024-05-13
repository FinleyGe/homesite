<script setup lang="ts">
import BlogList from '~/content/blog';
const { t } = useI18n();
useHead({
  title: t('blog.list'),
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="font-bold text-2xl">
      {{ t('blog.list') }}
    </h1>
    <div class="flex flex-col">
      <div 
        v-for="blog in BlogList" 
        :key="blog.link"
        class="mt-4 bg-pink-200 dark:bg-pink-800 p-4 rounded-lg shadow-md"
      >
        <NuxtLink
          :to="`/blog/${blog.link}`"
        >
        <span class="font-bold text-lg">
          {{ blog.title }}
        </span>
        <div class="text-sm">
          {{ blog.date}}
        </div>
      </NuxtLink>
      </div>
      </div>
  </div>
</template>

<style scoped>

</style>

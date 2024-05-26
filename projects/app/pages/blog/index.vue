<script setup lang="ts">
import BlogList from 'blog';
const { t, locale } = useI18n();
const localePath = useLocalePath();
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
        v-for="blog in BlogList.sort((a, b) => new Date(b.date) - new Date(a.date))" :key="blog.link"
        class="mt-4 bg-pink-200 dark:bg-pink-800 p-4 rounded-lg shadow-md">
        <NuxtLink :to="localePath(`/blog/${blog.link}`)">
          <span class="font-bold text-lg">
            {{ blog.title[locale] }}
          </span>
          <p class="mt-1">
            {{ blog.description[locale] }}
          </p>
          <div class="text-sm">
            {{ blog.date }}
            <span v-for="tag in blog.lang" :key="tag" class="text-sm mx-1">
              {{ $t(`lang.${tag}`) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

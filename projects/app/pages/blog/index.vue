<script setup lang="ts">
import { Rss } from '@vicons/carbon';
import BlogList, { Tags } from 'blog';

import Button from '~/components/common/Button.vue';
const { t, locale } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const queryTag = ref<string | null>(null);

router.beforeEach((to) => {
  queryTag.value = to.query.tag as string;
});

useHead({
  title: t('blog.list'),
});
const openFeed = () => {
  window.open('/blog/rss.xml', '_blank');
};

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="font-bold text-2xl cursor-pointer" @click="() => $router.push(localePath('/blog'))">
      {{ t('blog.list') }}
      <Button @click="openFeed">
        <template #icon>
          <Rss />
        </template>
      </Button>
    </h1>
    <div class="flex flex-col">
      <div
v-for="blog in BlogList.sort((a, b) => new Date(b.date) - new Date(a.date)).filter((item) => {
        return !queryTag ? true : item?.tag?.includes(queryTag);
      })" :key="blog.link" class="mt-4 bg-pink-200 dark:bg-pink-800 p-4 rounded-lg shadow-md">
        <NuxtLink :to="localePath(`/blog/${blog.link}`)">
          <span class="font-bold text-lg">
            {{ blog.title[locale] }}
          </span>
          <p>
            {{ blog.description[locale] }}
          </p>
        </NuxtLink>
        <div class="text-sm text-right">
          {{ blog.date }}
          <span v-for="tag in blog.lang" :key="tag" class="text-sm mx-1">
            {{ $t(`lang.${tag}`) }}
          </span>
        </div>
        <div class="text-sm mt-2">
          <span
v-for="tag in blog.tag" :key="tag"
            class="text-sm m-1 p-1 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
            @click="() => $router.push(localePath(`/blog?tag=${tag}`))">
            #{{ Tags[tag][locale] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rss, Hashtag, Search, Archive } from '@vicons/carbon';
import BlogList, { Tags } from 'blog';
import Button from '~/components/common/Button.vue';

const i18n = useI18n({
  messages: {
    zh: {
      Feed: '订阅',
      Tags: '标签',
      Search: '搜索',
      Archive: '归档',
    },
    en: {
      Feed: 'Feed',
      Tags: 'Tags',
      Search: 'Search',
      Archive: 'Archive',
    },
  }
});

type Tag = keyof typeof Tags;

const { t } = i18n;
const locale = i18n.locale.value as 'en' | 'zh';

const localePath = useLocalePath();
const router = useRouter();

const queryTag = ref<Tag | null>(null);
const querySearch = ref<string | null>(null);
const queryArchive = ref<string | null>(null);

const option = ref<'tag' | 'search' | 'archive' | null>(null);

router.beforeEach((to) => {
  queryTag.value = to.query.tag as Tag;
  querySearch.value = to.query.search as string;
  queryArchive.value = to.query.archive as string;
});

const months = Array.from(new Set(BlogList.map((item) => item.date.slice(0, 7))
  .sort((a, b) => new Date(b) - new Date(a))
  .map((item) => item.slice(0, 7))));

watchEffect(() => {
  if (queryTag.value) {
    option.value = 'tag';
  } else if (querySearch.value) {
    option.value = 'search';
  } else if (queryArchive.value) {
    option.value = 'archive';
  }
});

const BlogListFiltered = computed(() => {
  return BlogList.filter((item) => {
    if (queryTag.value) {
      return item.tag?.includes(queryTag.value);
    }
    if (querySearch.value) {
      return item.title[locale].toLowerCase().includes(querySearch.value.toLowerCase());
    }
    if (queryArchive.value) {
      return item.date.includes(queryArchive.value);
    }
    return true;
  });
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
    <div class="flex flex-row items-center gap-x-4 flex-wrap">
      <h1 class="font-bold text-2xl cursor-pointer" @click="() => $router.push(localePath('/blog'))">
        {{ t('blog.list') }}
      </h1>

      <div class="flex flex-row flex-wrap">
        <Button circle @click="openFeed">
          {{ t('Feed') }}
          <template #icon>
            <Rss />
          </template>
        </Button>

        <Button circle :hold="option === 'tag'" @click="option = option === null ? 'tag' : (queryTag = null, null)">
          {{ t('Tags') }}
          <template #icon>
            <Hashtag />
          </template>
        </Button>

        <Button circle :hold="option === 'search'"
          @click="option = option === null ? 'search' : (querySearch = null, null)">
          {{ t('Search') }}
          <template #icon>
            <Search />
          </template>
        </Button>

        <Button circle :hold="option === 'archive'"
          @click="option = option === null ? 'archive' : (queryArchive = null, null)">
          {{ t('Archive') }}
          <template #icon>
            <Archive />
          </template>
        </Button>
      </div>
    </div>

    <div v-if="option === 'tag'" class="flex flex-row flex-wrap gap-2 mt-4">
      <span v-for="tag in Object.keys(Tags)" :key="tag"
        class="text-sm m-1 p-1 px-2 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
        @click="() => $router.push(localePath(`/blog?tag=${tag}`))">
        {{ (Tags[tag as keyof typeof Tags] as any)[locale] }}
      </span>
    </div>

    <div v-if="option === 'search'" class="mt-4">
      <input v-model="querySearch" type="text" class="w-full p-2 rounded-lg" placeholder="Search">
    </div>

    <div v-if="option === 'archive'" class="mt-4">
      <div class="flex flex-row flex-wrap gap-2">
        <span v-for="month in months" :key="month"
          class="text-sm m-1 p-1 px-2 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
          @click="() => $router.push(localePath(`/blog?archive=${month}`))">
          {{ month }}
        </span>
      </div>
    </div>

    <div class="flex flex-col">
      <div v-for="blog in BlogListFiltered.sort((a, b) => new Date(b.date) - new Date(a.date)).filter((item) => {
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
          <span v-for="tag in blog.tag" :key="tag"
            class="text-sm m-1 p-1 px-2 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
            @click="() => $router.push(localePath(`/blog?tag=${tag}`))">
            #{{ Tags[tag][locale] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

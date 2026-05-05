<script setup lang="ts">
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Hashtag,
  Rss,
  Search,
} from "@vicons/carbon";
import Button from "~/components/common/Button.vue";

const BLOGS_PER_PAGE = 10;

const { t } = useI18n({
  messages: {
    zh: {
      Feed: "订阅",
      Tags: "标签",
      Search: "搜索",
      Archive: "归档",
      count: "博客数量",
      page: "页",
      Previous: "上一页",
      Next: "下一页",
    },
    en: {
      Feed: "Feed",
      Tags: "Tags",
      Search: "Search",
      Archive: "Archive",
      count: "The number of blogs",
      page: "Page",
      Previous: "Previous",
      Next: "Next",
    },
  },
});

const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const isBlogSearchOpen = useState("blog-content-search-open", () => false);

const { data: blogsTotal } = useAsyncData(
  async () => (await queryCollection("blog").count()) ?? 0,
);

const { data: blogs } = useAsyncData("blogs", () => {
  return queryCollection("blog")
    .order("create", "DESC")
    .select(
      "id",
      "title",
      "path",
      "description",
      "create",
      "lang",
      "update",
      "tags",
    )
    .all();
});

const queryTag = computed(() => {
  const value = route.query.tag;
  return typeof value === "string" ? value : null;
});

const queryArchive = computed(() => {
  const value = route.query.archive;
  return typeof value === "string" ? value : null;
});

const queryPage = computed(() => {
  const value = route.query.page;
  const page = typeof value === "string" ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(page) && page > 0 ? page : 1;
});

type BlogFilter = "tag" | "archive";
type BlogQuery = Partial<Record<BlogFilter | "page", string>>;

const option = ref<BlogFilter | null>(null);

const getActiveFilterQuery = (): BlogQuery => {
  if (queryTag.value) {
    return { tag: queryTag.value };
  }

  if (queryArchive.value) {
    return { archive: queryArchive.value };
  }

  return {};
};

const setBlogQuery = async (key: BlogFilter, value: string | null) => {
  await router.replace({
    path: localePath("/blog"),
    query: value ? { [key]: value } : {},
  });
};

const setPage = async (page: number) => {
  const nextPage = Math.min(Math.max(1, page), totalPages.value);
  const query: BlogQuery = getActiveFilterQuery();

  if (nextPage > 1) {
    query.page = String(nextPage);
  }

  await router.replace({
    path: localePath("/blog"),
    query,
  });
};

const toggleOption = (nextOption: BlogFilter) => {
  if (option.value === nextOption) {
    option.value = null;
    void setBlogQuery(nextOption, null);
    return;
  }

  option.value = nextOption;

  if (queryTag.value || queryArchive.value) {
    void setBlogQuery(nextOption, null);
  }
};

const blogTags = computed(() => {
  return Array.from(
    new Set((blogs.value ?? []).flatMap((item) => item.tags ?? [])),
  ).sort();
});

const months = computed(() => {
  return Array.from(
    new Set(
      (blogs.value ?? [])
        .map((item) => item.create.slice(0, 7))
        .sort((a, b) => Number(new Date(b)) - Number(new Date(a))),
    ),
  );
});

watchEffect(() => {
  if (queryTag.value) {
    option.value = "tag";
    return;
  }

  if (queryArchive.value) {
    option.value = "archive";
    return;
  }

  option.value = null;
});

const BlogListFiltered = computed(() => {
  const tag = queryTag.value;
  const archive = queryArchive.value;

  return (blogs.value ?? []).filter((item) => {
    if (tag) {
      return item.tags?.includes(tag);
    }

    if (archive) {
      return item.create.startsWith(archive);
    }

    return true;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(BlogListFiltered.value.length / BLOGS_PER_PAGE));
});

const currentPage = computed(() => {
  return Math.min(queryPage.value, totalPages.value);
});

const BlogListPaginated = computed(() => {
  const start = (currentPage.value - 1) * BLOGS_PER_PAGE;
  return BlogListFiltered.value.slice(start, start + BLOGS_PER_PAGE);
});

const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  const normalizedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - normalizedStart + 1 },
    (_, index) => normalizedStart + index,
  );
});

useHead({
  title: t("blog.list"),
});

const openFeed = () => {
  window.open("/blog/rss.xml", "_blank");
};
</script>
<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-row items-center gap-x-4 flex-wrap">
      <h1
        class="font-bold text-2xl cursor-pointer"
        @click="() => router.push(localePath('/blog'))"
      >
        {{ t("blog.list") }}
      </h1>

      <div class="flex flex-row flex-wrap">
        <Button rounded @click="openFeed">
          {{ t("Feed") }}
          <template #icon>
            <Rss />
          </template>
        </Button>

        <Button rounded :hold="option === 'tag'" @click="toggleOption('tag')">
          {{ t("Tags") }}
          <template #icon>
            <Hashtag />
          </template>
        </Button>

        <Button rounded :hold="isBlogSearchOpen" @click="isBlogSearchOpen = true">
          {{ t("Search") }}
          <template #icon>
            <Search />
          </template>
        </Button>

        <Button
          rounded
          :hold="option === 'archive'"
          @click="toggleOption('archive')"
        >
          {{ t("Archive") }}
          <template #icon>
            <Archive />
          </template>
        </Button>
      </div>
    </div>

    <div v-if="option === 'tag'" class="flex flex-row flex-wrap gap-2 mt-4">
      <span
        v-for="tag in blogTags"
        :key="tag"
        class="text-sm m-1 p-1 px-2 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
        @click="() => setBlogQuery('tag', tag)"
      >
        #{{ tag }}
      </span>
    </div>

    <div v-if="option === 'archive'" class="mt-4">
      <div class="flex flex-row flex-wrap gap-2">
        <span
          v-for="month in months"
          :key="month"
          class="text-sm m-1 p-1 px-2 bg-pink-300 rounded-xl dark:bg-pink-600 hover:bg-pink-400 hover:dark:bg-pink-500 cursor-pointer"
          @click="() => setBlogQuery('archive', month)"
        >
          {{ month }}
        </span>
      </div>
    </div>

    <span class="text-md mt-4"> {{ t("count") }}: {{ blogsTotal }} </span>

    <div class="flex flex-col">
      <div
        v-for="blog in BlogListPaginated"
        :key="blog.id"
        class="mt-4 bg-pink-100 dark:bg-gray-900 p-4 rounded-lg shadow-md"
      >
        <NuxtLink :to="blog.path">
          <span class="font-bold text-lg">
            {{ blog.title }}
          </span>
          <p>
            {{ blog.description }}
          </p>
        </NuxtLink>
        <div class="text-sm text-right">
          {{ blog.update ?? blog.create }}
          <span class="text-sm mx-1">
            {{ t(`lang.${blog.lang}`) }}
          </span>
        </div>

        <div class="text-sm mt-2">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="text-sm m-1 p-1 px-2 bg-sky-300 rounded-xl dark:bg-gray-800 hover:bg-sky-500 hover:dark:bg-gray-700 cursor-pointer"
            @click="() => setBlogQuery('tag', tag)"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex flex-row items-center justify-center gap-1 mt-6 flex-wrap"
    >
      <Button
        rounded
        :disabled="currentPage === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        @click="() => setPage(currentPage - 1)"
      >
        {{ t("Previous") }}
        <template #icon>
          <ChevronLeft />
        </template>
      </Button>

      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="min-w-10 h-10 px-3 rounded-full text-sm transition-colors bg-pink-100 dark:bg-gray-900 text-pink-800 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-gray-800"
        :class="{
          'bg-pink-300 dark:bg-pink-700 text-pink-900 dark:text-pink-100':
            page === currentPage,
        }"
        @click="() => setPage(page)"
      >
        {{ page }}
      </button>

      <span class="text-sm mx-2 text-gray-600 dark:text-gray-300">
        {{ t("page") }} {{ currentPage }} / {{ totalPages }}
      </span>

      <Button
        rounded
        :disabled="currentPage === totalPages"
        :class="{
          'opacity-50 cursor-not-allowed': currentPage === totalPages,
        }"
        @click="() => setPage(currentPage + 1)"
      >
        {{ t("Next") }}
        <template #icon>
          <ChevronRight />
        </template>
      </Button>
    </div>
  </div>
</template>

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
      blog: {
        list: "博客列表",
      },
      Feed: "订阅",
      Tags: "标签",
      Search: "搜索",
      Archive: "归档",
      count: "博客数量",
      eyebrow: "Writing archive",
      intro: "技术笔记、产品观察，以及一些正在发生的日常切片。",
      lang: {
        zh: "中文",
        en: "英文",
      },
      page: "页",
      Previous: "上一页",
      Next: "下一页",
    },
    en: {
      blog: {
        list: "Blog List",
      },
      Feed: "Feed",
      Tags: "Tags",
      Search: "Search",
      Archive: "Archive",
      count: "The number of blogs",
      eyebrow: "Writing archive",
      intro: "Technical notes, product observations, and slices of everyday life.",
      lang: {
        zh: "Chinese",
        en: "English",
      },
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
  <div class="blog-index mx-auto">
    <section class="blog-index__hero" aria-labelledby="blog-list-title">
      <div class="blog-index__hero-copy">
        <p class="blog-index__eyebrow">
          {{ t("eyebrow") }}
        </p>

        <h1
          id="blog-list-title"
          class="blog-index__title"
          @click="() => router.push(localePath('/blog'))"
        >
          {{ t("blog.list") }}
        </h1>

        <p class="blog-index__intro">
          {{ t("intro") }}
        </p>

        <p class="blog-index__count">
          {{ t("count") }}: {{ blogsTotal }}
        </p>
      </div>

      <div class="blog-index__actions" aria-label="Blog filters">
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
    </section>

    <section
      v-if="option === 'tag'"
      class="blog-index__filter-panel"
      aria-label="Tag filter"
    >
      <button
        v-for="tag in blogTags"
        :key="tag"
        type="button"
        class="blog-index__filter-chip"
        :class="{ 'is-active': queryTag === tag }"
        @click="() => setBlogQuery('tag', tag)"
      >
        #{{ tag }}
      </button>
    </section>

    <section
      v-if="option === 'archive'"
      class="blog-index__filter-panel"
      aria-label="Archive filter"
    >
      <button
        v-for="month in months"
        :key="month"
        type="button"
        class="blog-index__filter-chip"
        :class="{ 'is-active': queryArchive === month }"
        @click="() => setBlogQuery('archive', month)"
      >
        {{ month }}
      </button>
    </section>

    <section class="blog-index__list" aria-live="polite">
      <article
        v-for="blog in BlogListPaginated"
        :key="blog.id"
        class="blog-card"
      >
        <NuxtLink class="blog-card__link" :to="blog.path">
          <div class="blog-card__copy">
            <h2 class="blog-card__title">
              {{ blog.title }}
            </h2>

            <p class="blog-card__description">
              {{ blog.description }}
            </p>
          </div>

          <div class="blog-card__meta">
            <span>{{ blog.update ?? blog.create }}</span>
            <span>{{ t(`lang.${blog.lang}`) }}</span>
          </div>
        </NuxtLink>

        <div class="blog-card__tags" aria-label="Blog tags">
          <button
            v-for="tag in blog.tags"
            :key="tag"
            type="button"
            class="blog-tag"
            :class="{ 'is-active': queryTag === tag }"
            @click="() => setBlogQuery('tag', tag)"
          >
            #{{ tag }}
          </button>
        </div>
      </article>
    </section>

    <nav
      v-if="totalPages > 1"
      class="blog-index__pagination"
      aria-label="Blog pages"
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
        class="blog-page-button"
        :class="{ 'is-active': page === currentPage }"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="() => setPage(page)"
      >
        {{ page }}
      </button>

      <span class="blog-index__page-status">
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
    </nav>
  </div>
</template>

<style scoped>
.blog-index {
  width: min(100% - clamp(2rem, 5vw, 4rem), 64rem);
  padding-bottom: 4rem;
}

.blog-index__hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
  padding: clamp(1.35rem, 4vw, 2.5rem);
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 2rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.84),
      rgba(255, 248, 243, 0.72) 55%,
      rgba(207, 234, 242, 0.5)
    );
  box-shadow: 0 22px 60px rgba(23, 32, 51, 0.08);
  backdrop-filter: blur(18px);
}

.blog-index__hero-copy {
  display: grid;
  gap: 0.65rem;
}

.blog-index__eyebrow,
.blog-index__count,
.blog-index__page-status,
.blog-card__meta {
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.blog-index__eyebrow {
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.blog-index__title {
  max-width: 9ch;
  color: rgb(23, 32, 51);
  cursor: pointer;
  font-size: clamp(2.4rem, 7vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 0.92;
  text-wrap: balance;
}

.blog-index__intro {
  max-width: 44rem;
  color: rgba(23, 32, 51, 0.76);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  text-wrap: pretty;
}

.blog-index__actions,
.blog-index__pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.blog-index__actions {
  justify-content: flex-end;
}

.blog-index__actions :deep(button),
.blog-index__pagination :deep(button) {
  min-height: 2.75rem;
  margin: 0;
  border: 1px solid rgba(196, 68, 124, 0.14);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 26px rgba(23, 32, 51, 0.08);
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.blog-index__actions :deep(button:hover),
.blog-index__pagination :deep(button:hover),
.blog-index__filter-chip:hover,
.blog-tag:hover,
.blog-page-button:hover {
  transform: translateY(-1px);
}

.blog-index__actions :deep(.holding) {
  border-color: rgba(196, 68, 124, 0.22);
  background: rgba(246, 217, 228, 0.92);
}

.blog-index__filter-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.56);
}

.blog-index__list {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.25rem;
}

.blog-card {
  padding: clamp(1.15rem, 3vw, 1.65rem);
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 1.45rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8),
      rgba(255, 248, 243, 0.64)
    );
  box-shadow: 0 16px 42px rgba(23, 32, 51, 0.07);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.blog-card:hover {
  border-color: rgba(23, 32, 51, 0.16);
  box-shadow: 0 20px 54px rgba(23, 32, 51, 0.1);
  transform: translateY(-2px);
}

.blog-card__link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 1rem;
  min-height: 2.75rem;
  color: inherit;
  text-decoration: none;
}

.blog-card__copy {
  min-width: 0;
}

.blog-card__title {
  color: rgb(23, 32, 51);
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  font-weight: 750;
  letter-spacing: -0.025em;
  line-height: 1.25;
  text-wrap: balance;
}

.blog-card__description {
  display: -webkit-box;
  max-width: 72ch;
  margin-top: 0.55rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: rgba(23, 32, 51, 0.75);
  font-size: 1rem;
  line-height: 1.72;
}

.blog-card__meta {
  display: flex;
  gap: 0.45rem;
  align-items: flex-start;
  justify-self: end;
  white-space: nowrap;
}

.blog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.blog-index__filter-chip,
.blog-tag,
.blog-page-button {
  min-height: 2.75rem;
  border: 1px solid rgba(17, 153, 119, 0.12);
  border-radius: 999px;
  background: rgba(207, 234, 242, 0.72);
  color: rgb(23, 32, 51);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0 0.9rem;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.blog-index__filter-chip.is-active,
.blog-tag.is-active,
.blog-page-button.is-active {
  border-color: rgba(17, 153, 119, 0.24);
  background: rgba(17, 153, 119, 0.16);
}

.blog-page-button {
  min-width: 2.75rem;
  border-color: rgba(196, 68, 124, 0.14);
  background: rgba(255, 255, 255, 0.72);
}

.blog-index__pagination {
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
}

:global(.dark) .blog-index__hero,
:global(.dark) .blog-index__filter-panel,
:global(.dark) .blog-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(17, 24, 39, 0.76);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

:global(.dark) .blog-index__title,
:global(.dark) .blog-card__title,
:global(.dark) .blog-index__filter-chip,
:global(.dark) .blog-tag,
:global(.dark) .blog-page-button {
  color: rgba(248, 250, 252, 0.94);
}

:global(.dark) .blog-index__intro,
:global(.dark) .blog-card__description {
  color: rgba(226, 232, 240, 0.76);
}

:global(.dark) .blog-index__eyebrow,
:global(.dark) .blog-index__count,
:global(.dark) .blog-index__page-status,
:global(.dark) .blog-card__meta {
  color: rgba(226, 232, 240, 0.62);
}

:global(.dark) .blog-index__actions :deep(button),
:global(.dark) .blog-index__pagination :deep(button),
:global(.dark) .blog-page-button {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
}

:global(.dark) .blog-index__filter-chip,
:global(.dark) .blog-tag {
  border-color: rgba(207, 234, 242, 0.16);
  background: rgba(31, 41, 55, 0.82);
}

@media (max-width: 720px) {
  .blog-index {
    width: min(100% - 2rem, 64rem);
  }

  .blog-index__hero {
    grid-template-columns: 1fr;
    align-items: start;
    border-radius: 1.5rem;
  }

  .blog-index__actions {
    justify-content: flex-start;
  }

  .blog-index__actions :deep(button) {
    flex: 1 1 calc(50% - 0.5rem);
    justify-content: center;
  }

  .blog-card__link {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .blog-card__meta {
    justify-self: start;
  }

  .blog-card__description {
    -webkit-line-clamp: 4;
  }
}
</style>

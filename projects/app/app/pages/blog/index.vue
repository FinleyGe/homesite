<script setup lang="ts">
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Close,
  Hashtag,
  Rss,
  Search,
} from "@vicons/carbon";
import Button from "~/components/common/Button.vue";

const BLOGS_PER_PAGE = 10;

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const isBlogSearchOpen = useState("blog-content-search-open", () => false);

const { data: blogsTotal } = await useAsyncData(
  "blogs-total",
  async () => (await queryCollection("blog").count()) ?? 0,
);

const { data: blogs } = await useAsyncData("blogs", () => {
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
      "cover",
      "coverAlt",
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

const clearFilters = async () => {
  option.value = null;
  await router.replace({
    path: localePath("/blog"),
    query: {},
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
  title: computed(() => t("blog.list")),
});

const openFeed = () => {
  window.open("/blog/rss.xml", "_blank");
};
</script>

<template>
  <div class="blog-index">
    <header class="blog-index__header" aria-labelledby="blog-list-title">
      <div class="blog-index__header-copy">
        <p class="blog-index__eyebrow">
          <span>{{ t("blog.eyebrow") }}</span>
          <span aria-hidden="true">·</span>
          <span class="blog-index__count">{{ t("blog.count", { count: blogsTotal ?? 0 }) }}</span>
        </p>

        <h1
          id="blog-list-title"
          class="blog-index__title"
          @click="clearFilters"
        >
          {{ t("blog.list") }}
        </h1>

        <p class="blog-index__intro">
          {{ t("blog.intro") }}
        </p>
      </div>

      <div class="blog-index__actions" aria-label="Blog controls">
        <Button :hold="isBlogSearchOpen" @click="isBlogSearchOpen = true">
          <template #icon>
            <Search />
          </template>
          {{ t("blog.search") }}
        </Button>

        <Button :hold="option === 'tag'" @click="toggleOption('tag')">
          <template #icon>
            <Hashtag />
          </template>
          {{ t("blog.tags") }}
        </Button>

        <Button :hold="option === 'archive'" @click="toggleOption('archive')">
          <template #icon>
            <Archive />
          </template>
          {{ t("blog.archive") }}
        </Button>

        <Button @click="openFeed">
          <template #icon>
            <Rss />
          </template>
          {{ t("blog.feed") }}
        </Button>
      </div>
    </header>

    <section
      v-if="option === 'tag'"
      class="blog-index__filter-panel"
      aria-label="Tag filter"
    >
      <button
        v-for="tag in blogTags"
        :key="tag"
        type="button"
        class="blog-chip"
        :class="{ 'is-active': queryTag === tag }"
        @click="() => setBlogQuery('tag', queryTag === tag ? null : tag)"
      >
        #{{ tag }}
      </button>

      <button
        v-if="queryTag"
        type="button"
        class="blog-chip blog-chip--clear"
        @click="clearFilters"
      >
        <Close class="blog-chip__icon" aria-hidden="true" />
        <span>{{ t("blog.clearFilter") }}</span>
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
        class="blog-chip"
        :class="{ 'is-active': queryArchive === month }"
        @click="() => setBlogQuery('archive', queryArchive === month ? null : month)"
      >
        {{ month }}
      </button>

      <button
        v-if="queryArchive"
        type="button"
        class="blog-chip blog-chip--clear"
        @click="clearFilters"
      >
        <Close class="blog-chip__icon" aria-hidden="true" />
        <span>{{ t("blog.clearFilter") }}</span>
      </button>
    </section>

    <section class="blog-index__list" aria-live="polite">
      <article
        v-for="blog in BlogListPaginated"
        :key="blog.id"
        class="blog-row"
        :class="{ 'blog-row--with-cover': Boolean(blog.cover) }"
      >
        <div class="blog-row__main">
          <NuxtLink class="blog-row__link" :to="localePath(blog.path)">
            <div class="blog-row__meta">
              <span>{{ blog.update ?? blog.create }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ t(`lang.${blog.lang}`) }}</span>
            </div>

            <h2 class="blog-row__title">
              {{ blog.title }}
            </h2>

            <p v-if="blog.description" class="blog-row__description">
              {{ blog.description }}
            </p>
          </NuxtLink>

          <div v-if="blog.tags?.length" class="blog-row__tags" aria-label="Blog tags">
            <button
              v-for="tag in blog.tags"
              :key="tag"
              type="button"
              class="blog-tag"
              :class="{ 'is-active': queryTag === tag }"
              @click="() => setBlogQuery('tag', queryTag === tag ? null : tag)"
            >
              #{{ tag }}
            </button>
          </div>
        </div>

        <NuxtLink
          v-if="blog.cover"
          class="blog-row__thumb"
          :to="localePath(blog.path)"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            :src="blog.cover"
            :alt="blog.coverAlt ?? blog.title"
            loading="lazy"
            decoding="async"
          >
        </NuxtLink>
      </article>
    </section>

    <nav
      v-if="totalPages > 1"
      class="blog-index__pagination"
      aria-label="Blog pages"
    >
      <Button
        :disabled="currentPage === 1"
        @click="() => setPage(currentPage - 1)"
      >
        <template #icon>
          <ChevronLeft />
        </template>
        {{ t("blog.previous") }}
      </Button>

      <div class="blog-index__pages">
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
      </div>

      <span class="blog-index__page-status">
        {{ t("blog.pageStatus", { current: currentPage, total: totalPages }) }}
      </span>

      <Button
        :disabled="currentPage === totalPages"
        @click="() => setPage(currentPage + 1)"
      >
        {{ t("blog.next") }}
        <template #icon>
          <ChevronRight />
        </template>
      </Button>
    </nav>
  </div>
</template>

<style scoped>
.blog-index {
  width: min(100%, 65rem);
  margin-inline: auto;
  padding: 40px 0 64px;
}

.blog-index__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px 32px;
  align-items: end;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
}

.blog-index__header-copy {
  display: grid;
  gap: 8px;
}

.blog-index__eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.blog-index__count {
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
}

.blog-index__title {
  margin: 0;
  color: var(--color-text);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

:global([lang^="zh"]) .blog-index__title {
  letter-spacing: 0;
}

.blog-index__intro {
  margin: 4px 0 0;
  max-width: 38rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.blog-index__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.blog-index__filter-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.blog-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  padding: 0 10px;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.blog-chip:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.blog-chip.is-active {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.blog-chip--clear {
  font-family: var(--font-body);
  color: var(--color-text-muted);
}

.blog-chip__icon {
  width: 14px;
  height: 14px;
}

.blog-index__list {
  display: grid;
}

.blog-row {
  display: grid;
  gap: 20px;
  border-bottom: 1px solid var(--color-border);
  padding: 24px 0;
}

.blog-row--with-cover {
  grid-template-columns: minmax(0, 1fr) 180px;
  align-items: start;
}

.blog-row__thumb {
  display: block;
  overflow: hidden;
  aspect-ratio: 3 / 2;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
}

.blog-row__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-row__main {
  min-width: 0;
}

.blog-row__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.blog-row__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  white-space: nowrap;
}

.blog-row__title {
  margin: 4px 0 0;
  color: var(--color-text);
  font-size: 1.1875rem;
  font-weight: 500;
  line-height: 1.4;
  transition: color 150ms var(--ease-out);
}

.blog-row__link:hover .blog-row__title {
  color: var(--color-accent);
}

.blog-row__description {
  display: -webkit-box;
  max-width: 68ch;
  margin: 8px 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.blog-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.blog-tag {
  min-height: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: var(--font-code);
  font-size: 0.75rem;
  line-height: 1;
  padding: 0 8px;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.blog-tag:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.blog-tag.is-active {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.blog-index__pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.blog-index__pages {
  display: flex;
  gap: 4px;
}

.blog-page-button {
  min-width: 36px;
  min-height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: var(--font-code);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  padding: 0 10px;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.blog-page-button:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.blog-page-button.is-active {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 500;
}

.blog-index__page-status {
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 760px) {
  .blog-index {
    padding: 28px 0 48px;
  }

  .blog-index__header {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .blog-index__actions {
    justify-content: flex-start;
  }

  .blog-row--with-cover {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>

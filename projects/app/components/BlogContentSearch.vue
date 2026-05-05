<script setup lang="ts">
import { Close } from "@vicons/carbon";
import type { ContentNavigationItem } from "@nuxt/content";

type BlogSearchSection = {
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
};

type BlogSearchItem = {
  label: string;
  suffix?: string;
  to: string;
  content: string;
  titles: string[];
  snippet: string;
  levelLabel: string;
  onSelect?: () => void;
};

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local",
  messages: {
    zh: {
      SearchTitle: "搜索博客内容",
      SearchPlaceholder: "搜索标题、正文和小标题",
      SearchResults: "搜索结果",
      NoResults: "没有找到匹配的内容",
      LoadingSearch: "索引加载中",
      CloseSearch: "关闭搜索",
    },
    en: {
      SearchTitle: "Search blog content",
      SearchPlaceholder: "Search titles, body text, and headings",
      SearchResults: "Search results",
      NoResults: "No matching content found",
      LoadingSearch: "Loading index",
      CloseSearch: "Close search",
    },
  },
});

const isOpen = useState("blog-content-search-open", () => false);
const searchTerm = ref("");

const { data: searchSections, pending: sectionsPending } = useAsyncData<
  BlogSearchSection[]
>("blog-search-sections", () => queryCollectionSearchSections("blog"), {
  default: () => [],
});

const { data: blogNavigation } = useAsyncData<ContentNavigationItem[]>(
  "blog-search-navigation",
  () => queryCollectionNavigation("blog", ["title", "path"]),
  {
    default: () => [],
  },
);

const pathByTitle = computed(() => {
  const map = new Map<string, string>();

  const walk = (items: ContentNavigationItem[]) => {
    for (const item of items) {
      map.set(item.title.trim().toLowerCase(), item.path);

      if (item.children?.length) {
        walk(item.children);
      }
    }
  };

  walk(blogNavigation.value ?? []);

  return map;
});

const searchGroups = computed(() => {
  const items: BlogSearchItem[] = [];

  for (const section of searchSections.value ?? []) {
    const pageTitle = section.titles[0] ?? section.title;
    const pagePath =
      pathByTitle.value.get(pageTitle.trim().toLowerCase()) ?? "/blog";
    const snippet = section.content.replace(/\s+/g, " ").trim().slice(0, 160);

    items.push({
      label: section.title,
      suffix: pageTitle,
      to: section.id ? `${pagePath}#${section.id}` : pagePath,
      content: section.content,
      titles: section.titles,
      snippet,
      levelLabel: `h${section.level}`,
      onSelect: () => {
        isOpen.value = false;
        searchTerm.value = "";
      },
    });
  }

  return [
    {
      id: "blog-search",
      label: t("SearchResults"),
      items,
    },
  ];
});

const searchFuse = computed(() => ({
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.25,
    keys: ["label", "suffix", "content", "titles"],
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true,
}));

const paletteUi = {
  root: "flex flex-col",
  input:
    "h-16 rounded-none border-0 bg-transparent text-sm text-gray-900 shadow-none dark:text-gray-100 [&>input]:h-full [&>input]:w-full [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-6 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:shadow-none [&>input]:outline-none [&>input]:ring-0 [&>input]:placeholder:text-gray-400 [&>input]:focus:outline-none [&>input]:focus:ring-0 [&>input]:focus-visible:ring-0 [&>input]:dark:text-gray-100 [&>span]:hidden",
  content: "border-t border-pink-100/80 dark:border-pink-900/30",
  viewport: "max-h-[min(72vh,34rem)] overflow-y-auto px-3 py-3",
  group: "mb-4",
  label:
    "px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-500/80 dark:text-pink-300/80",
  item:
    "group relative flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-white/80 hover:shadow-[0_12px_30px_rgba(244,114,182,0.18)] dark:hover:border-pink-900/50 dark:hover:bg-gray-900/80",
  itemLeadingIcon: "mt-0.5 text-pink-500",
  itemLeadingAvatar: "mt-0.5",
  itemLeadingChip: "mt-0.5",
  itemLabel:
    "flex min-w-0 flex-1 flex-col gap-1 overflow-hidden",
  itemLabelBase:
    "block truncate text-sm font-semibold text-gray-900 dark:text-gray-100",
  itemLabelPrefix:
    "mr-2 inline-flex rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-medium text-pink-700 dark:bg-pink-950 dark:text-pink-200",
  itemLabelSuffix:
    "block truncate text-xs text-gray-500 dark:text-gray-400",
  itemTrailing: "shrink-0",
  itemTrailingIcon: "text-pink-400",
  itemTrailingKbds: "shrink-0",
  empty: "px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400",
};

watch(isOpen, (open) => {
  if (!open) {
    searchTerm.value = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/40 p-4 pt-20 backdrop-blur-md"
      @click.self="isOpen = false"
    >
      <div
        class="w-[min(100vw-2rem,56rem)] overflow-hidden rounded-[28px] border border-pink-100/70 bg-gradient-to-br from-pink-50 via-white to-sky-50 shadow-[0_30px_100px_rgba(15,23,42,0.28)] dark:border-pink-950/50 dark:from-gray-950 dark:via-gray-900 dark:to-sky-950/40"
      >
        <div
          class="flex items-center justify-between gap-4 border-b border-pink-100/70 px-6 py-4 dark:border-pink-950/50"
        >
          <div class="min-w-0">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-500/80 dark:text-pink-300/80">
              {{ t("SearchTitle") }}
            </p>
          </div>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white text-pink-500 shadow-sm transition hover:bg-pink-50 dark:border-pink-950 dark:bg-gray-950 dark:text-pink-300 dark:hover:bg-gray-900"
            type="button"
            :aria-label="t('CloseSearch')"
            @click="isOpen = false"
          >
            <Close class="h-4 w-4" />
          </button>
        </div>

        <UCommandPalette
          v-model:search-term="searchTerm"
          :groups="searchGroups"
          :fuse="searchFuse"
          :placeholder="t('SearchPlaceholder')"
          :ui="paletteUi"
          class="w-full"
        >
          <template #item="{ item, index }">
            <div class="flex w-full items-start gap-3">
              <span
                class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-sky-200 text-[11px] font-semibold text-pink-900 shadow-sm dark:from-pink-900 dark:to-sky-900 dark:text-pink-100"
              >
                {{ item.levelLabel.toUpperCase() }}
              </span>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <span
                      class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100"
                      v-html="item.labelHtml || item.label"
                    />
                    <span
                      class="mt-1 block truncate text-xs text-pink-600 dark:text-pink-300"
                      v-html="item.suffixHtml || item.suffix"
                    />
                  </div>

                  <span
                    class="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 shadow-sm dark:bg-gray-900/80"
                  >
                    {{ index + 1 }}
                  </span>
                </div>

                <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {{ item.snippet }}
                </p>
              </div>
            </div>
          </template>

          <template #empty="{ searchTerm: currentSearchTerm }">
            <div class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              {{
                sectionsPending
                  ? t("LoadingSearch")
                  : currentSearchTerm
                    ? t("NoResults")
                    : t("SearchPlaceholder")
              }}
            </div>
          </template>
        </UCommandPalette>
      </div>
    </div>
  </Teleport>
</template>

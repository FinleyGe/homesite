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
      SearchTitle: "搜索文章",
      SearchPlaceholder: "搜索标题或正文",
      SearchResults: "搜索结果",
      NoResults: "没有找到匹配的内容",
      LoadingSearch: "索引加载中",
      CloseSearch: "关闭搜索",
    },
    en: {
      SearchTitle: "Search writing",
      SearchPlaceholder: "Search",
      SearchResults: "Results",
      NoResults: "No matching passages found",
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
    "h-14 rounded-none border-0 bg-transparent text-sm text-[var(--color-text)] shadow-none [&>input]:h-full [&>input]:w-full [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-5 [&>input]:text-sm [&>input]:text-[var(--color-text)] [&>input]:shadow-none [&>input]:outline-none [&>input]:ring-0 [&>input]:placeholder:text-[var(--color-text-muted)] [&>input]:focus:outline-none [&>input]:focus:ring-0 [&>input]:focus-visible:ring-0 [&>span]:hidden",
  content: "border-t border-[var(--color-border)]",
  viewport: "max-h-[min(70vh,32rem)] overflow-y-auto p-3",
  group: "mb-2",
  label:
    "px-3 pb-2 pt-1 text-xs font-medium text-[var(--color-text-muted)]",
  item:
    "group relative flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-3 text-left transition-colors duration-150 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-raised)]",
  itemLeadingIcon: "mt-0.5 text-[var(--color-text-muted)]",
  itemLeadingAvatar: "mt-0.5",
  itemLeadingChip: "mt-0.5",
  itemLabel: "flex min-w-0 flex-1 flex-col gap-1 overflow-hidden",
  itemLabelBase: "block truncate text-sm font-medium text-[var(--color-text)]",
  itemLabelPrefix:
    "mr-2 inline-flex rounded bg-[var(--color-surface-raised)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]",
  itemLabelSuffix: "block truncate text-xs text-[var(--color-text-muted)]",
  itemTrailing: "shrink-0",
  itemTrailingIcon: "text-[var(--color-text-muted)]",
  itemTrailingKbds: "shrink-0",
  empty: "px-6 py-10 text-center text-sm text-[var(--color-text-muted)]",
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
      class="search-backdrop"
      @click.self="isOpen = false"
    >
      <div class="search-dialog" role="dialog" aria-modal="true" :aria-label="t('SearchTitle')">
        <div class="search-dialog__header">
          <p class="search-dialog__title">
            {{ t("SearchTitle") }}
          </p>

          <button
            class="search-dialog__close"
            type="button"
            :aria-label="t('CloseSearch')"
            @click="isOpen = false"
          >
            <Close class="search-dialog__close-icon" />
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
            <div class="search-result">
              <span class="search-result__level">
                {{ item.levelLabel }}
              </span>

              <div class="search-result__body">
                <div class="search-result__top">
                  <div class="search-result__titles">
                    <span
                      class="search-result__label"
                      v-html="item.labelHtml || item.label"
                    />
                    <span
                      class="search-result__page"
                      v-html="item.suffixHtml || item.suffix"
                    />
                  </div>

                  <span class="search-result__index">
                    {{ index + 1 }}
                  </span>
                </div>

                <p class="search-result__snippet">
                  {{ item.snippet }}
                </p>
              </div>
            </div>
          </template>

          <template #empty="{ searchTerm: currentSearchTerm }">
            <div class="search-empty">
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

<style scoped>
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(15, 13, 11, 0.48);
  padding: 64px 16px 16px;
}

.search-dialog {
  width: min(100vw - 32px, 44rem);
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.search-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding: 12px 20px;
}

.search-dialog__title {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.search-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    background-color 150ms var(--ease-out),
    color 150ms var(--ease-out),
    border-color 150ms var(--ease-out);
}

.search-dialog__close:hover {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface-raised);
  color: var(--color-text);
}

.search-dialog__close-icon {
  width: 16px;
  height: 16px;
}

.search-result {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 12px;
}

.search-result__level {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 24px;
  margin-top: 2px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  line-height: 1;
}

.search-result__body {
  min-width: 0;
  flex: 1 1 auto;
}

.search-result__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.search-result__titles {
  min-width: 0;
}

.search-result__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

.search-result__page {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-accent);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.search-result__index {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

.search-result__snippet {
  display: -webkit-box;
  margin: 6px 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.search-empty {
  padding: 40px 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>

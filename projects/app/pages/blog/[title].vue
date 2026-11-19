<script setup lang="ts">
import { ArrowLeft } from "@vicons/carbon";
import { useSeoMeta } from "nuxt/app";

const router = useRouter();
const localePath = useLocalePath();

const link = router.currentRoute.value.params.title as string;

const { data } = useAsyncData(() =>
  queryCollection("blog").path(`/blog/${link}`).first(),
);

const { locale, t } = useI18n();

const title = computed(() => data.value?.title);
const description = computed(() => data.value?.description);
const articleCover = computed(() => data.value?.cover);
const articleCoverAlt = computed(
  () => data.value?.coverAlt ?? data.value?.title ?? "",
);
const coverImage = computed(() => articleCover.value ?? "/favicon.ico");
const publishedAt = computed(() => data.value?.create);
const updatedAt = computed(() => data.value?.update);
const languageLabel = computed(() => {
  const lang = data.value?.lang;
  return lang ? t(`lang.${lang}`) : null;
});
const isTocOpen = ref(false);

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: coverImage,
});

useHead({
  title,
  htmlAttrs: {
    lang: locale,
  },
});
</script>

<template>
  <div class="article-page">
    <div class="article-layout" :class="{ 'article-layout--with-toc': Boolean(data?.body.toc?.links?.length) }">
      <button
        v-if="data?.body.toc?.links?.length && isTocOpen"
        type="button"
        class="article-layout__toc-backdrop"
        :aria-label="t('blog.closeToc')"
        @click="isTocOpen = false"
      />

      <aside
        v-if="data?.body.toc?.links?.length"
        class="article-layout__toc"
        :class="{ 'is-open': isTocOpen }"
      >
        <button
          type="button"
          class="article-layout__toc-toggle"
          aria-controls="article-toc-panel"
          :aria-expanded="isTocOpen"
          :aria-label="isTocOpen ? t('blog.closeToc') : t('blog.openToc')"
          @click="isTocOpen = !isTocOpen"
        >
          <span>{{ t("blog.toc") }}</span>
        </button>

        <div id="article-toc-panel" class="article-layout__toc-panel">
          <TableOfContent
            :toc="data.body.toc.links"
            @navigate="isTocOpen = false"
          />
        </div>
      </aside>

      <article class="article-layout__content">
        <NuxtLink class="article-back" :to="localePath('/blog')">
          <ArrowLeft class="article-back__icon" aria-hidden="true" />
          <span>{{ t("blog.backToList") }}</span>
        </NuxtLink>

        <header v-if="data" class="article-header">
          <h1 class="article-header__title">
            {{ data.title }}
          </h1>

          <dl class="article-header__meta">
            <div v-if="publishedAt" class="article-header__meta-item">
              <dt>{{ t("blog.published") }}</dt>
              <dd>{{ publishedAt }}</dd>
            </div>

            <div
              v-if="updatedAt && updatedAt !== publishedAt"
              class="article-header__meta-item"
            >
              <dt>{{ t("blog.updated") }}</dt>
              <dd>{{ updatedAt }}</dd>
            </div>

            <div v-if="languageLabel" class="article-header__meta-item">
              <dt>{{ t("blog.language") }}</dt>
              <dd>{{ languageLabel }}</dd>
            </div>
          </dl>

          <div v-if="data.tags?.length" class="article-header__tags">
            <NuxtLink
              v-for="tag in data.tags"
              :key="tag"
              :to="{ path: localePath('/blog'), query: { tag } }"
              class="article-header__tag"
            >
              #{{ tag }}
            </NuxtLink>
          </div>

          <figure v-if="articleCover" class="article-header__cover">
            <img
              :src="articleCover"
              :alt="articleCoverAlt"
              decoding="async"
              fetchpriority="high"
              loading="eager"
            >
          </figure>
        </header>

        <div class="article-rendered">
          <ContentRenderer v-if="data" :value="data" />
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.article-page {
  width: min(100%, 65rem);
  margin-inline: auto;
  padding: 36px 0 64px;
}

.article-layout {
  display: grid;
  gap: 32px;
}

.article-layout__toc-backdrop {
  position: fixed;
  z-index: 24;
  inset: 0;
  border: 0;
  background: rgba(15, 13, 11, 0.36);
  cursor: default;
}

.article-layout__toc {
  position: fixed;
  top: 88px;
  right: 0;
  z-index: 25;
  width: min(82vw, 20rem);
  max-height: calc(100svh - 112px);
  overflow: visible;
  border: 1px solid var(--color-border-strong);
  border-right: 0;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
  padding: 0;
  transform: translateX(100%);
  transition: transform 200ms var(--ease-out);
}

.article-layout__toc.is-open {
  transform: translateX(0);
}

.article-layout__toc-panel {
  height: min(30rem, calc(100svh - 112px));
  overflow: hidden;
  border-radius: inherit;
  padding: 16px;
}

.article-layout__toc-toggle {
  position: absolute;
  top: 16px;
  left: 0;
  display: grid;
  place-items: center;
  width: 36px;
  min-height: 88px;
  border: 1px solid var(--color-border-strong);
  border-right: 0;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  transform: translateX(-100%);
  writing-mode: vertical-rl;
}

.article-layout__toc-toggle span {
  transform: rotate(180deg);
}

.article-layout__content {
  min-width: 0;
  max-width: 46rem;
  width: 100%;
  margin-inline: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: clamp(24px, 4vw, 44px);
}

.article-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.article-back:hover {
  color: var(--color-accent);
}

.article-back__icon {
  width: 16px;
  height: 16px;
}

.article-header {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
}

.article-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.18;
  text-wrap: balance;
}

:global([lang^="zh"]) .article-header__title {
  letter-spacing: 0;
}

.article-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.article-header__meta-item {
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
  font-size: 0.8125rem;
}

.article-header__meta-item dt,
.article-header__meta-item dd {
  margin: 0;
}

.article-header__meta-item dt {
  color: var(--color-text-muted);
}

.article-header__meta-item dd {
  color: var(--color-text-secondary);
  font-family: var(--font-code);
}

.article-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-header__tag {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  padding: 0 8px;
  text-decoration: none;
  transition:
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.article-header__tag:hover {
  border-color: var(--color-border-strong);
  color: var(--color-accent);
}

.article-header__cover {
  overflow: hidden;
  aspect-ratio: 3 / 2;
  margin: 8px 0 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-raised);
}

.article-header__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-rendered :deep(h1:first-child) {
  display: none;
}

.article-rendered :deep(img) {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-block: 20px;
}

.article-rendered :deep(.katex) {
  color: var(--color-text);
  font-size: 1.04em;
}

.article-rendered :deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  margin: 20px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
  padding: 16px;
}

.article-rendered :deep(.katex-display > .katex) {
  white-space: nowrap;
}

.article-rendered :deep(.katex-error) {
  display: inline-block;
  border-radius: 4px;
  background: rgba(220, 38, 38, 0.1);
  color: var(--color-error);
  padding: 0 4px;
}

@media (min-width: 1024px) {
  .article-layout--with-toc {
    grid-template-columns: 14rem minmax(0, 1fr);
    align-items: start;
  }

  .article-layout__content {
    margin-inline: 0;
    max-width: none;
  }

  .article-layout__toc {
    position: sticky;
    top: 24px;
    right: auto;
    z-index: 1;
    width: auto;
    max-height: calc(100svh - 48px);
    overflow: hidden;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 4px 0;
    transform: none;
  }

  .article-layout__toc-backdrop,
  .article-layout__toc-toggle {
    display: none;
  }

  .article-layout__toc-panel {
    height: auto;
    max-height: calc(100svh - 64px);
    padding: 0;
  }
}

@media (max-width: 640px) {
  .article-page {
    padding: 24px 0 48px;
  }

  .article-rendered :deep(.katex-display) {
    padding: 12px;
  }
}
</style>

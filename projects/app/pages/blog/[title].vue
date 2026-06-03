<script setup lang="ts">
import { useSeoMeta } from "nuxt/app";

const router = useRouter();

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
    <div class="article-layout">
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
          :aria-controls="'article-toc-panel'"
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
        <header v-if="data" class="article-header">
          <p class="article-header__eyebrow">
            {{ t("blog.eyebrow") }}
          </p>

          <h1 class="article-header__title">
            {{ data.title }}
          </h1>

          <dl class="article-header__meta">
            <div v-if="publishedAt" class="article-header__meta-item">
              <dt>{{ t("blog.published") }}</dt>
              <dd>{{ publishedAt }}</dd>
            </div>

            <div v-if="updatedAt" class="article-header__meta-item">
              <dt>{{ t("blog.updated") }}</dt>
              <dd>{{ updatedAt }}</dd>
            </div>

            <div v-if="languageLabel" class="article-header__meta-item">
              <dt>{{ t("blog.language") }}</dt>
              <dd>{{ languageLabel }}</dd>
            </div>
          </dl>

          <div v-if="data.tags?.length" class="article-header__tags">
            <span
              v-for="tag in data.tags"
              :key="tag"
              class="article-header__tag"
            >
              #{{ tag }}
            </span>
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
  width: min(100% - clamp(1.5rem, 4vw, 3rem), 72rem);
  margin-inline: auto;
  padding-bottom: 4rem;
}

.article-layout {
  display: grid;
  gap: clamp(1rem, 3vw, 1.8rem);
}

.article-layout__toc-backdrop {
  position: fixed;
  z-index: 24;
  inset: 0;
  border: 0;
  background: transparent;
  cursor: default;
}

.article-layout__toc,
.article-layout__content {
  border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  background:
    linear-gradient(
      135deg,
      var(--color-surface-strong),
      color-mix(in srgb, var(--color-surface) 84%, var(--color-canvas-warm))
    );
  box-shadow: var(--shadow-home-card);
  backdrop-filter: blur(18px);
}

.article-layout__toc {
  position: fixed;
  top: clamp(5.5rem, 14svh, 7rem);
  right: 0;
  z-index: 25;
  width: min(82vw, 22rem);
  max-height: calc(100svh - 7rem);
  overflow: visible;
  border-radius: 1.45rem 0 0 1.45rem;
  padding: 0;
  transform: translateX(100%);
  transition:
    box-shadow 180ms ease,
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.article-layout__toc.is-open {
  transform: translateX(0);
}

.article-layout__toc-panel {
  height: min(32rem, calc(100svh - 7rem));
  overflow: hidden;
  border-radius: inherit;
  padding: 1rem;
}

.article-layout__toc-toggle {
  position: absolute;
  top: 1.1rem;
  left: 0;
  display: grid;
  place-items: center;
  width: 2.75rem;
  min-height: 7rem;
  border: 1px solid color-mix(in srgb, var(--color-rose) 28%, transparent);
  border-right: 0;
  border-radius: 1.15rem 0 0 1.15rem;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-rose-soft) 86%, var(--color-surface)),
      color-mix(in srgb, var(--color-sky) 22%, var(--color-surface-strong))
    );
  box-shadow: -10px 14px 36px rgba(23, 32, 51, 0.12);
  color: var(--color-ink);
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 820;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transform: translateX(-100%);
  writing-mode: vertical-rl;
}

.article-layout__toc-toggle span {
  transform: rotate(180deg);
}

.article-layout__content {
  min-width: 0;
  border-radius: clamp(1.5rem, 3vw, 2rem);
  padding: clamp(1.35rem, 4vw, 3rem);
}

.article-header {
  display: grid;
  gap: 0.9rem;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  padding-bottom: clamp(1.25rem, 3vw, 2rem);
  border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
}

.article-header__eyebrow {
  color: var(--color-rose);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.article-header__title {
  max-width: 13ch;
  color: var(--color-ink);
  font-size: clamp(2.15rem, 5vw, 3.5rem);
  font-weight: 850;
  letter-spacing: -0.055em;
  line-height: 1.02;
  text-wrap: balance;
}

.article-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0;
}

.article-header__meta-item {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  min-height: 2rem;
  border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-strong) 72%, transparent);
  color: color-mix(in srgb, var(--color-ink) 70%, transparent);
  font-size: 0.82rem;
  padding: 0 0.75rem;
}

.article-header__meta-item dt,
.article-header__meta-item dd {
  margin: 0;
}

.article-header__meta-item dt {
  color: color-mix(in srgb, var(--color-rose) 78%, var(--color-ink));
  font-weight: 760;
}

.article-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.article-header__tag {
  border: 1px solid color-mix(in srgb, var(--color-mint) 24%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-sky) 22%, var(--color-surface));
  color: color-mix(in srgb, var(--color-ink) 78%, transparent);
  font-size: 0.8rem;
  padding: 0.38rem 0.7rem;
}

.article-header__cover {
  overflow: hidden;
  aspect-ratio: 3 / 2;
  margin: clamp(0.55rem, 2vw, 1rem) 0 0;
  border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  border-radius: clamp(1rem, 2vw, 1.35rem);
  background: color-mix(in srgb, var(--color-surface-strong) 72%, transparent);
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

.article-rendered :deep(.katex) {
  color: var(--color-ink);
  font-size: 1.04em;
}

.article-rendered :deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  margin: clamp(1.2rem, 3vw, 1.8rem) 0;
  border: 1px solid color-mix(in srgb, var(--color-sky) 26%, transparent);
  border-radius: 1.1rem;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-sky) 16%, var(--color-surface-strong)),
      color-mix(in srgb, var(--color-rose-soft) 18%, var(--color-surface))
    );
  padding: 0.9rem 1rem;
}

.article-rendered :deep(.katex-display > .katex) {
  white-space: nowrap;
}

.article-rendered :deep(.katex-error) {
  display: inline-block;
  border-radius: 0.45rem;
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
  padding: 0 0.25rem;
}

:global(:where(.dark, .dark-mode)) .article-layout__toc,
:global(:where(.dark, .dark-mode)) .article-layout__content {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

:global(:where(.dark, .dark-mode)) .article-layout__toc-toggle {
  box-shadow: -10px 14px 36px rgba(0, 0, 0, 0.28);
}

@media (min-width: 1024px) {
  .article-layout {
    grid-template-columns: minmax(14rem, 17rem) minmax(0, 1fr);
    align-items: start;
  }

  .article-layout__toc {
    position: sticky;
    top: 1rem;
    max-height: calc(100svh - 7rem);
    width: auto;
    overflow: hidden;
    border-radius: 1.45rem;
    padding: 1rem;
    transform: none;
  }

  .article-layout__toc-backdrop,
  .article-layout__toc-toggle {
    display: none;
  }

  .article-layout__toc-panel {
    height: auto;
    max-height: none;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .article-rendered :deep(.katex-display) {
    margin-inline: -0.25rem;
    padding: 0.8rem 0.75rem;
  }
}
</style>

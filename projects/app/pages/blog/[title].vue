<script setup lang="ts">
import { useSeoMeta } from "nuxt/app";

const router = useRouter();

const link = router.currentRoute.value.params.title as string;

const { data } = useAsyncData(() =>
  queryCollection("blog").path(`/blog/${link}`).first(),
);

const title = computed(() => data.value?.title);
const description = computed(() => data.value?.description);

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: "/favicon.ico",
});

const i18n = useI18n();

useHead({
  title,
  htmlAttrs: {
    lang: i18n.locale,
  },
});
</script>
<template>
  <div class="w-full">
    <div
      class="mx-auto grid w-full max-w-6xl gap-8 px-0 sm:px-4 xl:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside
        v-if="data?.body.toc"
        class="hidden max-h-[calc(100svh-4rem)] overflow-y-auto rounded-3xl border border-white/60 bg-[var(--color-surface)] p-4 text-sm shadow-[var(--shadow-home-soft)] backdrop-blur xl:sticky xl:top-8 xl:block"
      >
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-rose)]">
          Contents
        </p>
        <TableOfContent :toc="data.body.toc.links" />
      </aside>

      <article class="mx-auto min-w-0 w-full max-w-4xl xl:mx-0">
        <ContentRenderer v-if="data" :value="data" />
      </article>
    </div>
  </div>
</template>

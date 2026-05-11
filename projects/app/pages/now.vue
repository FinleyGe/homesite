<script setup lang="ts">
const { t } = useI18n();

const { data } = await useAsyncData(() =>
  queryCollection("about").where("title", "=", "now").first(),
);
</script>

<template>
  <section
    class="mx-auto max-w-3xl rounded-[2rem] border border-white/60 bg-[var(--color-surface)] px-5 py-6 shadow-[var(--shadow-home-card)] backdrop-blur sm:px-8 sm:py-8"
  >
    <div class="mb-8 border-b border-white/60 pb-6">
      <p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-rose)]">
        Now
      </p>
      <h1 class="mt-3 text-4xl font-bold leading-tight text-[var(--color-ink)]">
        {{ t("common.now") }}
      </h1>
      <p class="mt-2 text-lg italic text-[var(--color-muted)]">
        {{ t("common.nowDescription") }}
      </p>
    </div>

    <div class="text-base leading-7 text-[var(--color-ink)]">
      <ContentRenderer v-if="data" :value="data" />
    </div>
  </section>
</template>

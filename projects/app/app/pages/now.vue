<script setup lang="ts">
const { t } = useI18n();

const { data } = await useAsyncData("about-now", () =>
  queryCollection("about").where("title", "=", "now").first(),
);
</script>

<template>
  <AboutNotePage
    eyebrow="/now"
    :title="t('common.now')"
    :description="t('common.nowDescription')"
    title-id="now-title"
  >
    <ContentRenderer v-if="data" :value="data" />
  </AboutNotePage>
</template>

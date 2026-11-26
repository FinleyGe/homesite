<script setup lang="ts">
const { t } = useI18n();

const { data } = await useAsyncData("about-uses", () =>
  queryCollection("about").where("title", "=", "uses").first(),
);
</script>

<template>
  <AboutNotePage
    eyebrow="/uses"
    :title="t('common.uses')"
    :description="t('common.usesDescription')"
    title-id="uses-title"
  >
    <ContentRenderer v-if="data" :value="data" />
  </AboutNotePage>
</template>

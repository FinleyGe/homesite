<script setup lang="ts">
const { t } = useI18n();

const { data } = await useAsyncData(() =>
  queryCollection("about").where("title", "=", "now").first(),
);
</script>

<template>
  <body class="max-w-2xl mx-auto">
    <h1 class="text-3xl">{{ t("common.now") }}</h1>
    <h2 class="text-l italic">{{ t("common.nowDescription") }}</h2>
    <ContentRenderer v-if="data" :value="data" />
  </body>
</template>

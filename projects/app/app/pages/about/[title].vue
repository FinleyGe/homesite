<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const route = useRoute();
const slug = computed(() => String(route.params.title ?? ""));

const { data: aboutContents } = await useAsyncData(
  () => `about-${slug.value}`,
  () => queryCollection("about").where("title", "=", slug.value).all(),
);

const data = computed(() => {
  return aboutContents.value?.find((item) => item.meta.locale === locale.value);
});
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <ContentRenderer v-if="data" :value="data" />
  </div>
</template>

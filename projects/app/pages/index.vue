<script setup lang="ts">
const { locale } = useI18n();
const { data: aboutContents } = await useAsyncData(() =>
  queryCollection("about").all()
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

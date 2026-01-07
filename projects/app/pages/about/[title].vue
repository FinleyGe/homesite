<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const router = useRouter();
const link = router.currentRoute.value.params.title as string;

const { data: aboutContents } = await useAsyncData(() =>
  queryCollection("about").where("title", "=", link).all(),
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

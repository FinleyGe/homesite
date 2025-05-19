<script setup lang="ts">
const router = useRouter();

const link = router.currentRoute.value.params.title as string;

const { data } = useAsyncData(() =>
  queryCollection("blog").path(`/blog/${link}`).first()
);
</script>
<template>
  <div class="w-full">
    <div class="max-w-4xl mx-auto relative">
      <div class="my-4 bg-gray-200 dark:bg-gray-900 p-4 rounded-lg shadow-md">
        <TableOfContent v-if="data?.body.toc" :toc="data?.body.toc.links" />
      </div>
      <ContentRenderer v-if="data" :value="data" />
    </div>
  </div>
</template>

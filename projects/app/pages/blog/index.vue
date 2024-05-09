<script setup lang="ts">
const { t } = useI18n();
useHead({
  title: t('blog.list'),
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="font-bold text-2xl">
      {{ t('blog.list') }}
    </h1>
  </div>
</template>

<style scoped>

</style>

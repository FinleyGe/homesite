<script setup lang="ts">
const {t} = useI18n();
useHead({
  title: t('head.title'),
})

</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800 dark:text-white h-svh flex flex-col">
      <header class="h-10">
        <ToolBar />
      </header>
      <main class="h-full mx-2 px-2">
        <NuxtPage />
      </main>
      <footer class="h-12">
        <CopyrightFooter />
      </footer>
  </div>
</template>

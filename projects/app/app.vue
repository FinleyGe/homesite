<script setup lang="ts">
import 'vue3-toastify/dist/index.css';
const { t } = useI18n();
useHead({
  title: t('head.title'),
})

</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800 dark:text-white min-h-svh flex flex-col">
    <ColorScheme>
    <header class="h-10">
      <ToolBar />
    </header>
    <main class="min-h-full mx-2 px-2 flex-grow">
      <NuxtPage />
    </main>
    <footer class="h-12">
      <CopyrightFooter />
    </footer>
    </ColorScheme>
  </div>
</template>

<script setup lang="ts">
import "vue3-toastify/dist/index.css";
const { t } = useI18n();

useHead({
  title: t("head.title"),
  script: [
    {
      src: "/unami.js",
      "data-website-id": "d7f2d8d0-e6ff-4712-a469-2ad25faf0570",
      defer: true,
    },
  ],
  htmlAttrs: {
    style: "font-size: 16px;",
  },
});
</script>

<template>
  <div
    class="bg-gradient-to-t to-sky-100 from-sky-300 dark:from-black dark:to-gray-800 dark:text-white transition-colors duration-200 min-h-svh flex flex-col max-h-svh overflow-y-auto"
  >
    <header class="h-10">
      <ColorScheme>
        <ToolBar />
      </ColorScheme>
    </header>
    <main class="min-h-full mx-2 px-2 flex-grow">
      <NuxtPage />
      <footer class="h-12">
        <CopyrightFooter />
      </footer>
    </main>
  </div>
</template>

<style>
main {
  .page-enter-active,
  .page-leave-active {
    transition: all 0.2s;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
}
</style>

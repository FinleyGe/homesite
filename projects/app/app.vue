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
    class="bg-gradient-to-bl
    from-sky-50 to-sky-200
    dark:bg-gradient-to-bl dark:from-indigo-900 dark:to-pink-900 dark:text-white
    transition-colors duration-200 min-h-svh flex flex-col"
  >
    <header class="h-10">
      <ColorScheme>
        <ToolBar />
      </ColorScheme>
    </header>
    <main class="min-h-full mx-2 px-2 flex-grow">
      <NuxtPage />
    </main>
    <footer class="h-12">
      <CopyrightFooter />
    </footer>
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

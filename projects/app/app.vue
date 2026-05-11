<script setup lang="ts">
import "vue3-toastify/dist/index.css";
const { t } = useI18n();

useHead({
  title: t("head.title"),
  script: [
    {
      src: "/umami.js",
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
    class="site-shell dark:text-white transition-colors duration-200 min-h-svh flex flex-col max-h-svh overflow-y-auto"
  >
    <header class="site-header">
      <ColorScheme>
        <ToolBar />
      </ColorScheme>
    </header>
    <main class="mx-2 px-2 flex-grow">
      <NuxtPage />
    </main>
    <footer class="h-12">
      <CopyrightFooter />
    </footer>
    <BlogContentSearch />
  </div>
</template>

<style>
.site-shell {
  background:
    radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--color-sky) 45%, transparent), transparent 24rem),
    radial-gradient(circle at 14% 88%, color-mix(in srgb, var(--color-rose-soft) 28%, transparent), transparent 26rem),
    linear-gradient(180deg, var(--color-canvas) 0%, color-mix(in srgb, var(--color-sky) 38%, var(--color-canvas)) 58%, var(--color-canvas-warm) 100%);
}

.site-header {
  position: relative;
  z-index: 20;
  flex: 0 0 auto;
  padding-block: 0.2rem clamp(0.75rem, 1.8vw, 1.1rem);
}

main {
  position: relative;
  z-index: 1;

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

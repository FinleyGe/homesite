<script setup lang="ts">
import "vue3-toastify/dist/index.css";

const { t, locale } = useI18n();

useHead({
  title: computed(() => t("head.title")),
  script: [
    {
      src: "/umami.js",
      "data-website-id": "d7f2d8d0-e6ff-4712-a469-2ad25faf0570",
      defer: true,
    },
  ],
  htmlAttrs: {
    lang: locale,
    style: "font-size: 16px;",
  },
});
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <ColorScheme>
        <ToolBar />
      </ColorScheme>
    </header>
    <main class="site-main">
      <NuxtPage />
    </main>
    <footer class="site-footer">
      <CopyrightFooter />
    </footer>
    <BlogContentSearch />
  </div>
</template>

<style>
.site-shell {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  max-height: 100svh;
  overflow-y: auto;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition:
    background-color 180ms var(--ease-out),
    color 180ms var(--ease-out);
}

.site-header {
  position: relative;
  z-index: 20;
  flex: 0 0 auto;
  width: min(100%, 68rem);
  margin-inline: auto;
  padding: 16px 24px 0;
}

.site-main {
  position: relative;
  z-index: 1;
  flex: 1 0 auto;
  width: 100%;
  padding-inline: 24px;
}

.site-footer {
  flex: 0 0 auto;
  width: min(100%, 68rem);
  margin-inline: auto;
  padding: 0 24px 32px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 160ms var(--ease-out);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .site-header {
    padding: 12px 16px 0;
  }

  .site-main {
    padding-inline: 16px;
  }

  .site-footer {
    padding: 0 16px 24px;
  }
}
</style>

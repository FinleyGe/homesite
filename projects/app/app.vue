<script setup lang="ts">
import "vue3-toastify/dist/index.css";
const { t } = useI18n();
const bgTransition = ref<boolean>(false);

useHead({
  title: t("head.title"),
});

function handleToggleTheme() {
  bgTransition.value = true;
  setTimeout(() => {
    bgTransition.value = false;
  }, 300)
}

</script>

<template>
  <div
    class="bg-gradient-to-bl from-sky-50 to-sky-200
    dark:bg-gradient-to-bl dark:from-indigo-900 dark:to-pink-900 dark:text-white
    transition-colors duration-300
    min-h-svh flex flex-col"
  >
    <header class="h-10">
      <ColorScheme>
        <ToolBar @handle-toggle-theme="handleToggleTheme" />
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

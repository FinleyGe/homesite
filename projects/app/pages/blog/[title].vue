<script setup lang="ts">
const router = useRouter();

const link = router.currentRoute.value.params.title as string;

const { data } = useAsyncData(() =>
  queryCollection("blog").path(`/blog/${link}`).first(),
);

const isTocOpen = ref(true);

const toggleToc = () => {
  isTocOpen.value = !isTocOpen.value;
};
</script>
<template>
  <div class="w-full">
    <div class="max-w-4xl mx-auto relative">
      <!-- TOC 悬浮窗 -->
      <div
        v-if="data?.body.toc"
        class="fixed left-0 top-1/4 z-50 transition-transform duration-300 ease-in-out w-80"
        :class="isTocOpen ? 'translate-x-0' : '-translate-x-80'"
      >
        <div
          class="bg-white dark:bg-gray-800 shadow-2xl rounded-r-lg h-full relative"
        >
          <div class="p-4 max-h-[60vh] overflow-y-auto">
            <TableOfContent :toc="data.body.toc.links" />
          </div>

          <!-- 收起/展开按钮 -->
          <button
            @click="toggleToc"
            class="absolute -right-10 top-0 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            :title="isTocOpen ? '收起目录' : '展开目录'"
          >
            <svg
              class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300"
              :class="isTocOpen ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <ContentRenderer v-if="data" :value="data" />
    </div>
  </div>
</template>

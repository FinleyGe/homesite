<script setup lang="ts">
import Button from "~/components/common/Button.vue";
import { linkList } from "../../const/links";
const { t } = useI18n({
  messages: {
    zh: {
      askForExchange: "申请友情链接",
    },
    en: {
      askForExchange: "ask for exchanging",
    },
  },
});

function handleAskForLinkExchange() {
  window.open("mailto:finleyge@qq.com");
}
</script>
<template>
  <div class="max-w-4xl mx-auto flex justify-center flex-col mt-4">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl w-fit">{{ t("LinkExchange") }}</h1>
      <ClientOnly>
        <Button @click="handleAskForLinkExchange">
          {{ t("askForExchange") }}
        </Button>
      </ClientOnly>
    </div>

    <div class="flex flex-row flex-wrap gap-2 max-w-3xl">
      <div
        v-for="link in linkList"
        :key="link.link"
        class="items-center px-4 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl hover:transition-all"
      >
        <a
          :href="link.link"
          target="_blank"
          class="text-pink-500 dark:text-pink-200"
          >{{ link.name }}</a
        >
      </div>
    </div>
  </div>
</template>

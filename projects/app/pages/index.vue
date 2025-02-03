<script setup lang="ts">
import { MDXProvider, useMDXComponents } from "@mdx-js/vue";
import md from "mdx-components/md";
import { evaluateSync } from "@mdx-js/mdx";
import * as runtime from "vue/jsx-runtime";
import HoverComment from "mdx-components/common/HoverComment";
import Avatar from "~/components/Avatar.vue";
import ColorfulButton from "~/components/common/ColorfulButton.vue";
import about from "~/content/about.mdx";
import aboutZh from "~/content/about.zh.mdx";

const { locale } = useI18n();

// const content = computed(() => {
//   return locale.value === "zh" ? aboutZh : about;
// });

const Content = computed(() =>
  evaluateSync(locale.value === "zh" ? aboutZh : about, {
    ...runtime,
    useMDXComponents,
  }).default
);
</script>
<template>
  <div class="p-4 max-w-2xl mx-auto">
    <MDXProvider
      :components="{
        ...md,
        HoverComment: HoverComment,
        Avatar: Avatar,
        Button: ColorfulButton,
      }"
    >
      <Content />
    </MDXProvider>
  </div>
</template>

<script setup lang="ts">
import Button from "~/components/common/Button.vue";
import LogoTitle from "./LogoTitle.vue";
import { Sun, Moon } from "@vicons/carbon";
import ColorfulButton from "~/components/common/ColorfulButton.vue";

const colorMode = useColorMode();
const localePath = useLocalePath();
const router = useRouter();

function toggleTheme() {
  colorMode.value = colorMode.value === "dark" ? "light" : "dark";
  colorMode.preference = colorMode.value;
}

const { t, locale } = useI18n();

function toggleLocale() {
  locale.value = locale.value === "en" ? "zh" : "en";
}

const tabs = [
  {
    color: "pink",
    link: "blog",
    label: "common.blog",
  },
  {
    color: "blue",
    link: "link-exchange",
    label: "common.link-exchange",
  },
  {
    color: "yellow",
    link: "donate",
    label: "common.donate",
  },
  {
    color: "green",
    link: "now",
    label: "common.now",
  },
] as const;
</script>

<template>
  <div class="flex flex-row justify-between items-center py-1 px-2">
    <LogoTitle @click="router.push(localePath('/'))" />

    <div
      class="flex flex-1 justify-center flex-row h-min items-center content-center px-2 py-1 gap-x-4 overflow-auto"
    >
      <ColorfulButton
        v-for="tab in tabs"
        :key="tab.link"
        :color="tab.color"
        :router-link="localePath(tab.link)"
      >
        {{ t(tab.label) }}
      </ColorfulButton>
    </div>

    <div class="flex flex-row">
      <Button circle @click="toggleTheme">
        <template #icon>
          <Sun v-if="colorMode.value == 'dark'" />
          <Moon v-else />
        </template>
      </Button>

      <Button circle @click="toggleLocale">
        {{ locale === "en" ? "中" : "EN" }}
      </Button>
    </div>
  </div>
</template>

<style scoped></style>

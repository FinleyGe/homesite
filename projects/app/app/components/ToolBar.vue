<script setup lang="ts">
import Button from "~/components/common/Button.vue";
import LogoTitle from "./LogoTitle.vue";
import { Sun, Moon } from "@vicons/carbon";
import ColorfulButton from "~/components/common/ColorfulButton.vue";

const colorMode = useColorMode();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();
const router = useRouter();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

const { t, locale } = useI18n();

async function toggleLocale() {
  const nextLocale = locale.value === "en" ? "zh" : "en";
  const nextPath = switchLocalePath(nextLocale);

  locale.value = nextLocale;

  if (nextPath) {
    await router.push(nextPath);
  }
}

const tabs = [
  {
    link: "blog",
    label: "common.blog",
  },
  {
    link: "link-exchange",
    label: "common.link-exchange",
  },
  {
    link: "donate",
    label: "common.donate",
  },
  {
    link: "now",
    label: "common.now",
  },
] as const;

const isTabActive = (link: string) => {
  const target = localePath(link);
  return route.path === target || route.path.startsWith(`${target}/`);
};
</script>

<template>
  <div class="toolbar">
    <NuxtLink class="toolbar__brand" :to="localePath('/')">
      <LogoTitle />
    </NuxtLink>

    <nav class="toolbar__nav" aria-label="Primary">
      <ColorfulButton
        v-for="tab in tabs"
        :key="tab.link"
        :active="isTabActive(tab.link)"
        :router-link="localePath(tab.link)"
      >
        {{ t(tab.label) }}
      </ColorfulButton>
    </nav>

    <div class="toolbar__controls">
      <Button
        circle
        :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <template #icon>
          <Sun v-if="colorMode.value == 'dark'" />
          <Moon v-else />
        </template>
      </Button>

      <Button
        circle
        :aria-label="locale === 'en' ? '切换到中文' : 'Switch to English'"
        @click="toggleLocale"
      >
        {{ locale === "en" ? "中" : "EN" }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  min-height: 56px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.toolbar__brand {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  text-decoration: none;
}

.toolbar__nav {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.toolbar__nav::-webkit-scrollbar {
  display: none;
}

.toolbar__controls {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .toolbar__nav {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    margin-inline: -12px;
    padding-inline: 12px;
  }
}
</style>

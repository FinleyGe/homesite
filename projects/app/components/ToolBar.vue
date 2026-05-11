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
  colorMode.value = colorMode.value === "dark" ? "light" : "dark";
  colorMode.preference = colorMode.value;
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

const isTabActive = (link: string) => {
  const target = localePath(link);
  return route.path === target || route.path.startsWith(`${target}/`);
};
</script>

<template>
  <div class="toolbar">
    <LogoTitle @click="router.push(localePath('/'))" />

    <nav class="toolbar__nav" aria-label="Primary">
      <ColorfulButton
        v-for="tab in tabs"
        :key="tab.link"
        :active="isTabActive(tab.link)"
        :color="tab.color"
        :router-link="localePath(tab.link)"
      >
        {{ t(tab.label) }}
      </ColorfulButton>
    </nav>

    <div class="toolbar__controls">
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

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem 0.75rem;
  position: relative;
  z-index: 30;
  padding: 0.25rem 0.5rem 0;
}

.toolbar__nav {
  display: flex;
  flex: 1 1 auto;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow-x: auto;
  padding: 0.25rem 0.5rem;
  scrollbar-width: none;
}

.toolbar__nav::-webkit-scrollbar {
  display: none;
}

.toolbar__controls {
  display: flex;
  flex: 0 0 auto;
  gap: 0.25rem;
}

.toolbar__controls :deep(button) {
  min-width: 2.75rem;
  min-height: 2.75rem;
  justify-content: center;
}

@media (max-width: 640px) {
  .toolbar {
    padding-top: 0.45rem;
  }

  .toolbar__nav {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    padding-inline: 0.1rem;
  }
}
</style>

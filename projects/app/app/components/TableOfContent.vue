<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

const props = defineProps<{
  toc: TocLink[];
}>();
const emit = defineEmits<{
  navigate: [id: string];
}>();
const { t } = useI18n();

type FlatTocLink = TocLink & {
  level: number;
};

const activeId = ref("");
const progress = ref(0);
const rail = ref<HTMLElement | null>(null);
let scrollRoot: HTMLElement | null = null;
let frame = 0;

const flattenToc = (links: TocLink[], level = 0): FlatTocLink[] => {
  return links.flatMap((link) => {
    const current = { ...link, level };
    return [current, ...flattenToc(link.children ?? [], level + 1)];
  });
};

const flatToc = computed(() => flattenToc(props.toc));

const getScrollRoot = () => {
  return document.querySelector<HTMLElement>(".site-shell");
};

const getScrollProgress = () => {
  if (!scrollRoot) {
    return 0;
  }

  const maxScroll = scrollRoot.scrollHeight - scrollRoot.clientHeight;
  return maxScroll > 0 ? scrollRoot.scrollTop / maxScroll : 0;
};

const updateActiveHeading = () => {
  frame = 0;
  progress.value = getScrollProgress();

  const headings = flatToc.value
    .map((item) => document.getElementById(item.id))
    .filter((item): item is HTMLElement => Boolean(item));

  const firstHeading = headings[0];
  if (!firstHeading) {
    activeId.value = "";
    return;
  }

  const activationLine = (scrollRoot?.getBoundingClientRect().top ?? 0) + 180;
  const current = headings.reduce((active, heading) => {
    const top = heading.getBoundingClientRect().top;
    return top <= activationLine ? heading : active;
  }, firstHeading);

  activeId.value = current.id;
};

const scheduleUpdate = () => {
  if (frame) {
    return;
  }

  frame = window.requestAnimationFrame(updateActiveHeading);
};

const scrollToHeading = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  history.replaceState(null, "", `#${id}`);
  emit("navigate", id);
};

const setScrollFromPointer = (clientY: number) => {
  if (!scrollRoot || !rail.value) {
    return;
  }

  const rect = rail.value.getBoundingClientRect();
  const ratio = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
  const maxScroll = scrollRoot.scrollHeight - scrollRoot.clientHeight;

  scrollRoot.scrollTo({
    top: ratio * maxScroll,
    behavior: "auto",
  });
};

const handleRailPointerDown = (event: PointerEvent) => {
  event.preventDefault();
  setScrollFromPointer(event.clientY);

  const handlePointerMove = (moveEvent: PointerEvent) => {
    setScrollFromPointer(moveEvent.clientY);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp, { once: true });
};

onMounted(async () => {
  await nextTick();
  scrollRoot = getScrollRoot();
  scrollRoot?.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  scheduleUpdate();
});

onBeforeUnmount(() => {
  if (frame) {
    window.cancelAnimationFrame(frame);
  }

  scrollRoot?.removeEventListener("scroll", scheduleUpdate);
  window.removeEventListener("resize", scheduleUpdate);
});

watch(flatToc, async () => {
  await nextTick();
  scheduleUpdate();
});
</script>

<template>
  <nav class="toc" :aria-label="t('blog.toc')">
    <p class="toc__heading">
      {{ t("blog.toc") }}
    </p>

    <div class="toc__body">
      <button
        ref="rail"
        type="button"
        class="toc__rail"
        :aria-label="t('blog.scrollArticle')"
        @pointerdown="handleRailPointerDown"
      >
        <span
          class="toc__rail-progress"
          :style="{ height: `${Math.max(progress * 100, 4)}%` }"
        />
      </button>

      <ol class="toc__list">
        <li
          v-for="item in flatToc"
          :key="item.id"
          class="toc__item"
          :class="[
            `toc__item--level-${Math.min(item.level, 3)}`,
            { 'is-active': item.id === activeId },
          ]"
          :style="{ '--toc-indent': `${item.level * 12}px` }"
        >
          <button
            type="button"
            class="toc__link"
            @click="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </button>
        </li>
      </ol>
    </div>
  </nav>
</template>

<style scoped>
.toc {
  display: grid;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.toc__heading {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.33;
}

.toc__body {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr);
  gap: 8px;
  min-height: 0;
}

.toc__rail {
  position: relative;
  width: 8px;
  min-height: 96px;
  align-self: stretch;
  border: 0;
  background: transparent;
  cursor: ns-resize;
  padding: 0;
}

.toc__rail::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3px;
  width: 2px;
  border-radius: 1px;
  background-color: var(--color-border);
  content: "";
}

.toc__rail-progress {
  position: absolute;
  top: 0;
  left: 3px;
  width: 2px;
  border-radius: 1px;
  background-color: var(--color-accent);
}

.toc__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  list-style: none;
  scrollbar-width: none;
}

.toc__list::-webkit-scrollbar {
  display: none;
}

.toc__item {
  list-style: none;
}

.toc__link {
  display: block;
  width: 100%;
  border: 0;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.45;
  padding: 6px 8px 6px calc(8px + var(--toc-indent));
  text-align: left;
  transition:
    background-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.toc__item--level-0 .toc__link {
  color: var(--color-text-secondary);
}

.toc__link:hover {
  background-color: var(--color-surface-raised);
  color: var(--color-text);
}

.toc__item.is-active .toc__link {
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 500;
}
</style>

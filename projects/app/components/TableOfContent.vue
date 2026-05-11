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

  if (!headings.length) {
    activeId.value = "";
    return;
  }

  const activationLine = (scrollRoot?.getBoundingClientRect().top ?? 0) + 180;
  const current = headings.reduce((active, heading) => {
    const top = heading.getBoundingClientRect().top;
    return top <= activationLine ? heading : active;
  }, headings[0]);

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
    <p class="toc__eyebrow">
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
          :style="{ height: `${progress * 100}%` }"
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
          :style="{ '--toc-indent': `${item.level * 0.55}rem` }"
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
  gap: 0.85rem;
  height: 100%;
  min-height: 0;
}

.toc__eyebrow {
  color: var(--color-rose);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.toc__body {
  display: grid;
  grid-template-columns: 0.75rem minmax(0, 1fr);
  gap: 0.75rem;
  min-height: 0;
}

.toc__rail {
  position: relative;
  width: 0.75rem;
  min-height: 10rem;
  align-self: stretch;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-sky) 34%, transparent);
  cursor: ns-resize;
  padding: 0;
}

.toc__rail::before {
  position: absolute;
  inset: 0.25rem;
  content: "";
  border-radius: inherit;
  background: color-mix(in srgb, var(--color-surface-strong) 66%, transparent);
}

.toc__rail-progress {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0.35rem;
  min-height: 0.75rem;
  border-radius: 999px;
  background:
    linear-gradient(
      180deg,
      var(--color-rose),
      var(--color-mint)
    );
  box-shadow: 0 10px 24px color-mix(in srgb, var(--color-rose) 28%, transparent);
  transform: translateX(-50%);
}

.toc__list {
  display: grid;
  gap: 0.2rem;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  padding: 0.1rem 0.35rem 0.1rem 0;
  scrollbar-width: none;
}

.toc__list::-webkit-scrollbar {
  display: none;
}

.toc__item {
  --toc-font-size: 0.84rem;
  --toc-font-weight: 560;
  --toc-marker-height: 0.28rem;
  --toc-marker-width: 0.28rem;

  list-style: none;
  opacity: 0.44;
  transform: translateX(var(--toc-indent));
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.toc__item--level-0 {
  --toc-font-size: 0.9rem;
  --toc-font-weight: 760;
  --toc-marker-height: 0.2rem;
  --toc-marker-width: 0.7rem;

  opacity: 0.72;
}

.toc__item--level-1 {
  --toc-font-size: 0.82rem;
  --toc-font-weight: 620;
}

.toc__item--level-2,
.toc__item--level-3 {
  --toc-font-size: 0.76rem;
  --toc-font-weight: 520;
  --toc-marker-height: 0.22rem;
  --toc-marker-width: 0.22rem;
}

.toc__item.is-active {
  opacity: 1;
  transform: translateX(calc(var(--toc-indent) + 0.18rem));
}

.toc__link {
  display: grid;
  grid-template-columns: var(--toc-marker-width) minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
  width: calc(100% - var(--toc-indent));
  min-height: 2rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;
  font: inherit;
  font-size: var(--toc-font-size);
  font-weight: var(--toc-font-weight);
  line-height: 1.25;
  padding: 0.35rem 0.7rem;
  text-align: left;
  text-wrap: pretty;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.toc__link::before {
  width: var(--toc-marker-width);
  height: var(--toc-marker-height);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-mint) 72%, var(--color-rose));
  content: "";
  opacity: 0.68;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.toc__link:hover,
.toc__item.is-active .toc__link {
  background: color-mix(in srgb, var(--color-rose-soft) 62%, transparent);
  color: var(--color-ink);
}

.toc__item.is-active .toc__link::before {
  opacity: 1;
  transform: scaleX(1.2);
}

:global(:where(.dark, .dark-mode)) .toc__rail::before {
  background: rgba(15, 23, 42, 0.68);
}
</style>

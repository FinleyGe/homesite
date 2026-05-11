<template>
  <figure
    v-if="!isMermaid"
    class="code-block"
    :data-language="language"
  >
    <figcaption class="code-block__header">
      <div class="code-block__meta">
        <b>{{ language || "text" }}</b>
        <i v-if="filename">{{ filename }}</i>
      </div>

      <button
        type="button"
        class="code-block__copy"
        :class="{ 'is-copied': codeCopied }"
        @click="copyCode"
      >
        {{ codeCopied ? t("blog.codeCopied") : t("blog.copyCode") }}
      </button>
    </figcaption>

    <pre :class="$props.class"><slot /></pre>
  </figure>

  <Mermaid v-else>
    {{ code }}
  </Mermaid>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
});
const codeCopied = ref(false);
const { t } = useI18n();

function copyCode() {
  useClipboard().copy(props.code);
  codeCopied.value = true;
  setTimeout(() => {
    codeCopied.value = false;
  }, 2000);
}

const isMermaid = computed(() => {
  return props.language === "mermaid";
});
</script>

<style scoped>
.code-block {
  overflow: hidden;
  margin-block: 1.35rem;
  border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  border-radius: 1.2rem;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-surface-strong) 86%, transparent),
      color-mix(in srgb, var(--color-sky) 14%, var(--color-surface))
    );
  box-shadow: var(--shadow-home-soft);
}

.code-block__header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  padding: 0.75rem 0.9rem;
}

.code-block__meta {
  display: flex;
  gap: 0.55rem;
  align-items: baseline;
  min-width: 0;
}

.code-block__meta b {
  color: var(--color-ink);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.code-block__meta i {
  overflow: hidden;
  color: color-mix(in srgb, var(--color-ink) 54%, transparent);
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-block__copy {
  flex: 0 0 auto;
  min-height: 2rem;
  border: 1px solid color-mix(in srgb, var(--color-rose) 20%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-rose-soft) 54%, transparent);
  color: color-mix(in srgb, var(--color-ink) 82%, var(--color-rose));
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 720;
  padding: 0 0.75rem;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

.code-block__copy:hover {
  border-color: color-mix(in srgb, var(--color-rose) 34%, transparent);
  transform: translateY(-1px);
}

.code-block__copy.is-copied {
  background: color-mix(in srgb, var(--color-mint) 24%, var(--color-surface));
}

pre {
  margin: 0;
  overflow-x: auto;
  padding: 1rem 1.1rem;
  background: transparent !important;
  color: var(--color-ink);
  font-family: var(--font-code);
  font-size: clamp(0.82rem, 1.5vw, 0.92rem);
  line-height: 1.72;
  tab-size: 2;
  white-space: pre;
}

pre :deep(*) {
  font-family: var(--font-code);
}

pre :deep(code) {
  display: block;
  min-width: max-content;
}

pre :deep(.line) {
  display: block;
  min-height: 1.72em;
}

pre :deep(.line.highlight),
pre :deep(.highlighted) {
  margin-inline: -1.1rem;
  padding-inline: 1.1rem;
  background: color-mix(in srgb, var(--color-rose-soft) 42%, transparent);
}

pre:deep(.shiki),
pre:deep(.shiki span),
pre :deep(.shiki),
pre :deep(.shiki span) {
  background: transparent !important;
}

:global(:where(.dark, .dark-mode)) pre:deep(.shiki),
:global(:where(.dark, .dark-mode)) pre:deep(.shiki span),
:global(:where(.dark, .dark-mode)) pre :deep(.shiki),
:global(:where(.dark, .dark-mode)) pre :deep(.shiki span) {
  color: var(--shiki-dark) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

:global(:where(.dark, .dark-mode)) .code-block {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}
</style>

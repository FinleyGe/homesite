<template>
  <figure
    v-if="!isMermaid"
    class="code-block"
    :data-language="language"
  >
    <figcaption class="code-block__header">
      <div class="code-block__meta">
        <span class="code-block__lang">{{ language || "text" }}</span>
        <span v-if="filename" class="code-block__file">{{ filename }}</span>
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
  margin-block: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
}

.code-block__header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-raised);
  padding: 8px 16px;
}

.code-block__meta {
  display: flex;
  gap: 8px;
  align-items: baseline;
  min-width: 0;
}

.code-block__lang {
  color: var(--color-text-secondary);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-weight: 500;
}

.code-block__file {
  overflow: hidden;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-block__copy {
  flex: 0 0 auto;
  min-height: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0 10px;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.code-block__copy:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.code-block__copy.is-copied {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

pre {
  margin: 0;
  overflow-x: auto;
  padding: 16px;
  background: transparent !important;
  color: var(--color-text);
  font-family: var(--font-code);
  font-size: 0.875rem;
  line-height: 1.7;
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
  min-height: 1.7em;
}

pre :deep(.line.highlight),
pre :deep(.highlighted) {
  margin-inline: -16px;
  padding-inline: 16px;
  background-color: var(--color-accent-soft);
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
</style>

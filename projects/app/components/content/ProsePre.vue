<template>
  <div
    v-if="!isMermaid"
    class="bg-gray-50 dark:bg-gray-700 p-4 my-4 rounded-lg"
    v-bind="props"
  >
    <div class="flex justify-between items-center mb-1 border-b-2">
      <div class="flex flex-col">
        <b>{{ language }}</b>
        <i>{{ filename }}</i>
      </div>
      <div class="flex flex-row items-center">
        <button
          class="copy-btn hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer px-2 py-1 rounded-xl"
          :class="{
            'bg-green-300 hover:bg-green-400': codeCopied,
          }"
          @click="copyCode"
        >
          {{ codeCopied ? "Copied" : "Copy" }}
        </button>
      </div>
    </div>
    <pre :class="$props.class"><slot/></pre>
  </div>

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

<style scoped lang="scss">
@font-face {
  font-family: "Fira Code";
  src: "/fonts/firacode.ttf";
  font-weight: normal;
  font-style: normal;
}

/* pre code .line {
  display: block;
} */

pre {
  font-family: "Fira Code", monospace;
  :deep(*) {
    font-family: "Fira Code", monospace;
  }
  :deep(.line) {
    &::before {
      content: attr(line);
      display: inline-block;
      margin-right: 1em;
      color: #999;
    }
  }
  white-space: pre;
  overflow-x: auto;
}
</style>

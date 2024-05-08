<script setup lang="ts">
const colorMode = useColorMode();
const color = computed(() => colorMode.value === "dark" ? "rgb(251, 207, 232)" : "rgb(157, 23, 77)");
const h1Color = computed(() => colorMode.value === "dark" ? "rgb(251, 207, 232)" : "rgb(157, 23, 77)");
const h2Color = computed(() => colorMode.value === "dark" ? "rgb(245, 149, 204)" : "rgb(173, 19, 130)");
const h3Color = computed(() => colorMode.value === "dark" ? "rgb(227, 77, 163)" : "rgb(144, 40, 156)");

</script>
<template>
  <div class="markdown-body">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.markdown-body {
  :deep(h1) {
    color: v-bind("h1Color");
    font-size: 1.5rem;
  }

  :deep(h2) {
    font-size: 1.25rem;
    color: v-bind("h2Color");
  }

  :deep(h3) {
    font-size: 1.125rem;
    color: v-bind("h3Color");
  }

  :deep(em) {
    font-style: italic;
    color: v-bind("color");
  }

  :deep(strong) {
    font-weight: bold;
    color: v-bind("color");
  }

  :deep(p) {
    margin: 0.5rem 0;
    text-indent: 2rem;
  }

  :deep(u) {
    color: v-bind("color");
    text-decoration: underline;
  }

  :deep(ol) {
    margin: 0.5rem 0;
    text-indent: 2rem;
    counter-reset: list;

    li {
      margin: 0.5rem 0;
      counter-increment: list;

      &::before {
        content: counter(list) ".";
        margin-right: 0.5rem;
      }
    }
  }

  :deep(ul) {
    margin: 0.5rem 0;
    text-indent: 2rem;

    li {
      margin: 0.5rem 0;

      &::before {
        content: "•";
        margin-right: 0.5rem;
      }
    }
  }
}
</style>

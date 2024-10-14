<script setup lang="ts">
</script>
<template>
  <code :class="$colorMode.value"
    class="dark:bg-gray-900 light:bg-gray-100 p-1 m-1">
    <slot></slot>
  </code>
</template>

<style scoped lang="scss">
@font-face {
  font-family: 'Fira Code';
  src: '/fonts/firacode.ttf';
  font-weight: normal;
  font-style: normal;
}

code {
  margin-inline: 0.25rem;
  font-family: 'Fira Code', monospace;
  counter-set: line;
  overflow: auto;

  :deep(*) {
    font-family: 'Fira Code', monospace;
  }

  :deep([data-line])::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2em;
    /* Adjust as needed to suit your design */
    text-align: right;
    margin-right: 0.5em;
    /* Adjust as needed to suit your design */
    color: #999;
    /* Adjust the color as needed */
  }

}

code {
  :deep(span) {
    color: var(--shiki-light);
  }

  :deep([data-highlighted-line]) {
    @apply bg-pink-50;
  }
}

code.dark {
  :deep(span) {
    color: var(--shiki-dark);
  }

  :deep([data-highlighted-line]) {
    @apply bg-pink-800;
  }
}
</style>

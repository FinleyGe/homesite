<script setup lang="ts">
</script>
<template>
  <code :class="$colorMode.value" class="dark:bg-gray-900 light:bg-gray-300">
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

  :deep(*) {
    font-family: 'Fira Code', monospace;
  }

  counter-set: line;

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
}

code.dark {
  :deep(span) {
    color: var(--shiki-dark);
  }
}
</style>

<style lang="scss"></style>

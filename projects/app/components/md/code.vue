<script setup lang="ts">
const colorMode = useColorMode();
</script>
<template>
  <ColorScheme placeholder="Loading...">
    <code :class="$colorMode.value">
      <slot></slot>
    </code>
  </ColorScheme>
</template>

<style scoped lang="scss">
@font-face {
  font-family: 'Fira Code';
  src: '/fonts/firacode.ttf';
  font-weight: normal;
  font-style: normal;
}

code {
  font-family: 'Fira Code', monospace;

  :deep(*) {
    font-family: 'Fira Code', monospace;
  }
}
</style>

<style lang="scss">
@use "@catppuccin/highlightjs/sass/theme";

.light {
  @include theme.highlights("latte", "hex");
}

.dark {
  @include theme.highlights("mocha", "hex");
}
</style>

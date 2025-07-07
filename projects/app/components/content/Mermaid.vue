<template>
  <div class="mermaid" v-if="show">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const show = ref(false);
const colorMode = useColorMode();

const { $mermaid } = useNuxtApp();

onMounted(async () => {
  show.value = true;
  $mermaid().initialize({
    startOnLoad: true,
    theme: colorMode.value === "dark" ? "dark" : "default",
  });
  await nextTick();
  $mermaid().init();
});
</script>

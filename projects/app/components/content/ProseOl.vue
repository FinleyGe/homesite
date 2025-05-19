<script setup lang="ts"></script>
<template>
  <ol>
    <slot></slot>
  </ol>
</template>

<style lang="scss" scoped>
ol {
  list-style: decimal;
  margin-left: 1.5rem;
  margin-top: 1rem;
}
</style>

<script setup lang="ts">
import ColorfulButton from '~/components/common/ColorfulButton.vue';

</script>
<template>
  <div>
    <span class="title">
      Finley Ge
    </span>
    <colorful-button color="pink">
      Click me
    </colorful-button>
  </div>
</template>

<style scoped lang="scss">

@font-face {
  font-family: victor;
  src: url("/fonts/victor.ttf");
  font-style: italic;
}

.title {
  font-size: 24px;
  color: #333;
  font-family: victor;
  font-style: italic;
}
</style>

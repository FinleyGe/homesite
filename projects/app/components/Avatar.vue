<script setup lang="ts">
const localePath = useLocalePath();
const router = useRouter();

const goToAvatar = () => {
  router.push(localePath("/about/avatar"));
};
</script>
<template>
  <div class="flex items-center justify-center">
    <img
      class="w-20 h-20 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
      src="https://avatars.githubusercontent.com/u/32237950?v=4"
      @click="goToAvatar"
    />
  </div>
</template>

<style scoped></style>

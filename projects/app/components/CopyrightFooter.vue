<script setup lang="ts">
const count = ref<number>(0);
const router = useRouter();

watch(count, () => {
  if (count.value >= 3) {
    count.value = 0;
    router.push("/admin");
  }
});
</script>
<template>
  <div class="flex flex-col items-center">
    <span @click="count++">
      FinleyGe © 2022 - {{ new Date().getFullYear() }}
    </span>
    <!-- <a href="https://beian.miit.gov.cn/" target="_blank" class="text-blue-500 dark:text-blue-400">晋ICP备2022008114号-1</a> -->
  </div>
</template>

<style scoped lang="scss"></style>

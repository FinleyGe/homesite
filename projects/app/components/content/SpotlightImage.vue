<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  src: string;
  alt?: string;
  spotlightRadius?: number;
  spotlightX?: string;
  spotlightY?: string;
}>();

const isHovering = ref(false);

const radius = props.spotlightRadius || 150;
const spotlightX = props.spotlightX || "50%";
const spotlightY = props.spotlightY || "50%";

const maskStyle = computed(() => {
  const gradient = `radial-gradient(circle ${radius}px at ${spotlightX} ${spotlightY}, transparent 0%, transparent ${radius}px, black ${radius + 10}px)`;
  return {
    filter: "blur(10px)",
    maskImage: gradient,
    "-webkit-mask-image": gradient,
  };
});

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};
</script>

<template>
  <div
    class="relative block"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 原始图片 -->
    <img :src="src" :alt="alt" class="block w-full h-auto absolute z-0" />

    <!-- 模糊层 (使用模糊的图片副本，带圆形镂空遮罩) -->
    <img
      v-if="isHovering"
      :src="src"
      :alt="alt"
      class="absolute top-0 left-0 w-full h-auto pointer-events-none transition-opacity duration-300 z-10"
      :style="maskStyle"
    />
  </div>
</template>

<style scoped>
img {
  display: block;
}
</style>

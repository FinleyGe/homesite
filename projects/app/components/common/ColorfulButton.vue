<script setup lang="ts">
type Props = {
  color?: string
  darkColor?: string
  onclick?: () => void
  routerLink?: string
  link?: string
}
const props = defineProps<Props>();
const router = useRouter();

async function handleClick() {
  if (props.onclick) {
    props.onclick();
  } else if (props.routerLink) {
    await router.push(props.routerLink);
  } else if (props.link) {
    window.open(props.link);
  }
}

</script>
<template>
  <span class="content text-black dark:text-gray-100" @click="handleClick">
    <slot />
    <span class="bar" />
  </span>
</template>

<style scoped lang="scss">
.content {
  font-size: 1rem;
  z-index: 2;
  background-color: transparent;
  position: relative;
  cursor: pointer;

  &:hover {

    & .bar {
      height: 16px;
      transition: height 0.1s ease-in;
    }
  }

  .bar {
    position: absolute;
    bottom: 2px;
    left: -2px;
    height: 6px;
    width: calc(100% + 4px);
    background-color: v-bind("color");
    opacity: 0.4;
    z-index: 3;
    // transition: height 0.1s ease-in-out;
    border-radius: 4px;
  }
}
</style>

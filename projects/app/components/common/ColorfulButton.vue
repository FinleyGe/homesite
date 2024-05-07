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

async function handleClick(){
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
  <button
    @click="handleClick"
  >
    <span class="content text-black dark:text-gray-100">
      <slot />
    </span>
    <span class="bar" />
  </button>
</template>

<style scoped lang="scss">
button {
  border: none;
  padding-inline: 6px;
  background-color: transparent;
  position: relative;
  .content {
    font-size: 1rem;
    z-index: 2;
    background-color: transparent;
    position: relative;

    &:hover {
      cursor: pointer;

      & ~ .bar {
        height: 16px;
        transition: height 0.2s ease-in-out;
      }
    }
  }

  .bar {
    position: absolute;
    bottom: 4px;
    left: 0;
    height: 8px;
    width: 100%;
    background-color: v-bind("color");
    opacity: 0.5;
    z-index: 1;
    transition: height 0.2s ease-in-out;
    border-radius: 4px;
  }
}

</style>

<script setup lang="ts">
type Props = {
  active?: boolean
  color?: string
  darkColor?: string
  onclick?: () => void
  routerLink?: string
  link?: string
}
const props = defineProps<Props>();
const router = useRouter();
const href = computed(() => props.routerLink ?? props.link ?? "#");

async function handleClick(event: MouseEvent) {
  event.preventDefault();

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
  <a
    class="content text-black dark:text-gray-100 text-nowrap"
    :class="{ 'is-active': active }"
    :href="href"
    :aria-current="active ? 'page' : undefined"
    @click="handleClick"
  >
    <span class="label">
      <slot />
    </span>
    <span class="bar" aria-hidden="true" />
  </a>
</template>

<style scoped lang="scss">
.content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-width: 2.75rem;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding-inline: 0.15rem;
  background-color: transparent;
  cursor: pointer;
  isolation: isolate;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, v-bind("color") 58%, currentColor);
    outline-offset: 0.25rem;
    border-radius: 999px;
  }

  &:hover,
  &.is-active {
    & .bar {
      height: 1.08em;
      opacity: 0.48;
    }
  }

  &:active {
    & .bar {
      height: 1.18em;
      opacity: 0.56;
    }
  }

  .label {
    position: relative;
    z-index: 1;
  }

  .bar {
    position: absolute;
    bottom: 0.63rem;
    left: 50%;
    z-index: 0;
    width: calc(100% + 0.55rem);
    height: 0.38em;
    border-radius: 999px;
    background-color: v-bind("color");
    opacity: 0.38;
    transform: translateX(-50%);
    transition:
      height 140ms ease,
      opacity 140ms ease;
    pointer-events: none;
  }
}
</style>

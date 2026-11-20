<script setup lang="ts">
type Props = {
  active?: boolean;
  color?: string;
  darkColor?: string;
  onclick?: () => void;
  routerLink?: string;
  link?: string;
};

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
    class="nav-link"
    :class="{ 'is-active': active }"
    :href="href"
    :aria-current="active ? 'page' : undefined"
    @click="handleClick"
  >
    <span class="nav-link__label">
      <slot />
    </span>
  </a>
</template>

<style scoped>
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 150ms var(--ease-out),
    background-color 150ms var(--ease-out);
}

.nav-link:hover {
  color: var(--color-text);
  background-color: var(--color-surface-raised);
}

.nav-link.is-active {
  color: var(--color-text);
  font-weight: 500;
}

.nav-link.is-active::after {
  position: absolute;
  right: 12px;
  bottom: 4px;
  left: 12px;
  height: 2px;
  border-radius: 1px;
  background-color: var(--color-accent);
  content: "";
}
</style>

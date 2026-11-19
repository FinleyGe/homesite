<script setup lang="ts">
defineProps<{
  circle?: boolean;
  rounded?: boolean;
  hold?: boolean;
}>();

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?(): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?(): any;
}>();

const slots = useSlots();
</script>

<template>
  <button
    type="button"
    class="ui-button"
    :class="{
      'ui-button--icon': circle,
      'ui-button--active': hold,
    }"
  >
    <span v-if="slots.icon" class="ui-button__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-if="slots.default" class="ui-button__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  box-shadow: var(--highlight-top);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  padding: 0 12px;
  white-space: nowrap;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.ui-button:hover:not(:disabled) {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface-raised);
  color: var(--color-text);
}

.ui-button:active:not(:disabled) {
  transform: scale(0.98);
}

.ui-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ui-button--icon {
  width: 36px;
  height: 36px;
  padding: 0;
}

.ui-button--active {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.ui-button--active:hover:not(:disabled) {
  border-color: var(--color-accent-border);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.ui-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ui-button__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.ui-button__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

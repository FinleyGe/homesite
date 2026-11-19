<script setup lang="ts"></script>

<template>
  <div class="prose-table-wrap">
    <table class="prose-table">
      <slot />
    </table>
  </div>
</template>

<style scoped>
.prose-table-wrap {
  margin-block: 20px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.prose-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.5;
  text-align: left;
}

.prose-table :deep(thead) {
  background-color: var(--color-surface-raised);
}

.prose-table :deep(th) {
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 500;
  padding: 10px 12px;
}

.prose-table :deep(td) {
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 10px 12px;
}

.prose-table :deep(tbody tr:last-child td) {
  border-bottom: 0;
}

.prose-table :deep(tbody tr:hover) {
  background-color: var(--color-surface-raised);
}
</style>

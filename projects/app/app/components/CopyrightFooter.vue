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
  <div class="copyright-footer">
    <button
      type="button"
      class="copyright-footer__text"
      @click="count++"
    >
      Finley Ge © 2022–{{ new Date().getFullYear() }}
    </button>
  </div>
</template>

<style scoped>
.copyright-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.copyright-footer__text {
  margin: 0;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.33;
  cursor: default;
}
</style>

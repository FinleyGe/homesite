<script setup lang="ts">
import useStore from '~/stores';

useHead({
  title: 'Admin',
})

definePageMeta({
  middleware: (to) => {
    const store = useStore();
    if (to.path != '/admin/login' && !store.token) {
      return '/admin/login'
    }
  }
});

</script>
<template>
</template>

<style scoped></style>

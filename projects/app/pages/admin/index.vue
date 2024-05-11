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
  <div>
    <h1>Admin</h1>
    <div class="flex flex-row">
      <nuxt-link to="/admin/post">Posts</nuxt-link>
      </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import Button from '~/components/common/Button.vue';
import useStore from '~/stores';

const router = useRouter();

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
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-row">
      <Button @click="() => router.push('/admin/login')">Login</Button>
      <Button @click="() => router.push('/admin/post')">Post</Button>
      <Button @click="() => router.push('/admin/upload')">Upload</Button>
      <Button @click="() => router.push('/admin/collective')">Collective</Button>
    </div>
  </div>
</template>

<style scoped></style>

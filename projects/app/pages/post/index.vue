<script setup lang="ts">
import { Restart } from '@vicons/carbon';
import Button from '~/components/common/Button.vue';

const { data: postList, refresh } = useFetch('/api/post/latest', {
  $fetch: useApi({
    auth: false
  })
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <Button rounded @click="refresh">
      Refresh
      <template #icon>
        <Restart />
      </template>
    </Button>
    <div v-for="post in postList" :key="post.id" class="flex flex-row">
      <Post :content="post.content" :time="new Date(post.createdAt)" class="flex-grow" />
    </div>
  </div>
</template>

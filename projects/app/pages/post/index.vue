<script setup lang="ts">
import Button from '~/components/common/Button.vue';

const postList = ref<any[]>([])

const handleGetPostList = () => {
  useFetch('/api/post/latest', {
    method: 'GET',
    onResponse: (response) => {
      if (!response.error) {
        postList.value = response.response._data;
      } else {
        toast("Error", { type: 'error' });
      }
    }
  });
}

</script>
<template>
  <div class="max-w-4xl mx-auto">
    <Button @click="handleGetPostList"> Fetch Posts </Button>
    <div v-for="post in postList" :key="post.id" class="flex flex-row">
      <Post :content="post.content" :time="new Date(post.createdAt)" class="flex-grow"/>
    </div>
    </div>
</template>

<style scoped>

</style>

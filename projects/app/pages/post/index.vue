<script setup lang="ts">
import { toast } from 'vue3-toastify';
import Button from '~/components/common/Button.vue';

const postList = ref<any[]>([])

const {execute: handleGetPostList} = useFetch('/api/post/latest', {
    method: 'GET',
    onResponse: (response) => {
      if (!response.error) {
        postList.value = response.response._data;
      } else {
        toast("Error", { type: 'error' });
      }
    }
  });

// const {execute: handleGetFediPostList} = useFetch('/api/post/fedi', {
//   method: 'GET',
//   onResponse: (response) => {
//     if (!response.error) {
//       for (const post of response.response._data) {
//         postList.value.push(post);
//       }
//     } else {
//       toast("Error", { type: 'error' });
//     }
//   }
// });

onNuxtReady(() => {
  handleGetPostList();
  // handleGetFediPostList();
});

</script>
<template>
  <div class="max-w-4xl mx-auto">
    <Button @click="handleGetPostList"> Fetch Posts </Button>
    <div v-for="post in postList" :key="post.id" class="flex flex-row">
      <Post :content="post.content" :time="new Date(post.createdAt || post.created_at)" class="flex-grow"/>
    </div>
    </div>
</template>

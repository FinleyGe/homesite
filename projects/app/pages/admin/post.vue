<script setup lang="ts">
import Post from '~/components/Post.vue';
import Button from '~/components/common/Button.vue';
const content = ref<string>('');
const isPreview = ref<boolean>(false);

const post = ref<InstanceType<typeof Post> | null>(null);

const handleSubmit = () => {
  console.log('Submit', content.value);
}

const handleCancel = () => {
content.value = '';
}

const handlePreview = () => {
  isPreview.value = !isPreview.value;
  post.value?.update();
}

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl">Post Manage</h1>
    <div>
      Create Post
      <textarea
        v-show="!isPreview"
        v-model="content"
        class="w-full rounded-md min-h-20
        bg-gray-50 dark:bg-gray-700 text-black dark:text-white
        text-xl p-2 mt-2
        resize-y
        "
        placeholder="Write something here..."
      />
      <Post v-show="isPreview" ref="post" :content="content" :time="new Date()"/>
      <div class="flex justify-end">
        <Button @click="handleSubmit">Submit</Button>
        <Button @click="handleCancel">Cancel</Button>
        <Button @click="handlePreview">Preview</Button>
      </div>
    </div>
    <div>
      Post List
    </div>
  </div>
</template>

<style scoped>

</style>

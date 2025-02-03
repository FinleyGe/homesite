<script setup lang="ts">
import type { Post as PostType } from "@prisma/client";
import { toast } from "vue3-toastify";
import Post from "~/components/Post.vue";
import Button from "~/components/common/Button.vue";
import useStore from "~/stores";
const content = ref<string>("");
const isPreview = ref<boolean>(false);

const post = ref<InstanceType<typeof Post> | null>(null);
const lang = ref<string>("en");

const postList = ref<PostType[]>([]);

const store = useStore();

function handleDeletePost(id: string) {
  const { error } = useFetch(`/api/post/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + store.token,
    },
  });
  if (error.value) {
    toast("Error" + error.value, { type: "error" });
  } else {
    toast("Success", { type: "success" });
    handleGetPostList();
  }
}

const handleGetPostList = () => {
  useFetch("/api/post/latest", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + store.token,
    },
    onResponse: (response) => {
      if (!response.error) {
        postList.value = response.response._data;
      } else {
        toast("Error", { type: "error" });
      }
    },
  });
};

const handleSubmit = () => {
  useFetch("/api/post", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + store.token,
    },
    body: {
      content: content.value,
      language: lang.value,
    },
    onResponse: (response) => {
      if (!response.error) {
        toast("Success", { type: "success" });
        handleGetPostList();
      } else {
        toast("Error", { type: "error" });
      }
    },
  });
};

const handleCancel = () => {
  content.value = "";
};

const handlePreview = () => {
  isPreview.value = !isPreview.value;
  post.value?.update();
};
</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl">Post Manage</h1>
    <div>
      Create Post
      <textarea
        v-show="!isPreview"
        v-model="content"
        class="w-full rounded-md min-h-20 bg-gray-50 dark:bg-gray-700 text-black dark:text-white text-xl p-2 mt-2 resize-y"
        placeholder="Write something here..."
      />
      <Post
        v-show="isPreview"
        ref="post"
        :content="content"
        :time="new Date()"
      />

      <div class="flex justify-between mt-2">
        <select
          v-model="lang"
          class="rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white text-l p-2"
        >
          <option value="en">English</option>
          <option value="zh">简体中文</option>
        </select>
      </div>

      <div class="flex justify-end">
        <Button @click="handleSubmit">Submit</Button>
        <Button @click="handleCancel">Cancel</Button>
        <Button @click="handlePreview">
          <template v-if="isPreview">Edit</template>
          <template v-else>Preview</template>
        </Button>
      </div>
    </div>
    <div>
      <Button @click="handleGetPostList">Load More</Button>
      <div v-for="p in postList" :key="p.id" class="flex flex-row">
        <Post
          :content="p.content"
          :time="new Date(p.createdAt)"
          class="flex-grow"
        />
        <Button
          @click="
            () => {
              handleDeletePost(p.id);
            }
          "
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

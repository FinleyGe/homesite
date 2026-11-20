<script setup lang="ts">
type Message = {
  content: string,
  type: 'success' | 'error' | 'warning',
}

const messages = reactive<Message[]>([]);

function addMessage(message: Message) {
  messages.push(message);
  setTimeout(() => {
    messages.shift();
  }, 2000);
}

function toast(content: string, type: 'success' | 'error' | 'warning') {
  addMessage({ content, type });
}

provide('toast', toast);

</script>
<template>
  <div class="fixed right-1 top-1">
    <div
      v-for="message in messages" :key="message.content"
      class="p-4 rounded-xl w-fit bg-pink-50 dark:bg-pink-800 flex flex-col gap-4 shadow-2xl">
      <h1 class="text-2xl font-bold">{{ message.content }}</h1>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

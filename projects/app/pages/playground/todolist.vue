<script setup lang="ts">
import { toast } from 'vue3-toastify';
import Button from '~/components/common/Button.vue';
import { GetAll } from '~/api/todolist';
import { useFetchwithToken } from '~/api/utils';
import Item from '~/components/todolist/item.vue';

const addTodo = ref<string>('');
const endtime = ref<string>('');

const {
  execute: handleGetTodoList,
  data: todolist,
} = await GetAll()

async function handleAddTodo() {
  if (!addTodo.value) {
    return;
  }
  await useFetchwithToken('/api/todolist/add', {
    method: 'POST',
    body: {
        content: addTodo.value,
    },
    onResponse: (response) => {
      if (!response.error) {
        handleGetTodoList();
      } else {
        toast("Error", { type: 'error' });
      }
    }
  });
  addTodo.value = '';
}

onNuxtReady(() => {
  handleGetTodoList();
});


</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center my-8">Todo List</h1>
    <input
      v-model="addTodo"
      class="w-full p-2 border border-gray-300 rounded bg-gray-200 dark:bg-gray-600"
      type="text" 
      placeholder="Add a todo, press enter to submit"
      @keyup.enter="handleAddTodo()"
    >
    <div>
      End Time:
      <input type="datetime-local" v-model="endtime"/>
    </div>
    <div class="flex flex-row">
      <Button class="w-full mt-2" @click="handleAddTodo"> Add </Button>
      <Button class="w-full mt-2" @click="handleGetTodoList"> Refresh </Button>
    </div>
    
    <div class="flex flex-col">
      <Item v-for="todo in todolist" :key="todo.id" :todo="todo" @update="handleGetTodoList()"/>
    </div>
  </div>
</template>

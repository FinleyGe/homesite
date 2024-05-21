<script setup lang="ts">
import { toast } from 'vue3-toastify';
import Button from '~/components/common/Button.vue';
import { GetAll } from '~/api/todolist';
import { useFetchWithToken } from '~/api/utils';
import Item from '~/components/todolist/item.vue';
import Calendar from 'primevue/calendar';

const addTodo = ref<string>('');
const endTimeDate = ref<Date>(new Date());
const endTimeTime = ref<Date>(new Date());
const endTime = computed(() => {
  if (!endTimeDate.value || !endTimeTime.value) {
    return;
  }
  const date = new Date(endTimeDate.value);
  const time = new Date(endTimeTime.value);
  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  return date;
});
const priority = ref<number>(0);

const isEndTime = ref<boolean>(false);

const {
  execute: handleGetTodoList,
  data: todolist,
} = await GetAll()

async function handleAddTodo() {
  if (!addTodo.value) {
    return;
  }
  await useFetchWithToken('/api/todolist/add', {
    method: 'POST',
    body: {
        content: addTodo.value,
        endTime: isEndTime.value ? endTime.value : null,
        priority: Number(priority.value),
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

function handleCleanFinished() {
  todolist.value?.forEach(async (todo) => {
    if (todo.done) {
      await useFetchWithToken(`/api/todolist/${todo.id}`, {
        method: 'DELETE',
        onResponse: (response) => {
          if (!response.error) {
            handleGetTodoList();
          } else {
            toast("Error", { type: 'error' });
          }
        }
      })
    }
  });
}

const TodoList = ref<TodoList[]>([]);
onNuxtReady(async () => {
  const res = await fetch('/api/todolist');
  TodoList.value = await res.json();
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
    <div class="flex flex-row items-center justify-start gap-2">
      End Time:
      <input v-model="isEndTime" type="checkbox" class="size-6" />
    <div
        class="mt-2 flex flex-row w-fit gap-1 items-center"
        :class="isEndTime ? 'flex' : 'hidden'"
    >
      <Calendar v-model="endTimeDate" hourFormat="24"
        :min-date="new Date()"
        unstyle
        :pt="{
          input: 'bg-gray-200 dark:bg-gray-600 p-2 border border-gray-300 rounded',
          button: 'hover:bg-pink-300 dark:hover:bg-pink-500',
          header: 'flex flex-row justify-between',
          panel: 'bg-pink-200 dark:bg-pink-600 flex flex-col rounded-lg bg-opacity-80',
          previousButton: 'p-2',
          nextButton: 'p-2',
          container: 'mx-auto w-fit',
          day: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
        }"
      />
      <Calendar v-model="endTimeTime" hourFormat="24"
        :min-date="new Date()"
        timeOnly
        unstyle
        :pt="{
          input: 'bg-gray-200 dark:bg-gray-600 p-2 border border-gray-300 rounded',
          timePicker: 'bg-pink-200 dark:bg-pink-600 flex flex-row justify-between rounded-lg bg-opacity-80',
          hour: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
          minute: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
          incrementButton: 'p-2',
          decrementButton: 'p-2',
        }"
      />
    </div>
      <div>
        Priority:
        <input v-model.number="priority" type="range" min="0" max="3" step="1" class="w-24" />
        </div>
      </div>
    <div class="flex flex-row">
      <Button class="w-full mt-2" @click="handleAddTodo"> Add </Button>
      <Button class="w-full mt-2" @click="handleGetTodoList"> Refresh </Button>
    </div>
    <div class="flex flex-col">
      <Item v-for="todo in todolist" :key="todo.id" :todo="todo" @update="handleGetTodoList()"/>
    </div>

    <Button @click="handleCleanFinished"> Clean Finished </Button>
  </div>
</template>

<style scoped lang="scss">
</style>

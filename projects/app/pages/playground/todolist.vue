<script setup lang="ts">
import Button from '~/components/common/Button.vue';
import Item from '~/components/todolist/item.vue';
import Calendar from 'primevue/calendar';
import useApi from '~/composables/useApi';

const TodoInput = ref<string>('');
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
  refresh: refreshTodoList,
  data: todolist,
} = useFetch('/api/todolist/all', {
  method: 'get',
  lazy: true,
  $fetch: useApi()
});

const { execute: handleAddTodo } = useFetch('/api/todolist/add', {
  method: 'POST',
  body: {
    content: TodoInput,
    endTime,
    priority,
  },
  onResponse: () => refreshTodoList,
  immediate: false,
  watch: false,
  $fetch: useApi()
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center my-8">Todo List</h1>
    <input
v-model="TodoInput" class="w-full p-2 border border-gray-300 rounded bg-gray-200 dark:bg-gray-600"
      type="text" placeholder="Add a todo, press enter to submit" @keyup.enter="handleAddTodo()">
    <div class="flex flex-row items-center justify-start gap-2">
      End Time:
      <input v-model="isEndTime" type="checkbox" class="size-6">
      <div class="mt-2 flex flex-row w-fit gap-1 items-center" :class="isEndTime ? 'flex' : 'hidden'">
        <Calendar
v-model="endTimeDate" hour-format="24" :min-date="new Date()" unstyle :pt="{
          input: 'bg-gray-200 dark:bg-gray-600 p-2 border border-gray-300 rounded',
          button: 'hover:bg-pink-300 dark:hover:bg-pink-500',
          header: 'flex flex-row justify-between',
          panel: 'bg-pink-200 dark:bg-pink-600 flex flex-col rounded-lg bg-opacity-80',
          previousButton: 'p-2',
          nextButton: 'p-2',
          container: 'mx-auto w-fit',
          day: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
        }" />
        <Calendar
v-model="endTimeTime" hour-format="24" :min-date="new Date()" time-only unstyle :pt="{
          input: 'bg-gray-200 dark:bg-gray-600 p-2 border border-gray-300 rounded',
          timePicker: 'bg-pink-200 dark:bg-pink-600 flex flex-row justify-between rounded-lg bg-opacity-80',
          hour: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
          minute: 'p-2 cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-500',
          incrementButton: 'p-2',
          decrementButton: 'p-2',
        }" />
      </div>
      <div>
        Priority:
        <input v-model.number="priority" type="range" min="0" max="3" step="1" class="w-24">
      </div>
    </div>
    <div class="flex flex-row">
      <Button class="w-full mt-2" @click="handleAddTodo()"> Add </Button>
      <Button class="w-full mt-2" @click="refreshTodoList()"> Refresh </Button>
    </div>
    <div class="flex flex-col">
      <div v-if="!todolist">
        No Todos
      </div>
      <Item v-for="todo in todolist" v-else :key="todo.id" :todo="todo as any" @update="refreshTodoList" />
    </div>

    <!-- <Button @click="handleCleanFinished"> Clean Finished </Button> -->
  </div>
</template>

<style scoped lang="scss"></style>

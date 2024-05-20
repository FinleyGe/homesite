<script setup lang="ts">
import type { TodoList } from '@prisma/client';
import { Checkmark, Pen, TrashCan } from '@vicons/carbon';
import { useFetchwithToken } from '~/api/utils';

const props = defineProps<{
  todo: TodoList;
}>();

const emits = defineEmits<{
  update: []
}>();

const isEdit = ref<boolean>(false);
const priority = ref<number>(props.todo.priority);

async function handleUpdateTodo() {
  await useFetchwithToken('/api/todolist/' + props.todo.id, {
    method: 'put',
    body: {
      done: !props.todo.done,
    },
  });
  emits('update');
}

async function handleDeleteTodo() {
  await useFetchwithToken('/api/todolist/' + props.todo.id, {
    method: 'delete',
  });
  emits('update');
}

async function handleEdit() {
  await useFetchwithToken('/api/todolist/' + props.todo.id, {
    method: 'put',
    body: {
      content: props.todo.content,
      priority: Number(priority.value),
    },
  });
  isEdit.value = false;
  emits('update');
}

</script>
<template>
  <div class="flex flex-row my-2 items-center gap-2">
    <input type="checkbox" class="size-6 flex-grow-0" :checked="props.todo.done" @change="handleUpdateTodo">
    <button class="bg-red-500 text-white size-6 p-1 rounded-xl flex-grow-0" @click="handleDeleteTodo">
      <TrashCan />
    </button>
    <button class="bg-blue-500 text-white size-6 p-1 rounded-xl flex-grow-0" @click="isEdit = true">
      <Pen />
    </button>
    <span
v-if="!isEdit" class="text-sm px-2 py-1 rounded-xl flex-grow-0" :class="{
      'bg-red-500 text-white': props.todo.priority === 0,
      'bg-yellow-500': props.todo.priority === 1,
      'bg-green-500': props.todo.priority === 2,
      'bg-blue-500 text-white': props.todo.priority === 3,
    }">p{{ props.todo.priority }}</span>
    <span v-else>
      <select v-model.number="priority" class="flex-grow-0 dark:bg-gray-600 px-1 rounded-xl">
        <option :value="0">p0</option>
        <option :value="1">p1</option>
        <option :value="2">p2</option>
        <option :value="3">p3</option>
      </select>
    </span>
    <span
v-if="!isEdit" class="text-xl flex-grow-1"
      :class="{ 'text-decoration-line: line-through text-gray-500': props.todo.done, }">{{ props.todo.content }}</span>
    <div v-else>
      <input v-model="props.todo.content" type="text" class="flex-grow-1 dark:bg-gray-600">
      <button class="bg-green-500 text-white size-6 p-1 rounded-xl flex-grow-0" @click="handleEdit">
        <Checkmark />
      </button>
    </div>
    <span v-if="props.todo.endTime" class="text-sm">
      {{ new Date(props.todo.endTime).toLocaleString() }}
    </span>
  </div>
</template>

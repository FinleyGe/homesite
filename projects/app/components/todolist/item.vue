<script setup lang="ts">
import type { TodoList } from '@prisma/client';
import { TrashCan } from '@vicons/carbon';
import { useFetchwithToken } from '~/api/utils';

const props = defineProps<{
  todo: TodoList;
}>();

const emits = defineEmits<{
  update: []
}>();

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


</script>
<template>
  <div class="flex flex-row my-2 items-center content-between justify-between gap-2">
    <input type="checkbox" class="size-6 flex-grow-0" :checked="props.todo.done"
    @change="handleUpdateTodo"
    />
    <span class="text-xl flex-grow-1">{{ props.todo.content }}</span>
    <span v-if="props.todo.endTime">{{ props.todo.endTime }}</span>
    <button @click="handleDeleteTodo"
      class="bg-red-500 text-white size-6 p-1 rounded-xl flex-grow-0">
      <TrashCan />
    </button>
  </div>
</template>

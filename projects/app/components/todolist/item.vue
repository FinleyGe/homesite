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
    },
  });
  isEdit.value = false;
  emits('update');
}

</script>
<template>
  <div class="flex flex-row my-2 items-center gap-2">
    <input type="checkbox" class="size-6 flex-grow-0" :checked="props.todo.done"
    @change="handleUpdateTodo"
    />
    <button @click="handleDeleteTodo"
      class="bg-red-500 text-white size-6 p-1 rounded-xl flex-grow-0">
      <TrashCan />
    </button>
    <button @click="isEdit = true"
      class="bg-blue-500 text-white size-6 p-1 rounded-xl flex-grow-0">
      <Pen />
    </button>
    <span class="text-xl flex-grow-1" v-if="!isEdit">{{ props.todo.content }}</span>
    <div v-else>
    <input type="text" v-model="props.todo.content" class="flex-grow-1" />
    <button @click="handleEdit"
      class="bg-green-500 text-white size-6 p-1 rounded-xl flex-grow-0">
        <Checkmark />
    </button>
      </div>
    <span v-if="props.todo.endTime">{{ props.todo.endTime }}</span>
  </div>
</template>

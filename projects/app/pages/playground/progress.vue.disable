<script setup lang="ts">
import { Add } from '@vicons/carbon';
import ProgressItem from '~/components/playgroud/ProgressItem.vue';

const { t } = useI18n({
  messages: {
    en: {
      progress: 'Progress',
      name: 'Name',
      description: 'Description',
      target: 'Target',
      status: 'Status',
      add: 'Add',
      toggle_add: 'Toggle Add',
    },
    zh: {
      progress: '进度',
      name: '名称',
      description: '描述',
      target: '目标',
      status: '状态',
      add: '添加',
      toggle_add: '切换添加',
    }
  }
})

const page = ref(1);

const { data: progressList, refresh: refreshProgressList } = useFetch('/api/progress/list', {
  method: 'GET',
  params: {
    page,
  },
  $fetch: useApi(),
});

const body = ref({
  name: '',
  description: '',
  target: 0,
  status: 0,
});

const bodyReset = () => {
  body.value = {
    name: '',
    description: '',
    target: 0,
    status: 0,
  }
}

const isShowAdd = ref(false);
const toggleShow = useToggle(isShowAdd);

const { execute: addProgress } = useFetch('/api/progress/add', {
  method: 'POST',
  body: body,
  immediate: false,
  watch: false,
  $fetch: useApi(),
  onResponse: () => {
    refreshProgressList();
    toggleShow();
    bodyReset();
  }
});

// const { execute: updateProgress } = useFetch('/api/progress/update', {
//   method: 'POST',
//   body: body,
//   immediate: false,
//   watch: false,
//   $fetch: useApi(),
//   onResponse: () => {
//     refreshProgressList();
//     bodyReset();
//   }
// });

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl cursor-pointer" @click="refreshProgressList()"> {{ t('progress') }} </h1>
    <div v-if="isShowAdd">
      <div class="flex flex-row gap-2">
        <div class="flex flex-col gap-2">
          <label class="text-sm"> {{ t('name') }} </label>
          <CommonInput v-model="body.name" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm"> {{ t('description') }} </label>
          <CommonInput v-model="body.description" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm"> {{ t('target') }} </label>
          <CommonInput v-model.number="body.target" type="number" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm"> {{ t('status') }} </label>
          <CommonInput v-model.number="body.status" type="number" />
        </div>

      </div>
      <CommonButton @click="addProgress">
        <template #icon>
          <Add />
        </template>
        {{ t('add') }}
      </CommonButton>
    </div>

    <CommonButton v-if="!isShowAdd" @click="toggleShow">
      {{ t('toggle_add') }}
    </CommonButton>

    <div class="flex flex-col gap-2">
      <ProgressItem v-for="item in progressList" :key="item.id" :item="item as any" />
    </div>

  </div>
</template>

<style scoped></style>

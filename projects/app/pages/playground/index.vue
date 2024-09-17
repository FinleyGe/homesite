<script setup lang="ts">
import PlaygroundItem from '~/components/PlaygroundItem.vue';
const localePath = useLocalePath();

const { t } = useI18n({
  messages: {
    en: {
      TodoList: 'Todo List',
      Tomato: 'Tomato',
      'Todo List Description': 'Todo List (Admin only)',
      'Tomato Description': 'Tomato Clock (Admin only)',
      Collective: 'Collective',
      CollectiveDescription: 'Collective',
    },
    zh: {
      TodoList: '待办列表',
      Tomato: '番茄钟',
      'Todo List Description': '待办列表（只有管理员可以访问）',
      'Tomato Description': '番茄钟（只有管理员可以访问）',
      Collective: '收集',
      CollectiveDescription: '收集',
    }
  }
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl"> {{ t('common.playground') }} </h1>
    <div class="flex flex-row mt-4 gap-4">
      <PlaygroundItem
        :name="t('TodoList')" :description="t('Todo List Description')"
        :link="localePath('/playground/todolist')" />
      <PlaygroundItem
        :name="t('Tomato')" :description="t('Tomato Description')"
        :link="localePath('/playground/tomato')" />
      <PlaygroundItem
        :name="t('Collective')" :description="t('CollectiveDescription')"
        :link="localePath('/playground/collective')" />
    </div>
  </div>

</template>

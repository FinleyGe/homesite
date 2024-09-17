<script setup lang="ts">
import type { Collection } from '@prisma/client';

const { item } = defineProps<{
  item: Collection;
}>();

const { t } = useI18n({
  messages: {
    'en': {
      collectedAt: 'Collected at',
    },
    'zh': {
      collectedAt: '拾于'
    }
  }
})

</script>
<template>
  <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <div class="flex flex-row items-center justify-between mb-4">
      <div class="text-lg">
        {{ item.content }}
      </div>
    </div>
    <div class="text-sm italic text-right">
      ---- {{ item.from }}
    </div>
    <div class="text-sm italic text-right">
      {{ t('collectedAt') }}
      {{ new Date(item.createdAt).toLocaleDateString() }}
    </div>
  </div>
</template>

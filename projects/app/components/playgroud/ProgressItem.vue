<script setup lang="ts">
import type { Progress } from '@prisma/client';
import { Minus, Plus } from '@vicons/fa';

const { item } = defineProps<{
  item: Progress,
}>();

</script>
<template>
  <div class="flex flex-row items-center gap-2 p-2">
    <div class="text-xl">
      {{ item.name }}
    </div>
    <div class="text-sm italic">
      {{ item.description }}
      {{ item.target }}/{{ item.status }}
    </div>
    <CommonButton circle>
      <template #icon>
        <Minus class="font-extralight" />
      </template>
    </CommonButton>
    <progress class="w-full" :value="item.status" :max="item.target" />
    <CommonButton circle>
      <template #icon>
        <Plus />
      </template>
    </CommonButton>
  </div>
</template>

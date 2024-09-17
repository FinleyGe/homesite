<script setup lang="ts">
import type { Collective } from '@prisma/client';

const { item } = defineProps<{
  item: Collective;
}>();

</script>
<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <div class="text-md">
        {{ item.content }}
      </div>
      <div class="text-sm italic text-right">
        ---- {{ item.from }}
      </div>
    </div>
    <div class="text-sm italic text-right">
      {{ new Date(item.createdAt).toLocaleDateString() }}
    </div>
  </div>
</template>

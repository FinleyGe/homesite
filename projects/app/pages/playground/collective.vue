<script setup lang="ts">
import type { Pagination } from '~/server/utils/pagination';
import { Restart } from '@vicons/carbon';

const page = ref<Pagination>({
  page: 1,
  limit: 10,
});

const { data, refresh: refreshCollectives } = useFetch('/api/collective/list', {
  params: page,
  lazy: true,
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center my-8"> Collective </h1>

    <CommonButton circle @click="refreshCollectives()">
      <template #icon>
        <Restart />
      </template>
    </CommonButton>

    <div class="flex flex-col gap-2">
      <PlaygroudCollectiveItem v-for="item in data" :key="item.id" :item="item" />
    </div>
  </div>
</template>

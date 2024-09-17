<script setup lang="ts">
import type { Pagination } from '~/server/utils/pagination';
const { t } = useI18n({
  messages: {
    'en': {
      collection: 'Collection',
    },
    'zh': {
      collection: '拾金'
    }
  }
});

const page = ref<Pagination>({
  page: 1,
  limit: 10,
});

const { data, refresh: refreshCollectives } = useFetch('/api/collection/list', {
  params: page,
  lazy: true,
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center my-8 cursor-pointer" @click="refreshCollectives()">
      {{ t('collection') }}
    </h1>

    <div class="flex flex-col gap-2">
      <PlaygroudCollectionItem v-for="item in data" :key="item.id" :item="item" />
    </div>

    <CommonButton v-if="data?.length === 10" circle @click="page.page++">
      Get More
    </CommonButton>
  </div>
</template>

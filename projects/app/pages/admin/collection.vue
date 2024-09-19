<script setup lang="ts">
import { TrashCan, Restart } from '@vicons/carbon'
import { Plus } from '@vicons/fa'
import CollectionItem from '~/components/playgroud/CollectionItem.vue';

const body = ref({
  content: '',
  from: '',
})

const page = ref(1);


const { data: collections, refresh: refreshCollections } = useFetch('/api/collection/list', {
  params: {
    page,
  },
  lazy: true,
});

const { execute: addCollection } = useFetch(
  '/api/collection/add', {
  method: 'POST',
  body,
  immediate: false,
  watch: false,
  $fetch: useApi(),
  onResponse: () => {
    refreshCollections();
  }
});

const deleteCollection = ref({
  id: '',
});

useFetch(
  '/api/collection/delete', {
  method: 'DELETE',
  params: deleteCollection,
  immediate: false,
  $fetch: useApi(),
  onResponse: () => {
    refreshCollections();
  }
});

</script>
<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-col gap-2">
      <CommonInput v-model="body.content" type="textarea" placeholder="Content" />
      <CommonInput v-model="body.from" placeholder="From" />
    </div>
    <div class="flex flex-row gap-2">
      <CommonButton circle @click="addCollection()">
        <template #icon>
          <Plus />
        </template>
      </CommonButton>
      <CommonButton circle @click="refreshCollections()">
        <template #icon>
          <Restart />
        </template>
      </CommonButton>
    </div>
    <div class="flex flex-col">
      <div v-for="item in collections" :key="item.id" class="flex flex-row items-center gap-2 p-2">
        <CommonButton circle @click="deleteCollection.id = item.id">
          <template #icon>
            <TrashCan />
          </template>
        </CommonButton>
        <div class="flex-1">
          <CollectionItem :item="item as any" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

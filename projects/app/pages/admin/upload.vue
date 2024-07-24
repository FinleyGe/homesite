<script setup lang="ts">
import { Delete, Download, Restart } from '@vicons/carbon';
import { useFetchWithToken } from '~/api/utils';
import Button from '~/components/common/Button.vue';
const { handleFileInput, files } = useFileStorage();
const filename = ref<string | null>(null);

const submit = async () => {
  const { data } = await useFetchWithToken<{
    filename: string;
  }>('/api/img/upload', {
    method: 'POST',
    body: {
      file: files.value[0]
    }
  });

  filename.value = data.value.filename;
  await getFiles();
}

const { data: filekeys, refresh: getFiles } = await useFetchWithToken<string[]>('/api/img/list', {
  method: 'GET'
});

const handleDelete = async (filename: string) => {
  confirm('Are you sure you want to delete this file?')
    && await useFetchWithToken(
      '/api/img/delete',
      { method: 'DELETE', query: { filename } }
    )
  await getFiles();
}

</script>
<template>
  <div>
    <h1>Upload</h1>
    <input type="file" capture @input="handleFileInput">
    <Button @click="() => { submit(); }">Upload</Button>
    <span v-if="filename">{{ 'https://www.f1nley.xyz/api/img/' + filename }}</span>
    <div>
      Files
      <button class="w-4" @click="getFiles">
        <Restart />
      </button>
      <span v-if="filekeys.length < 1"> Empty </span>
      <ul>
        <li v-for="file in filekeys" :key="file" class="flex items-center max-w-80">

          <button class="w-4 mx-1" @click="handleDelete(file)">
            <Delete />
          </button>

          <ClientOnly>
            <a :href="'/api/img/' + file" target="_blank" class="w-4 mx-1">
              <Download />
            </a>
          </ClientOnly>

          {{ file }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>

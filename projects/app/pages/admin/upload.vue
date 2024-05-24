<script setup lang="ts">
import { useFetchWithToken } from '~/api/utils';
import Button from '~/components/common/Button.vue';
const { handleFileInput, files } = useFileStorage();
const filename = ref<string | undefined>(undefined);

async function submit() {
  const { data } = await useFetchWithToken<{
    filename: string;
  }>('/api/img/upload', {
    method: 'POST',
    body: {
      file: files.value[0]
    }
  });
  console.log(data);
  filename.value = data.value?.filename;
}

</script>
<template>
  <div>
    <h1>Upload</h1>
    <input type="file" capture @input="handleFileInput">
    <Button @click="submit">Upload</Button>
    {{'https://www.f1nley.xyz/api/img/' + filename }}
  </div>
</template>

<style scoped></style>

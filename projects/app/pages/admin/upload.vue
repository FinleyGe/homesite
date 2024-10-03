<script setup lang="ts">
import { Delete, Download, Restart } from "@vicons/carbon";
import { toast } from "vue3-toastify";
import Button from "~/components/common/Button.vue";
const { handleFileInput, files } = useFileStorage();

const { execute: submit } = useFetch("/api/img/upload", {
  method: "POST",
  body: {
    file: computed(() => files.value[0]),
  },
  $fetch: useApi(),
  onResponse: () => {
    getFiles();
  },
  watch: false,
  immediate: false,
});

const { data: filekeys, refresh: getFiles } = await useFetch<string[]>(
  "/api/img/list",
  {
    method: "GET",
    $fetch: useApi(),
  }
);

const deleteFilename = ref<string>("");

useFetch("/api/img/delete", {
  method: "DELETE",
  query: {
    filename: deleteFilename,
  },
  $fetch: useApi(),
  watch: [deleteFilename],
  onResponse: () => {
    getFiles();
    toast.success("File deleted!");
  },
});

const handleDelete = async (filename: string) => {
  if (confirm("Are you sure you want to delete this file?")) {
    deleteFilename.value = filename;
  }
};
</script>

<template>
  <div>
    <h1>Upload</h1>
    <input type="file" capture @input="handleFileInput" />
    <Button
      @click="
        () => {
          submit();
        }
      "
    >
      Upload
    </Button>
    <span v-if="uploadFilename?.filename">
      {{ "https://www.f1nley.xyz/api/img/" + uploadFilename.filename }}</span
    >
    <div>
      Files
      <button class="w-4" @click="getFiles()">
        <Restart />
      </button>
      <span v-if="filekeys && filekeys?.length < 1"> Empty </span>
      <ul>
        <li
          v-for="file in filekeys"
          :key="file"
          class="flex items-center max-w-80"
        >
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

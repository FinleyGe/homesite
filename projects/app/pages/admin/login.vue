<script setup lang="ts">
import Button from '~/components/common/Button.vue'
import { toast } from 'vue3-toastify'
import useStore from '~/stores';

const body = ref({
  email: '',
  password: '',
})

const store = useStore()
const router = useRouter()

const { execute: login } = useFetch(
  '/api/user/login', {
  method: 'POST',
  body,
  watch: false,
  immediate: false,
  onResponse: ({ response }) => {
    store.expireAt = new Date(response._data?.expireAt);
    store.token = response._data?.accessToken;
    toast.success("Success");
    router.push('/admin')
  },
});

</script>
<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="p-4 rounded-xl w-fit bg-pink-50 dark:bg-pink-800 flex flex-col gap-4 shadow-2xl">
      <h1 class="text-2xl font-bold">Login</h1>
      <input v-model="body.email" placeholder="email">
      <input v-model="body.password" placeholder="password" type="password">
      <Button @click="login">Login</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  @apply p-2 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700;
}
</style>

<script setup lang="ts">
import Button from '~/components/common/Button.vue'

const email = ref<string>('')
const password = ref<string>('')

function handleLogin() {
  const { data, error } = useFetch(
    '/api/user/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    }
  }
  );
  if (error.value) {
    console.error(error.value)
  } else {
    console.log(data.value)
  }
}

</script>
<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="p-4 rounded-xl w-fit bg-pink-50 dark:bg-pink-800 flex flex-col gap-4 shadow-2xl">
      <h1 class="text-2xl font-bold">Login</h1>
      <input placeholder="email" v-model="email" />
      <input placeholder="password" v-model="password" type="password" />
      <Button @click="handleLogin">Login</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  @apply p-2 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700;
}
</style>

import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
  const token = ref<string | undefined>();
  const expireAt = ref<Date | undefined>();
  return {
    token,
    expireAt,
  }
}, {
  persist: true, // enable the plugin
})

export default useStore

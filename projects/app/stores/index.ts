import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
  const token = ref<string | null>(null);
  const expireAt = ref<Date | null>(null);
  return {
    token,
    expireAt,
  }
}, {
  persist: true, // enable the plugin
})

export default useStore

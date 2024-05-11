import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
  const token = ref<string | null>(null)
  return {
    token,
  }
},{
    persist: true, // enable the plugin
  },
)

export default useStore

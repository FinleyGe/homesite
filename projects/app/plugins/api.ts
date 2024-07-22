import useStore from "~/stores"

export default defineNuxtPlugin(() => {
  const store = useStore()

  const api = $fetch.create({
    onRequest({ options }) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${store.token}`
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})

export default defineEventHandler({
  onRequest: [auth],
  handler: async () => {
    return useStorage('img').getKeys();
  }
})

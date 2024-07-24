export default defineEventHandler({
  // onRequest: [auth],
  handler:
    async (event) => {
      const filename = getRouterParam(event, 'filename')
      if (!filename) {
        return new Response('Filename is required', { status: 400 })
      }
      const img = await useStorage('img').getItemRaw(filename)
      return img
    }
})

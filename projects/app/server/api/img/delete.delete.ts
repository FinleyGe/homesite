export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    // const filename = getRouterParam(event, 'filename')
    const {
      filename
    } = getQuery<{
      filename: string
    }>(event)
    if (!filename) {
      return new Response('Filename is required', { status: 400 })
    }
    return await useStorage('img').removeItem(filename)
  }
})

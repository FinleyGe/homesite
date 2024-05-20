export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const file = await readFormData(event)
  },
})

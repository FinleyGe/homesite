export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { file } = await readBody<{ file: Parameters<typeof storeFileLocally>[0] }>(event);
    const filename = await storeFileLocally(file, 8);

    return { filename }
  },
})

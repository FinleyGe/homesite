export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { file } = await readBody<{ file: File }>(event);
    const { ext } = parseDataUrl(file.content);
    const filename = `${Date.now()}`;

    await storeFileLocally(
      file.content,
      filename,
    );

    return {
      filename: `${filename}.${ext}`
    }
  },
})

interface File {
  name: string
  content: string
}

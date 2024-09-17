import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler({
  onRequest: [
    auth
  ],
  handler: async (event) => {
    const { content, from } = await readBody<{
      content: string
      from: string
    }>(event);

    return await prisma.collection.create({
      data: {
        content,
        from,
      }
    })
  }
})

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth
  ],
  handler: async (event) => {
    const id = getRouterParam(event, 'id')
    return await prisma.post.delete({
      where: { id }
    })
  }
})

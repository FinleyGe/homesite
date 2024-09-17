import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler({
  onRequest: [
    auth
  ],
  handler: async (event) => {
    const { id } = getQuery<{
      id: string
    }>(event);
    return await prisma.collective.delete({
      where: {
        id
      }
    })
  }
})

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth
  ],
  async handler(event) {
    const { id } = getQuery<{
      id: string;
    }>(event);

    return await prisma.progress.delete({
      where: {
        id
      }
    })
  }
})


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth
  ],
  async handler(event) {
    const { id, name, description, target, status } = await readBody<{
      id: string;
      name?: string;
      description?: string;
      target?: number;
      status?: number;
    }>(event);

    return await prisma.progress.update({
      where: {
        id
      },
      data: {
        name,
        description,
        target,
        status
      }
    })
  }
})

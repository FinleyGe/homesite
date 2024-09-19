import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth
  ],
  async handler(event) {
    const { name, description, target } = await readBody<{
      name: string;
      description?: string;
      target: number;
    }>(event);

    return await prisma.progress.create({
      data: {
        name,
        description,
        target
      }
    })
  }
})

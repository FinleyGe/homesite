import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { content, endTime, priority } = await readBody<{
      content: string,
      endTime?: string,
      priority?: number,
    }>(event);
    return prisma.todoList.create({
      data: {
        content,
        endTime,
        priority,
      }
    })
  }
}
)

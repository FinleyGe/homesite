import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { content, endTime } = await readBody<{
      content: string,
      endTime?: string,
    }>(event);
    return prisma.todoList.create({
      data: {
        content,
        done: false,
        endTime
      }
    })
  }
}
)

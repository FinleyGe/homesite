import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { id } = getRouterParams(event);
    const { done, content, endTime, priority } = await readBody<{
      done: boolean;
      content?: string;
      endTime?: string;
      priority?: number;
    }>(event);
    return prisma.todoList.update({
      where: {
        id: id
      },
      data: {
        done,
        content,
        endTime,
        priority,
      }
    })
  }
}
);

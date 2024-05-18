import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { id } = getRouterParams(event);
    const { done, content, endTime } = await readBody<{
      done: boolean;
      content?: string;
      endTime?: string;
    }>(event);
    return prisma.todoList.update({
      where: {
        id: id
      },
      data: {
        done,
        content,
        endTime,
      }
    })
  }
}
);

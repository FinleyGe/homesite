import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { id } = getRouterParams(event);
    const { done } = await readBody<{
      done: boolean;
    }>(event);
    return prisma.todoList.update({
      where: {
        id: id
      },
      data: {
        done,
      }
    })
  }
}
);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const { id } = getRouterParams(event);
    return prisma.todoList.delete({
      where: {
        id: id
      },
    })
  }
}
);

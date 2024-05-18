import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [auth],
  handler: async () => {
    return await prisma.todoList.findMany({
      orderBy: [
        {
          done: 'asc'
        }, {
          priority: 'asc',
        }, {
          createdAt: 'desc'
        },
      ]
    })
  }
})

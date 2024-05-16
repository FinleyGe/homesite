import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  return await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
  })
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth
  ],
  async handler(event) {
    const query = getQuery<{
      page: number;
      limit: number;
    }>(event);
    const page = typeof query.page === 'string' ? parseInt(query.page) : query.page || 1;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit) : query.limit || 10;

    const progressList = await prisma.progress.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: 'desc'
      }
    })

    return progressList
  }
})

import { PrismaClient } from "@prisma/client"
import type { Pagination } from "~/server/utils/pagination";

const prisma = new PrismaClient();

export default defineEventHandler({
  handler: async (event) => {
    const query = getQuery<Pagination>(event);
    const page = typeof query.page === 'string' ? parseInt(query.page) : query.page || 1;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit) : query.limit || 10;

    return await prisma.collection.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit,
    })
  }
})

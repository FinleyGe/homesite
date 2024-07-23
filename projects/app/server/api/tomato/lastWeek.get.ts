import { PrismaClient } from '@prisma/client';
import auth from '../../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async () => {
    return prisma.tomato.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
  }
})

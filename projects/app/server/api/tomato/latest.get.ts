import { PrismaClient } from '@prisma/client';
import auth from '../../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async () => {
    return prisma.tomato.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
})


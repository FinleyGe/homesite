import { PrismaClient } from '@prisma/client';
import auth from '../../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async (event) => {
    const {id} =  await readBody<{
      id: string,
    }>(event);

    return prisma.tomato.delete({
      where: {
        id
      }
    })
  }
})

import { PrismaClient } from '@prisma/client';
import auth from '../../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async (event) => {
    const body = await readBody<{
      focusOn?: string;
    }>(event);
    const lastTomato = await prisma.tomato.findFirst({
      orderBy: {
        createdAt: 'desc',
      }
    });
    
    // 25 minutes
    if (lastTomato && lastTomato.createdAt > new Date(new Date().getTime() - 25 * 60 * 1000)) {
      event.respondWith(new Response('You can only add a tomato every 25 minutes', {
        status: 400,
      }));
      return;
    }

    return prisma.tomato.create({
      data: {
        focusOn: body.focusOn,
      }
    });
  }
})

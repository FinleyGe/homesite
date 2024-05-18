import { PrismaClient } from '@prisma/client';
import auth from '../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async (event) => {
    const body = await readBody<{
      content: string,
      language: string,
    }>(event);
    return prisma.post.create({
      data: {
        content: body.content,
        language: body.language,
        author: {
          connect: event.context.user
        }
      }
    });
  }
})

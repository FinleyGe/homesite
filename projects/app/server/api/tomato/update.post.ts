import { PrismaClient } from '@prisma/client';
import auth from '../../utils/auth';

const prisma = new PrismaClient();

export default defineEventHandler({
  onRequest: [
    auth,
  ],
  handler: async (event) => {
    const body = await readBody<{
      id: string;
      focusOn?: string;
      score?: number;
    }>(event);

    if (!body.id) {
      return {
        status: 400,
        body: {
          message: 'id is required',
        },
      };
    }

    if (!body.focusOn && !body.score) {
      return {
        status: 400,
        body: {
          message: 'focusOn or score is required',
        },
      };
    }
    
    if (body.score && (body.score < 0 || body.score > 5)) {
      return {
        status: 400,
        body: {
          message: 'score must be between 0 and 5',
        },
      };
    }

    return prisma.tomato.update({
      where: {
        id: body.id,
      },
      data: {
        focusOn: body.focusOn,
        score: body.score,
      },
    });
  }
})

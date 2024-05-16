import jwt from 'jsonwebtoken';
import { JWTPayload } from '../type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const token = getRequestHeader(event, 'Authorization');
  if (!token) {
    return event.respondWith(new Response('Unauthorized', { status: 401 }));
  }
  const data = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string) as JWTPayload;
  if (!data) {
    return event.respondWith(new Response('Unauthorized', { status: 401 }));
  }
  const user = await prisma.user.findUnique({
    where: {
      id: data.id,
    }
  });
  if (!user) {
    return event.respondWith(new Response('Unauthorized', { status: 401 }));
  }
  event.context.user = user;
})

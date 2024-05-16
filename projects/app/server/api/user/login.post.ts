import { PrismaClient } from "@prisma/client";
import { compareHash } from "~/server/utils/crypto";
import jwt from 'jsonwebtoken';
const client = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string;
    password: string;
  }>(event);
  const user = await client.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (!user || !user.password) {
    event.respondWith(new Response("User not found", { status: 404 }));
  }
  if (compareHash(body.password, user!.password)) {
    return ({
      accessToken: jwt.sign(
        { id: user!.id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1d'
        }
      )
    })
  }
  event.respondWith(new Response("Invalid password", { status: 401 }));
});

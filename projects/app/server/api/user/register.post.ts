import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string;
    password: string;
  }>(event);

  const user = await client.user.count();
  if (user) {
    event.respondWith(new Response("User already exists", { status: 401 }));
  }
  return await client.user.create({
    data: {
      email: body.email,
      password: generateHash(body.password),
    },
  });
  // const user = await client.user.findFirst({
  //   where: {
  //     email: body.email,
  //   },
  // });
  // if (!user || !user.password) {
  //   event.respondWith(new Response("User not found", { status: 404 }));
  // }
  // if (compareHash(body.password, user!.password)) {
  //   return ({
  //     accessToken: jwt.sign(
  //       { id: user!.id },
  //       process.env.JWT_SECRET!,
  //       {
  //         expiresIn: '7d'
  //       }
  //     ),
  //     expireAt: addDays(Date.now(), 7)
  //   })
  // }
  // event.respondWith(new Response("Invalid password", { status: 401 }));
});

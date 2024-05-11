import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateHash } from 'src/utils/crypto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = generateHash(data.password);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async isUserExist(): Promise<boolean> {
    const user = await this.prisma.user.findFirst();
    return !!user;
  }

  async generateToken(user: User) {
    return await this.jwt.signAsync(user, { secret: process.env.JWT_SECRET });
  }

  async validateUser(token: string): Promise<User> {
    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
    return this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
  }
}

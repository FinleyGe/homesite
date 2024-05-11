import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.PostCreateInput) {
    return this.prismaService.post.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prismaService.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prismaService.post.delete({
      where: { id },
    });
  }

  async findLimit(limit: number) {
    return this.prismaService.post.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prismaService.post.findMany();
  }
}

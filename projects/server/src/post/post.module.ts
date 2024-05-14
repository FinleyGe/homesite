import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FediService } from './fedi.service';
@Module({
  imports: [PrismaModule, UserModule, JwtModule],
  providers: [PostService, UserService, FediService],
  controllers: [PostController],
})
export class PostModule {}

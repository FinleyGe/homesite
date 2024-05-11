import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, PrismaModule, PostModule, JwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

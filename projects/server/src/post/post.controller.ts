import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UserGuard } from 'src/user/user.guard';
import { FediService } from './fedi.service';
type CreateRequest = {
  content: string;
  language: string;
};

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService, private readonly fediService: FediService) {}

  @Post()
  @UseGuards(UserGuard)
  create(@Body() createRequest: CreateRequest, @Req() request: any) {
    return this.postService.create({
      content: createRequest.content,
      language: createRequest.language,
      author: {
        connect: {
          ...request.user,
        },
      },
    });
  }

  @Get('latest')
  findLatest() {
    return this.postService.findLimit(10);
  }

  @Get('all')
  findAll() {
    return this.postService.findAll();
  }

  @Get('fedi')
  async fedi() {
    return await this.fediService.getPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  remove(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}

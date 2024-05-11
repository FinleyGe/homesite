import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { compareHash } from 'src/utils/crypto';
import { Response } from 'express';
import { UserGuard } from './user.guard';

export interface RegisterRequest {
  email: string;
  name?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async isUserExist() {
    return await this.userService.isUserExist();
  }

  @Get('test')
  @UseGuards(UserGuard)
  async test(@Body() user: any) {
    console.log(user);
    return 'test';
  }

  @Post()
  async createUser(@Body() user: RegisterRequest, @Res() res: Response) {
    if (await this.userService.isUserExist()) {
      res.status(400).send('User already exist');
    }
    if (await this.userService.createUser(user)) {
      res.status(201).send('User created');
    }
  }

  @Post('login')
  async login(@Body() user: LoginRequest, @Res() res: Response) {
    const u = await this.userService.user({
      email: user.email,
    });
    if (!u) {
      res.status(400).send('User not found');
    }
    if (compareHash(user.password, u.password) === false) {
      res.status(400).send('Password not match');
    }
    const accessToken = await this.userService.generateToken(u);
    res.status(200).send({
      accessToken,
    });
  }
}

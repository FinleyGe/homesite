import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

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

  @Post()
  async createUser(@Body() user: RegisterRequest) {
    return await this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() user: LoginRequest) {
    const u = await this.userService.user(user);
    if (!u) {
      return { message: 'User not found' };
    }
    if (u.password !== user.password) {
      return { message: 'Password is incorrect' };
    }
    return { message: 'Login success' };
  }
}

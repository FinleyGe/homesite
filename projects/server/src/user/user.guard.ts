import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(" ")[1];
    const user = this.userService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    request.user = user;
    return true;
  }
}

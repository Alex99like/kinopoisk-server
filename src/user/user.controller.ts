import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('profile')
  @Auth('user')
  async getProfile() {
    return this.userService.byId()
  }
}

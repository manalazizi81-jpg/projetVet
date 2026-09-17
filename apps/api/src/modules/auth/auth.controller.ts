import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RateLimitService } from "../../security/rate-limit.service";
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService, private readonly rateLimit: RateLimitService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() request: { ip?: string; headers: Record<string, string | string[] | undefined> }) {
    await this.rateLimit.check(request, "login-ip", 10, 600);
    await this.rateLimit.check(request, "login-account", 30, 600, dto.email);
    return this.service.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: { admin: { id: string } }) { return this.service.profile(request.admin.id); }

  @Patch("me")
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() request: { admin: { id: string } }, @Body() body: { fullName?: string }) {
    return this.service.updateProfile(request.admin.id, body.fullName);
  }
}

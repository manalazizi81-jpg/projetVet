import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ContactService } from "./contact.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RateLimitService } from "../../security/rate-limit.service";
@Controller("contact")
export class ContactController {
  constructor(private readonly service: ContactService, private readonly rateLimit: RateLimitService) {}
  @Post() async create(@Body() dto: CreateContactDto, @Req() request: { ip?: string; headers: Record<string, string | string[] | undefined> }) {
    // Deux limites complémentaires empêchent le spam distribué ou répété avec la même adresse.
    await this.rateLimit.check(request, "contact-ip", 5, 900);
    await this.rateLimit.check(request, "contact-email", 3, 900, dto.email);
    return this.service.create(dto);
  }
  @Get() @UseGuards(JwtAuthGuard) findAll() { return this.service.findAll(); }
  @Patch(":id") @UseGuards(JwtAuthGuard) update(@Param("id") id: string, @Body("status") status: string) { return this.service.update(id, status); }
}

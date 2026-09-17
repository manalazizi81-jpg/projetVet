import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RateLimitService } from "../../security/rate-limit.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService, private readonly rateLimit: RateLimitService) {}

  @Post()
  async create(@Body() dto: CreateAppointmentDto, @Req() request: { ip?: string; headers: Record<string, string | string[] | undefined> }) {
    await this.rateLimit.check(request, "appointments-ip", 6, 900);
    await this.rateLimit.check(request, "appointments-email", 1, 3600, dto.ownerEmail);
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query("status") status?: string, @Query("date") date?: string) { return this.service.findAll(status, date); }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() body: { status?: string; adminNotes?: string }) { return this.service.update(id, body); }
}

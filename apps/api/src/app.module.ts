import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { ContactModule } from "./modules/contact/contact.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { GalleryModule } from "./modules/gallery/gallery.module";
import { RateLimitModule } from "./security/rate-limit.service";

@Module({
  imports: [PrismaModule, RateLimitModule, AuthModule, AppointmentsModule, AvailabilityModule, ContactModule, DashboardModule, GalleryModule],
  controllers: [HealthController]
})
export class AppModule {}

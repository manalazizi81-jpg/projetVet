import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async findForDate(date: string) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    const now = new Date();
    const slots = await this.prisma.availabilitySlot.findMany({
      where: { startsAt: { gte: start.getTime() > now.getTime() ? start : now, lte: end }, isBlocked: false },
      select: { id: true, startsAt: true, endsAt: true, appointments: { where: { status: { not: "CANCELLED" } }, select: { status: true } } },
      orderBy: { startsAt: "asc" },
    });
    return slots.map(({ appointments, ...slot }) => ({
      ...slot,
      isAvailable: appointments.length === 0,
      status: appointments.length === 0 ? "AVAILABLE" : appointments.some(({ status }) => status === "CONFIRMED" || status === "COMPLETED") ? "RESERVED" : "PENDING",
    }));
  }
}

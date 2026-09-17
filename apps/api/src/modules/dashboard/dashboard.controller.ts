import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
@Controller("dashboard") @UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async stats() {
    const now = new Date();
    await this.prisma.appointment.updateMany({
      where: { status: "CONFIRMED", slot: { endsAt: { lte: now } } },
      data: { status: "COMPLETED" },
    });
    const day = new Date(now); day.setHours(0, 0, 0, 0);
    const tomorrow = new Date(day); tomorrow.setDate(day.getDate() + 1);
    const week = new Date(day); week.setDate(day.getDate() - ((day.getDay() + 6) % 7));
    const nextWeek = new Date(week); nextWeek.setDate(week.getDate() + 7);
    const month = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const trendStart = new Date(day); trendStart.setDate(day.getDate() - 6);
    const [today, thisWeek, thisMonth, pending, messages, recentRequests, statusGroups, serviceGroups] = await Promise.all([
      this.prisma.appointment.count({ where: { slot: { startsAt: { gte: day, lt: tomorrow } } } }),
      this.prisma.appointment.count({ where: { slot: { startsAt: { gte: week, lt: nextWeek } } } }),
      this.prisma.appointment.count({ where: { slot: { startsAt: { gte: month, lt: nextMonth } } } }),
      this.prisma.appointment.count({ where: { status: "PENDING" } }),
      this.prisma.contactMessage.count({ where: { status: "NEW" } }),
      this.prisma.appointment.findMany({ where: { createdAt: { gte: trendStart, lt: tomorrow } }, select: { createdAt: true } }),
      this.prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } }),
      this.prisma.appointment.groupBy({ by: ["serviceLabel"], _count: { _all: true } }),
    ]);
    const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const counts = new Map<string, number>();
    for (const request of recentRequests) {
      const key = dayKey(request.createdAt);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(trendStart);
      date.setDate(trendStart.getDate() + index);
      const key = dayKey(date);
      return { date: key, count: counts.get(key) ?? 0 };
    });
    const statuses = statusGroups.map((group) => ({ status: group.status, count: group._count._all }));
    const services = serviceGroups.map((group) => ({ label: group.serviceLabel, count: group._count._all }))
      .sort((a, b) => b.count - a.count).slice(0, 5);
    return { today, thisWeek, thisMonth, pending, messages, trend, statuses, services };
  }
}

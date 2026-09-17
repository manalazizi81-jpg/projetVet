import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { AppointmentStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    const existing = await this.prisma.appointment.findUnique({ where: { requestKey: dto.requestKey }, select: { id: true, status: true } });
    if (existing) return existing;
    const service = await this.prisma.service.findUnique({ where: { slug: dto.serviceSlug } });
    if (!service || !service.isBookable) throw new NotFoundException("Service indisponible");

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Les réservations d'une même heure attendent ce verrou avant de vérifier sa disponibilité.
        await tx.$queryRaw`SELECT "id" FROM "AvailabilitySlot" WHERE "id" = ${dto.slotId}::uuid FOR UPDATE`;
        const duplicate = await tx.appointment.findUnique({ where: { requestKey: dto.requestKey }, select: { id: true, status: true } });
        if (duplicate) return duplicate;
        const slot = await tx.availabilitySlot.findUnique({
          where: { id: dto.slotId },
          include: { appointments: { where: { status: { not: "CANCELLED" } }, select: { id: true } } },
        });
        if (!slot || slot.isBlocked || slot.startsAt <= new Date() || slot.appointments.length) {
          throw new ConflictException("Ce créneau est déjà réservé ou indisponible.");
        }
        const client = await tx.client.create({ data: { fullName: dto.ownerName, phone: dto.ownerPhone, email: dto.ownerEmail } });
        const animal = await tx.animal.create({ data: { clientId: client.id, name: dto.animalName, species: dto.species, breed: dto.breed } });
        return tx.appointment.create({
          data: { clientId: client.id, animalId: animal.id, serviceId: service.id, slotId: slot.id, status: "PENDING", ownerName: dto.ownerName, ownerPhone: dto.ownerPhone, ownerEmail: dto.ownerEmail, serviceLabel: service.title, message: dto.message, requestKey: dto.requestKey },
          select: { id: true, status: true, createdAt: true },
        });
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        throw new ConflictException("Ce créneau vient d’être réservé.");
      }
      throw error;
    }
  }

  private completeFinishedAppointments() {
    return this.prisma.appointment.updateMany({
      where: { status: "CONFIRMED", slot: { endsAt: { lte: new Date() } } },
      data: { status: "COMPLETED" },
    });
  }

  async findAll(status?: string, date?: string) {
    await this.completeFinishedAppointments();
    const where: Prisma.AppointmentWhereInput = {};
    if (status) where.status = status as AppointmentStatus;
    if (date) where.slot = { startsAt: { gte: new Date(`${date}T00:00:00Z`), lte: new Date(`${date}T23:59:59Z`) } };
    return this.prisma.appointment.findMany({ where, include: { animal: true, client: true, slot: true, service: true }, orderBy: { slot: { startsAt: "desc" } }, take: 200 });
  }

  async update(id: string, body: { status?: string; adminNotes?: string }) {
    if (body.status && !["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(body.status)) throw new BadRequestException("Statut invalide");
    if (body.adminNotes !== undefined && (typeof body.adminNotes !== "string" || body.adminNotes.length > 2000)) throw new BadRequestException("Note invalide ou trop longue");
    const exists = await this.prisma.appointment.findUnique({ where: { id }, select: { id: true, slotId: true, slot: { select: { endsAt: true } } } });
    if (!exists) throw new NotFoundException("Rendez-vous introuvable");
    const requestedStatus = body.status === "CONFIRMED" && exists.slot.endsAt <= new Date() ? "COMPLETED" : body.status;
    const data = { status: requestedStatus as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | undefined, adminNotes: body.adminNotes };
    if (!body.status) return this.prisma.appointment.update({ where: { id }, data, include: { animal: true, client: true, slot: true, service: true } });

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "AvailabilitySlot" WHERE "id" = ${exists.slotId}::uuid FOR UPDATE`;
      if (body.status !== "CANCELLED") {
        const other = await tx.appointment.findFirst({ where: { slotId: exists.slotId, id: { not: id }, status: { not: "CANCELLED" } }, select: { id: true } });
        if (other) throw new ConflictException("Ce créneau est déjà réservé par un autre client.");
      }
      return tx.appointment.update({ where: { id }, data, include: { animal: true, client: true, slot: true, service: true } });
    });
  }
}
